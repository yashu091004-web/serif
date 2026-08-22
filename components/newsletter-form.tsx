"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }
      setDone(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-xl border border-emerald-600/20 bg-emerald-600/5 px-4 py-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" />
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          You&apos;re on the list! Watch your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubscribe}
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <Input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 flex-1"
        aria-label="Email address"
      />
      <Button type="submit" size="lg" disabled={loading} className="h-11">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Subscribe
      </Button>
    </form>
  );
}
