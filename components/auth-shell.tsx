import type { ReactNode } from "react";
import { Sparkles, Wand2, Rocket } from "lucide-react";
import { Logo } from "@/components/logo";

const highlights = [
  {
    icon: Sparkles,
    title: "AI-generated drafts",
    description: "Turn an idea into a structured draft in seconds.",
  },
  {
    icon: Wand2,
    title: "Smart optimization",
    description: "Readability and SEO suggestions that respect your voice.",
  },
  {
    icon: Rocket,
    title: "One-click publishing",
    description: "Manage drafts and published posts from one dashboard.",
  },
];

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-[46%] overflow-hidden border-r border-border/70 lg:block">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-sky-500/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,black,transparent)]"
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="animate-in fade-in duration-700 ease-out motion-reduce:animate-none">
            <Logo />
          </div>
          <div className="animate-in fade-in slide-in-from-left-4 max-w-md duration-700 ease-out [animation-delay:150ms] motion-reduce:animate-none">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-balance">
              The Intelligent Future of Blogging
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Create, optimize, and publish compelling content with the help of
              AI — in minutes, not days.
            </p>
            <ul className="mt-10 space-y-5">
              {highlights.map((item) => (
                <li key={item.title} className="flex gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                    <item.icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Serif. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-sm duration-700 ease-out motion-reduce:animate-none">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight lg:mt-0">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}