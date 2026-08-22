import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "You need to be signed in." },
      { status: 401 }
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Billing is not configured yet. Try again later." },
      { status: 503 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id, subscription_status")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("Failed to load profile:", profileError.message);
    return NextResponse.json(
      { error: "Could not load your account. Try again." },
      { status: 500 }
    );
  }

  if (profile?.subscription_status === "active") {
    return NextResponse.json(
      { error: "You are already on the Pro plan." },
      { status: 409 }
    );
  }

  const origin = new URL(request.url).origin;

  try {
    const stripe = getStripe();

    let customerId =
      (profile?.stripe_customer_id as string | null | undefined) ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      const { error } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
      if (error) throw new Error(error.message);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      client_reference_id: user.id,
      metadata: { userId: user.id },
      subscription_data: { metadata: { userId: user.id } },
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start checkout. Try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed:", error);
    return NextResponse.json(
      { error: "Checkout failed. Try again shortly." },
      { status: 502 }
    );
  }
}
