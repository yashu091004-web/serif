import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const RELEVANT_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

function mapToProfileStatus(subscriptionStatus: string): string | null {
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

async function resolveUserId(
  admin: SupabaseClient,
  sub: Stripe.Subscription
): Promise<string | null> {
  const fromMetadata = sub.metadata?.userId;
  if (fromMetadata) return fromMetadata;

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

async function syncSubscription(
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

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Idempotent raw-event log — duplicate deliveries are ignored.
  const { error: logError } = await admin.from("transactions").insert({
    stripe_event_id: event.id,
    type: event.type,
    payload: event,
  });
  if (
    logError &&
    !logError.message.includes("duplicate key") &&
    logError.code !== "23505"
  ) {
    console.error("Failed to log transaction:", logError.message);
  }

  if (!RELEVANT_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId || session.client_reference_id;
      if (session.subscription && userId) {
        const sub = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );
        await syncSubscription(admin, sub, userId);
      }
    } else {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await resolveUserId(admin, sub);
      if (!userId) {
        console.error(`No user found for subscription ${sub.id}`);
        return NextResponse.json({ received: true });
      }
      await syncSubscription(admin, sub, userId);
    }
  } catch (error) {
    console.error(`Webhook handler failed for ${event.type}:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
