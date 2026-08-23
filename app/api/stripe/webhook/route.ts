import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveUserId, syncSubscription } from "@/lib/billing";

const RELEVANT_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

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
      if (!session.subscription) {
        return NextResponse.json({ received: true });
      }
      const sub = await getStripe().subscriptions.retrieve(
        session.subscription as string
      );
      // Metadata is the fast path; fall back to the customer → profile
      // lookup so sessions created without metadata never silently skip.
      const userId =
        session.metadata?.userId ||
        session.client_reference_id ||
        (await resolveUserId(admin, sub));
      if (!userId) {
        console.error(`No user found for checkout session ${session.id}`);
        return NextResponse.json({ received: true });
      }
      await syncSubscription(admin, sub, userId);
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
