import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "Unlimited manual posts",
  "Rich-text editor & draft workflow",
  "Publish to your public blog",
  "Post management dashboard",
];

const PRO_FEATURES = [
  "Everything in Free",
  "AI blog generation — topic to editable draft in seconds",
  "Unlocks all app features",
];

/**
 * Landing-page pricing. Business logic mirrors /pricing exactly:
 * logged out → signup, free user → existing Stripe checkout via
 * UpgradeButton, Pro user → current-plan badge. No billing code here.
 */
export function PricingSection({
  isLoggedIn,
  isPro,
}: {
  isLoggedIn: boolean;
  isPro: boolean;
}) {
  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="scroll-mt-24 bg-paper px-6 pt-16 pb-16 text-ink sm:pt-20 sm:pb-20"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tighter sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-sm text-ink-soft">
            Start free. Upgrade when your writing does.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl bg-paper-card p-7 shadow-[0_18px_50px_rgba(10,10,10,0.08)]">
              <h3 className="font-display text-lg font-bold">Free</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold tracking-tight">
                  $0
                </span>
                <span className="text-sm text-ink-soft">/month</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Everything you need to write and publish on your own.
              </p>
              <ul className="mt-6 space-y-2.5">
                {FREE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-ink-soft"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                {!isLoggedIn ? (
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "w-full rounded-full"
                    )}
                  >
                    Get Started
                  </Link>
                ) : (
                  <span className="block w-full rounded-full border border-ink/15 px-4 py-2.5 text-center text-sm font-medium text-ink-soft">
                    {isPro ? "Included in your account" : "Your current plan"}
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative flex h-full flex-col rounded-2xl bg-paper-card p-7 shadow-[0_18px_50px_rgba(10,10,10,0.08)] ring-2 ring-gold-deep/40">
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink uppercase">
                Best value
              </span>
              <h3 className="font-display text-lg font-bold">Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold tracking-tight">
                  $20
                </span>
                <span className="text-sm text-ink-soft">/month</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Unlocks all app features, including creating blogs with AI.
              </p>
              <ul className="mt-6 space-y-2.5">
                {PRO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-ink-soft"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                {!isLoggedIn ? (
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full rounded-full bg-ink text-paper hover:bg-ink/85"
                    )}
                  >
                    Get Started
                  </Link>
                ) : isPro ? (
                  <span className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-semibold text-emerald-700">
                    <Check className="size-4" />
                    Current Plan
                  </span>
                ) : (
                  <UpgradeButton
                    label="Upgrade"
                    className="w-full rounded-full bg-ink text-paper hover:bg-ink/85"
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Subscriptions renew monthly. Cancel anytime — your Pro features stay
          active until the end of the billing period.
        </p>
      </div>
    </section>
  );
}
