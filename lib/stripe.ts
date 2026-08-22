import Stripe from "stripe";

let singleton: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!singleton) {
    singleton = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return singleton;
}

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRO_PRICE_ID
  );
}
