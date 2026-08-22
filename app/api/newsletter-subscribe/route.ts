import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/loops";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: { email?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email =
    typeof payload.email === "string"
      ? payload.email.trim().toLowerCase()
      : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!process.env.LOOPS_API_KEY) {
    return NextResponse.json(
      { error: "Subscriptions are unavailable right now." },
      { status: 500 }
    );
  }

  const result = await subscribeToNewsletter(email);
  if (!result.success) {
    return NextResponse.json(
      { error: "Could not subscribe you right now. Try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
