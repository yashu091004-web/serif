import Link from "next/link";
import { CircleCheck, LayoutDashboard } from "lucide-react";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Welcome to Pro | Serif",
};

async function verifySession(
  sessionId: string | undefined
): Promise<boolean> {
  if (!sessionId || !isStripeConfigured()) return false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const paid = await verifySession(session_id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center duration-700 ease-out [animation-fill-mode:both] motion-reduce:animate-none sm:py-28">
      <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <CircleCheck className="size-9" />
      </span>
      <Badge variant="secondary" className="mt-6">
        Payment successful
      </Badge>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Welcome to Serif Pro!
      </h1>
      <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
        Your subscription is active. AI blog creation and every Pro feature is
        now unlocked in your dashboard.
      </p>
      {!paid && (
        <p className="mt-4 text-xs text-muted-foreground">
          We&apos;re confirming your payment — your plan status updates
          automatically within a few seconds.
        </p>
      )}
      <Button render={<Link href="/dashboard" />} size="lg" className="mt-8 gap-1.5">
        <LayoutDashboard className="size-4" />
        Go to Dashboard
      </Button>
    </div>
  );
}
