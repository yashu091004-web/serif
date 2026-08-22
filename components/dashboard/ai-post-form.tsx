"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { BlogEditor } from "@/components/dashboard/blog-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneratedPost {
  title: string;
  summary: string;
  body: string;
}

const tones = ["professional", "casual", "playful", "persuasive"] as const;
const lengths = [
  { value: "short", label: "Short (~300 words)" },
  { value: "medium", label: "Medium (~600 words)" },
  { value: "long", label: "Long (~1000 words)" },
] as const;

export function AIPostForm() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedPost | null>(null);
  const [generationKey, setGenerationKey] = useState(0);

  async function generate() {
    if (topic.trim().length < 5) {
      toast.error("Describe your topic in at least 5 characters.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      setGenerated(data as GeneratedPost);
      setGenerationKey((key) => key + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Generation failed."
      );
    } finally {
      setGenerating(false);
    }
  }

  if (generated) {
    return (
      <div className="space-y-5">
        <div className="animate-in fade-in mx-auto flex max-w-3xl flex-col gap-3 rounded-xl bg-card px-5 py-4 ring-1 ring-foreground/10 duration-500 ease-out motion-reduce:animate-none sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5 text-sm">
            <Sparkles className="size-4 shrink-0 text-primary" />
            <span className="truncate text-muted-foreground">
              Draft generated for &ldquo;{topic.trim()}&rdquo; — edit anything
              before saving.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generate}
            disabled={generating}
            className="shrink-0 gap-1.5"
          >
            {generating ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Regenerating…
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5" />
                Regenerate
              </>
            )}
          </Button>
        </div>
        <BlogEditor key={generationKey} initial={generated} heading="AI draft" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out [animation-fill-mode:both] motion-reduce:animate-none">
        <Link
          href="/dashboard/blogs/new"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to options
        </Link>
        <h1 className="mt-3 flex items-center gap-2.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Create with AI
          <Sparkles className="size-6 text-primary" />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what the post should cover — you can edit every field after.
        </p>
      </header>

      <section className="animate-in fade-in slide-in-from-bottom-3 space-y-5 rounded-xl ring-1 ring-foreground/10 p-5 duration-500 ease-out [animation-delay:80ms] [animation-fill-mode:both] motion-reduce:animate-none sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={500}
            placeholder="e.g. How morning routines shape creative output, aimed at freelance writers"
            className="min-h-24"
          />
          <p className="text-xs text-muted-foreground">
            Be specific — include the angle you want the post to take.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select
              value={tone}
              onValueChange={(value) => setTone(value ?? "professional")}
            >
              <SelectTrigger id="tone" className="w-full capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="capitalize"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Select
              value={length}
              onValueChange={(value) => setLength(value ?? "medium")}
            >
              <SelectTrigger id="length" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lengths.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={generate} disabled={generating} className="gap-1.5">
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate draft
              </>
            )}
          </Button>
          {generating && (
            <p className="text-xs text-muted-foreground">
              Writing your post… this can take up to a minute.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
