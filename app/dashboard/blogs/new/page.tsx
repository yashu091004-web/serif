import Link from "next/link";
import { ArrowRight, Lock, PenLine, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";

const options = [
  {
    href: "/dashboard/blogs/new/manual",
    icon: PenLine,
    title: "Create manually",
    description:
      "Start from a blank page with full control over every field.",
    proOnly: false,
  },
  {
    href: "/dashboard/blogs/new/ai",
    icon: Sparkles,
    title: "Create with AI",
    description: "Describe your topic and get an editable draft in seconds.",
    proOnly: true,
  },
];

export default async function NewBlogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userIsPro = user ? await isPro(supabase, user.id) : false;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out [animation-fill-mode:both] motion-reduce:animate-none">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Create a new post
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start from scratch or let AI draft it for you.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option, index) => {
          const locked = option.proOnly && !userIsPro;
          return (
            <Link
              key={option.href}
              href={locked ? "/pricing" : option.href}
              style={{ animationDelay: `${80 + index * 90}ms` }}
              className="animate-in fade-in slide-in-from-bottom-3 group relative flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10 transition-all duration-300 ease-out [animation-fill-mode:both] hover:-translate-y-1 hover:shadow-lg motion-reduce:animate-none"
            >
              {locked && (
                <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[0.6875rem] font-semibold text-primary">
                  <Lock className="size-3" />
                  PRO
                </span>
              )}
              <span className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                <option.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                {option.title}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {option.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-primary">
                {locked ? "Unlock with Pro" : "Continue"}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
