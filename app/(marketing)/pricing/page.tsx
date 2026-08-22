import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionStatus } from "@/lib/subscription";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UpgradeButton } from "@/components/billing/upgrade-button";

export const metadata = {
  title: "Pricing | Serif",
  description:
    "Start free and write manually. Go Pro for $20/month to unlock AI blog generation and every app feature.",
};

const freeFeatures = [
  "Unlimited manual posts",
  "Rich-text editor & draft workflow",
  "Publish to your public blog",
  "Post management dashboard",
];

const proFeatures = [
  "Everything in Free",
  "AI blog generation — topic to editable draft in seconds",
  "Unlocks all app features",
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const supabase = await createClient();
  const [{ data: { user } }, params] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
  ]);
  const status = user ? await getSubscriptionStatus(supabase, user.id) : null;
  const isPro = status === "active";
  const canceled = params.canceled === "1";

  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
      <div className="animate-in fade-in slide-in-from-bottom-3 mx-auto max-w-2xl text-center duration-700 ease-out motion-reduce:animate-none">
        <Badge
          variant="outline"
          className="gap-1.5 border-primary/20 bg-primary/5 text-primary"
        >
          <Sparkles className="size-3" />
          Pricing
        </Badge>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Start free. Upgrade when you&apos;re ready.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Write manually forever on the Free plan — or go Pro and let AI handle
          the heavy lifting.
        </p>
        {canceled && (
          <p className="mx-auto mt-6 w-fit rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-600 dark:text-amber-500">
            Checkout canceled — you weren&apos;t charged.
          </p>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 mt-12 grid gap-5 duration-700 ease-out [animation-delay:120ms] [animation-fill-mode:both] motion-reduce:animate-none sm:grid-cols-2">
        <Card className="flex h-full flex-col p-6 transition-shadow hover:shadow-md">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Free
          </h2>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display text-4xl font-semibold tracking-tight">
              $0
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Everything you need to write and publish on your own.
          </p>
          <ul className="mt-6 space-y-2.5">
            {freeFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            {!user ? (
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full"
                )}
              >
                Get started
              </Link>
            ) : (
              <span className="block w-full rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
                {isPro ? "Included in your account" : "Your current plan"}
              </span>
            )}
          </div>
        </Card>

        <Card className="relative flex h-full flex-col border-primary/40 bg-primary/[0.03] p-6 shadow-lg ring-1 ring-primary/20">
          <Badge className="absolute -top-3 left-6 gap-1.5">
            <Sparkles className="size-3" />
            Best value
          </Badge>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Pro
          </h2>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-display text-4xl font-semibold tracking-tight">
              $20
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Unlocks all app features, including creating blogs with AI.
          </p>
          <ul className="mt-6 space-y-2.5">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            {!user ? (
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Create an account
              </Link>
            ) : isPro ? (
              <span className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-500">
                <Check className="size-4" />
                Current plan
              </span>
            ) : (
              <UpgradeButton className="w-full" />
            )}
          </div>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Subscriptions renew monthly. Cancel anytime — your Pro features stay
        active until the end of the billing period.
      </p>
    </div>
  );
}
