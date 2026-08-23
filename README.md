# Serif

Serif is a writing platform for creating, editing, publishing, and sharing blog posts. It includes Supabase authentication and storage, a rich-text editor, optional Groq-powered post generation, Stripe Pro subscriptions, and newsletter signup through Loops.

## Requirements

- Node.js 20 or newer
- pnpm
- A Supabase project
- Stripe test-mode credentials for local billing flows
- Groq and Loops credentials for those integrations

## Local setup

Install dependencies and create a local environment file:

```powershell
pnpm install
Copy-Item .env.example .env.local
```

Fill in `.env.local` using the variable names in `.env.example`. Keep this file local; it is ignored by git. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are browser-safe values. All other provider credentials must remain server-only.

Apply the SQL migrations in `supabase/migrations` to the intended Supabase project. Confirm the authentication redirect URL includes `http://localhost:3000/auth/callback`.

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Product routes

- `/` — marketing homepage
- `/blog` and `/blog/[slug]` — public posts
- `/pricing` — Pro subscription checkout
- `/login`, `/signup`, `/reset-password` — authentication
- `/dashboard` — account overview
- `/dashboard/blogs` — manage posts
- `/dashboard/blogs/new/manual` — write a post manually
- `/dashboard/blogs/new/ai` — generate a post with Groq (Pro only)
- `/dashboard/settings` — account settings

## Stripe local webhooks

Install and authenticate the Stripe CLI, then forward events while the app is running:

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Copy the signing secret printed by the CLI into `STRIPE_WEBHOOK_SECRET`. Use Stripe test mode locally and verify checkout, subscription, cancellation, and duplicate webhook delivery paths before deploying.

## Checks

```bash
pnpm lint
pnpm build
pnpm start
```

The project currently has no automated test suite. Integration checks should use a disposable or staging Supabase project and Stripe test-mode credentials. Never use production secrets for local testing.

## Deployment checklist

1. Rotate any credential that has been shared, committed, logged, or exposed.
2. Configure all variables from `.env.example` in the deployment provider.
3. Use the production Supabase URL, redirect URLs, and RLS policies.
4. Use the correct Stripe mode and price ID for the deployment environment.
5. Register the production Stripe webhook endpoint and store its signing secret.
6. Confirm provider quotas, error monitoring, backups, and rollback procedures.
7. Run auth, post CRUD, public blog, AI entitlement, checkout, webhook, and newsletter smoke checks.

## Security notes

Do not commit `.env.local`, service-role keys, Stripe secret keys, webhook signing secrets, Groq keys, or Loops keys. If a credential is exposed, revoke it in the provider dashboard before continuing development and replace it in every environment that used it.
