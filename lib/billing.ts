import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export function mapToProfileStatus(subscriptionStatus: string): string | null {
  switch (subscriptionStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete":
    case "incomplete_expired":
      return "cancelled";
    default:
      return null;
  }
}

function customerIdOf(sub: Stripe.Subscription): string | null {
  if (!sub.customer) return null;
  return typeof sub.customer === "string" ? sub.customer : sub.customer.id;
}

// In current Stripe API versions the period fields live on subscription items.
function periodOf(sub: Stripe.Subscription): {
  start: number | null;
  end: number | null;
} {
  const item = sub.items.data[0];
  return {
    start:
      (item as { current_period_start?: number } | undefined)
        ?.current_period_start ?? null,
    end:
      (item as { current_period_end?: number } | undefined)
        ?.current_period_end ?? null,
  };
}

export async function resolveUserId(
  admin: SupabaseClient,
  sub: Stripe.Subscription,
  fallbackUserId?: string | null
): Promise<string | null> {
  const fromMetadata = sub.metadata?.userId;
  if (fromMetadata) return fromMetadata;

  if (fallbackUserId) return fallbackUserId;

  const { data: existing } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (existing?.user_id) return existing.user_id;

  const customerId = customerIdOf(sub);
  if (!customerId) return null;
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return profile?.id ?? null;
}

export async function syncSubscription(
  admin: SupabaseClient,
  sub: Stripe.Subscription,
  userId: string
) {
  const period = periodOf(sub);
  const customerId = customerIdOf(sub);

  const { error: upsertError } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        price_id: sub.items.data[0]?.price?.id ?? null,
        status: sub.status,
        current_period_start: period.start
          ? new Date(period.start * 1000).toISOString()
          : null,
        current_period_end: period.end
          ? new Date(period.end * 1000).toISOString()
          : null,
        cancel_at_period_end: sub.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" }
    );
  if (upsertError) throw new Error(upsertError.message);

  const profileStatus = mapToProfileStatus(sub.status);
  if (profileStatus) {
    const updates: Record<string, string> = {
      subscription_status: profileStatus,
    };
    if (customerId) updates.stripe_customer_id = customerId;
    const { error: profileError } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", userId);
    if (profileError) throw new Error(profileError.message);
  }
}

type ReconcileResult = "synced" | "unpaid" | "failed";

/**
 * Safety net for environments where Stripe cannot deliver webhooks to the app
 * (localhost without `stripe listen`, hosts behind restrictive firewalls).
 * Verifies the checkout session directly against the Stripe API and applies
 * the exact same subscription sync the webhook performs. Idempotent — safe to
 * call on every visit to /success.
 */
export async function reconcileCheckoutSession(
  sessionId: string
): Promise<ReconcileResult> {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.mode !== "subscription" ||
      session.payment_status !== "paid" ||
      !session.subscription
    ) {
      return "unpaid";
    }

    const sub = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const admin = createAdminClient();
    const userId = await resolveUserId(
      admin,
      sub,
      session.metadata?.userId || session.client_reference_id
    );
    if (!userId) {
      console.error(`No user found for checkout session ${session.id}`);
      return "failed";
    }

    await syncSubscription(admin, sub, userId);
    return "synced";
  } catch (error) {
    console.error("Checkout session reconciliation failed:", error);
    return "failed";
  }
}
