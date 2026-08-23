import Stripe from "stripe";

let singleton: Stripe | null = null;
let diagnosticsLogged = false;

function logKeyDiagnostics(diagnostics: Record<string, unknown>) {
  if (diagnosticsLogged) return;
  diagnosticsLogged = true;
  console.info("[stripe] secret key diagnostics:", diagnostics);
}

function sanitizeSecretKey(rawKey: string | undefined): string {
  if (!rawKey || rawKey.trim().length === 0) {
    logKeyDiagnostics({ exists: false });
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const hadControlChars = /[\r\n\t\f\v]/.test(rawKey);
  // Env values pasted into hosting dashboards can pick up CR/LF or tabs;
  // these corrupt the Authorization header at request time.
  const key = rawKey.replace(/[\r\n\t\f\v]/g, "").trim();

  if (!/^sk_(test|live)_/.test(key)) {
    logKeyDiagnostics({
      exists: true,
      length: rawKey.length,
      hadControlChars,
      hasSkPrefix: /^sk_(test|live)_/.test(rawKey.trim()),
    });
    throw new Error("Invalid STRIPE_SECRET_KEY format.");
  }

  logKeyDiagnostics({
    exists: true,
    length: rawKey.length,
    hadControlChars,
    prefix: key.slice(0, 7),
  });
  return key;
}

export function getStripe(): Stripe {
  if (!singleton) {
    singleton = new Stripe(sanitizeSecretKey(process.env.STRIPE_SECRET_KEY));
  }
  return singleton;
}

export function isStripeConfigured(): boolean {
  const rawKey = process.env.STRIPE_SECRET_KEY;
  const looksValid =
    typeof rawKey === "string" &&
    rawKey.trim().length > 0 &&
    /^sk_(test|live)_/.test(rawKey.replace(/[\r\n\t\f\v]/g, "").trim());
  return Boolean(process.env.STRIPE_PRO_PRICE_ID && looksValid);
}
