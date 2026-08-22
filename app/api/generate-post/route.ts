import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";
const ALLOWED_TONES = ["professional", "casual", "playful", "persuasive"];

const SYSTEM_PROMPT = [
  "You are an expert blog writer for the Serif blogging platform.",
  'Return STRICT JSON only — no markdown fences, no commentary — shaped exactly: {"title": string, "summary": string, "body": string}',
  "Rules:",
  "- title: a compelling headline, maximum 80 characters, plain text without surrounding quotes.",
  "- summary: a one or two sentence teaser, maximum 200 characters.",
  "- body: the complete article as semantic HTML using ONLY these tags: h2, h3, p, strong, em, ul, ol, li, blockquote, a.",
  "- Start the body with a <p> paragraph and use h2 tags for section headings. Do not include an h1 title inside the body.",
  "- No inline styles, class attributes, scripts, or HTML comments anywhere.",
].join("\n");

function extractJson(raw: string): Record<string, unknown> | null {
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asCleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "You need to be signed in." },
      { status: 401 }
    );
  }

  if (!(await isPro(supabase, user.id))) {
    return NextResponse.json(
      {
        error:
          "AI blog creation is a Pro feature. Upgrade at /pricing to unlock it.",
        code: "pro_required",
      },
      { status: 403 }
    );
  }

  let payload: {
    topic?: unknown;
    tone?: unknown;
    length?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const topic = typeof payload.topic === "string" ? payload.topic.trim() : "";
  if (topic.length < 5 || topic.length > 500) {
    return NextResponse.json(
      { error: "Topic must be between 5 and 500 characters." },
      { status: 400 }
    );
  }

  const tone =
    typeof payload.tone === "string" &&
    ALLOWED_TONES.includes(payload.tone.toLowerCase())
      ? payload.tone.toLowerCase()
      : "professional";
  const words =
    payload.length === "short" ? 300 : payload.length === "long" ? 1000 : 600;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI generation is not configured (missing GROQ_API_KEY)." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 6000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Write a ${tone} blog post of roughly ${words} words about:\n\n${topic}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      const code = detail?.error?.code;
      const type = detail?.error?.type;
      if (code === "rate_limit_exceeded" || type === "tokens") {
        return NextResponse.json(
          {
            error:
              "Groq free-tier minute limit hit — wait about a minute and try again.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "The AI service rejected the request. Try again shortly." },
        { status: 502 }
      );
    }

    const completion = await response.json();
    const raw: string =
      completion?.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(raw);
    const title = parsed ? asCleanString(parsed.title, 200) : null;
    const summary = parsed ? asCleanString(parsed.summary, 300) : null;
    const body = parsed ? asCleanString(parsed.body, 200_000) : null;

    if (!title || !summary || !body) {
      return NextResponse.json(
        { error: "The AI returned an unexpected format. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ title, summary, body });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "The AI took too long to respond. Try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "AI generation failed. Try again." },
      { status: 502 }
    );
  }
}
