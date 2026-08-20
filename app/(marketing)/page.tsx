import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Rocket,
  FolderKanban,
  Check,
  ArrowRight,
  TrendingUp,
  FileText,
  PenLine,
  Eye,
  Clock,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const features = [
  {
    icon: Sparkles,
    title: "AI Blog Generation",
    description:
      "Generate high-quality blog drafts with AI. Turn a topic or outline into a structured draft in seconds.",
  },
  {
    icon: Wand2,
    title: "Content Optimization",
    description:
      "Improve readability, structure, and SEO with instant suggestions that keep your voice intact.",
  },
  {
    icon: Rocket,
    title: "Easy Publishing",
    description:
      "Manage drafts and published posts from one dashboard. Publish with a single click.",
  },
  {
    icon: FolderKanban,
    title: "Content Management",
    description:
      "Organize and manage all blog posts in one place with search, filters, and effortless sorting.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For getting started with AI-assisted writing.",
    features: [
      "5 AI-generated drafts / month",
      "Basic content editor",
      "3 published posts",
      "Email support",
    ],
    cta: "Start for free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For serious writers who publish regularly.",
    features: [
      "Unlimited AI drafts",
      "Content optimization & SEO",
      "Unlimited published posts",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and publications at scale.",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Custom AI models",
      "SSO & advanced security",
      "Dedicated success manager",
    ],
    cta: "Contact sales",
    href: "/signup",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
            <div className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-32 -left-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute top-48 -right-40 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]" />
          </div>

          <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-24">
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-primary"
            >
              <Sparkles className="size-3" />
              AI-powered blogging platform
            </Badge>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
              The Intelligent Future of Blogging
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Harness the power of AI to create, optimize, and publish
              compelling content in seconds.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className={buttonVariants({ size: "lg", className: "gap-1.5" })}
              >
                Start Writing
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Log In
              </Link>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24">
            <Card className="overflow-hidden ring-1 ring-border/60 shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/40 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="size-2.5 rounded-full bg-border" />
                <span className="ml-3 text-xs font-medium text-muted-foreground">
                  serif.app / dashboard
                </span>
              </div>
              <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_2fr]">
                <div className="hidden flex-col gap-1 rounded-lg border border-border/70 bg-muted/20 p-3 lg:flex">
                  <div className="mb-2 flex items-center gap-2 px-1.5">
                    <span className="flex size-5 items-center justify-center rounded bg-primary font-display text-[0.625rem] font-semibold text-primary-foreground">
                      S
                    </span>
                    <span className="font-display text-sm font-semibold tracking-tight">
                      Serif
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium">
                    <FileText className="size-3.5" />
                    Home
                  </div>
                  <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                    <PenLine className="size-3.5" />
                    Blogs
                  </div>
                  <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                    <Settings className="size-3.5" />
                    Settings
                  </div>
                  <div className="mt-auto flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                    <Avatar className="size-5">
                      <AvatarFallback className="bg-primary/10 text-[0.625rem] font-semibold text-primary">
                        YO
                      </AvatarFallback>
                    </Avatar>
                    You
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Total Posts", value: "18", icon: FileText },
                      { label: "Drafts", value: "5", icon: PenLine },
                      { label: "Monthly Views", value: "12.4k", icon: Eye },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg border border-border/70 bg-background p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[0.6875rem] font-medium text-muted-foreground">
                            {stat.label}
                          </span>
                          <stat.icon className="size-3.5 text-primary/60" />
                        </div>
                        <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background p-3">
                    <p className="text-[0.6875rem] font-medium text-muted-foreground">
                      Recent posts
                    </p>
                    <div className="mt-2 space-y-2">
                      {[
                        {
                          title: "Getting Started with Serif",
                          status: "Published",
                          views: "1.2k",
                          time: "Aug 15",
                        },
                        {
                          title: "Draft Better Ideas, Faster",
                          status: "Draft",
                          views: "—",
                          time: "Aug 16",
                        },
                      ].map((row) => (
                        <div
                          key={row.title}
                          className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium">
                              {row.title}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                              <Clock className="size-3" />
                              {row.time}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Badge
                              variant={
                                row.status === "Published"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-[0.625rem]"
                            >
                              {row.status}
                            </Badge>
                            <span className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
                              <Eye className="size-3" />
                              {row.views}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 border-y border-border/70 bg-muted/30 px-4 py-20 sm:px-6 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need to write and publish
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                A focused set of tools that move you from idea to published post
                — without the complexity of a full CMS.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="group p-5 transition-colors hover:border-primary/30"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Start free. Upgrade when your writing does.
              </p>
            </div>
            <div className="mt-12 grid items-start gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.highlight ? "border-primary/40 bg-primary/[0.03] shadow-lg" : ""}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {plan.name}
                      </h3>
                      {plan.highlight && (
                        <Badge>Most popular</Badge>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-semibold tracking-tight">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {plan.description}
                    </p>
                    <Link
                      href={plan.href}
                      className={buttonVariants({
                        variant: plan.highlight ? "default" : "outline",
                        className: "mt-5 w-full",
                      })}
                    >
                      {plan.cta}
                    </Link>
                    <ul className="mt-6 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/70 bg-muted/30 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/20 bg-primary/5 text-primary"
            >
              <TrendingUp className="size-3" />
              Start today
            </Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Your next great post is minutes away.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-7 text-muted-foreground">
              Join Serif and let AI handle the heavy lifting while you focus on
              the writing.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className={buttonVariants({ size: "lg", className: "gap-1.5" })}>
                Start Writing
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/blog"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Read the blog
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}