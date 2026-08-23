import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { Check } from "lucide-react";
import { listPublishedPosts } from "@/lib/posts";
import { getAuthorProfiles } from "@/lib/profiles";
import type { Db } from "@/lib/posts";
import { Reveal } from "@/components/reveal";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import {
  BookArchive,
  type ArchivePost,
} from "@/components/marketing/book-archive";

const GRADIENTS = [
  "linear-gradient(135deg,#c9a24b,#7a5a2f)",
  "linear-gradient(135deg,#3a3a3a,#0a0a0a)",
  "linear-gradient(135deg,#6b5a8a,#33264f)",
  "linear-gradient(135deg,#8a6b2f,#4a3a1a)",
  "linear-gradient(135deg,#2f6b5e,#173a32)",
  "linear-gradient(135deg,#8a4a5c,#4f2633)",
];

const MAX_ARCHIVE_POSTS = 6;

const FALLBACK_POSTS: ArchivePost[] = [
  {
    slug: null,
    title: "Notes on slow mornings",
    author: "Aanya K.",
    dateLabel: "Aug 12",
    readLabel: "4 min",
    gradient: GRADIENTS[0],
  },
  {
    slug: null,
    title: "Why first drafts don't need to be good",
    author: "Rohan M.",
    dateLabel: "Aug 9",
    readLabel: "6 min",
    gradient: GRADIENTS[1],
  },
  {
    slug: null,
    title: "The case for writing in public",
    author: "Elena V.",
    dateLabel: "Aug 3",
    readLabel: "5 min",
    gradient: GRADIENTS[2],
  },
  {
    slug: null,
    title: "Tone is a setting, not a talent",
    author: "Marcus T.",
    dateLabel: "Jul 28",
    readLabel: "3 min",
    gradient: GRADIENTS[3],
  },
  {
    slug: null,
    title: "What AI drafts get wrong (and right)",
    author: "Priya S.",
    dateLabel: "Jul 21",
    readLabel: "7 min",
    gradient: GRADIENTS[4],
  },
  {
    slug: null,
    title: "Publishing is a habit, not an event",
    author: "Sam O.",
    dateLabel: "Jul 15",
    readLabel: "4 min",
    gradient: GRADIENTS[5],
  },
];

const features = [
  {
    title: "AI Blog Generation",
    copy: "Give it a topic and a tone. Get a full draft back, ready to edit.",
  },
  {
    title: "Content Optimization",
    copy: "Tighten pacing and structure without losing your voice.",
  },
  {
    title: "Easy Publishing",
    copy: "One click from draft to a live, readable post.",
  },
  {
    title: "Content Management",
    copy: "Every draft and published post, sorted and searchable.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Everything you need to write and publish on your own.",
    features: [
      "Unlimited manual posts",
      "Rich-text editor & draft workflow",
      "Publish to your public blog",
      "Post management dashboard",
    ],
    cta: "Start for free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$20",
    period: "/month",
    description: "Unlocks all app features, including creating blogs with AI.",
    features: [
      "Everything in Free",
      "AI blog generation — topic to editable draft in seconds",
      "All app features unlocked",
    ],
    cta: "Upgrade to Pro",
    href: "/pricing",
    highlight: true,
  },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
}

/**
 * Public, cookie-less fetch so the result can live in Next's data cache
 * (cookies are not allowed inside unstable_cache scopes). Published posts
 * are world-readable, so the anon key is sufficient.
 */
const getArchivePosts = unstable_cache(
  async (): Promise<ArchivePost[]> => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      ) as unknown as Db;
      const posts = await listPublishedPosts(supabase);
      if (posts.length === 0) return [];
      const authors = await getAuthorProfiles(
        supabase,
        posts.map((p) => p.userId)
      );
      return posts.slice(0, MAX_ARCHIVE_POSTS).map((post, i) => ({
        slug: post.slug || null,
        title: post.title,
        author:
          authors.get(post.userId)?.fullName?.trim() || "Serif Writer",
        dateLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
        readLabel: `${post.readTime || 4} min`,
        gradient: GRADIENTS[i % GRADIENTS.length],
      }));
    } catch {
      return [];
    }
  },
  ["landing-archive-posts"],
  { revalidate: 300, tags: ["posts"] }
);

export const revalidate = 300;

export default function LandingPage() {
  return <LandingContent />;
}

async function LandingContent() {
  const fetched = await getArchivePosts();
  const archivePosts =
    fetched.length > 0
      ? fetched.slice(0, MAX_ARCHIVE_POSTS)
      : FALLBACK_POSTS;
  const phonePosts = archivePosts.slice(0, 3).map((post) => ({
    title: post.title,
    meta: `${post.author} · ${post.readLabel} read`,
    gradient: post.gradient,
  }));

  return (
    <div className="flex flex-col">
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-30 opacity-[0.035]" />

      {/* ---- Ink half ---- */}
      <section className="relative bg-ink text-paper">
        <div className="mx-auto grid min-h-svh w-full max-w-6xl items-center gap-12 px-6 pt-36 pb-20 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.06] py-1.5 pr-3.5 pl-2.5 font-mono text-[11px] tracking-[0.14em] text-gold uppercase">
              <span className="animate-blink block size-1.5 rounded-full bg-gold" />
              AI-powered blogging platform
            </span>
            <h1 className="font-display mt-7 text-5xl leading-[0.98] font-bold tracking-tighter sm:text-7xl">
              Where writers
              <br />
              <span className="font-medium text-paper/45">get</span> read.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper/60">
              Serif drafts, refines, and publishes — so the words that make it
              out are the ones worth reading.
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link
                href="/signup"
                className="rounded-full bg-paper px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(251,250,247,0.15)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Start writing
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-paper/50"
              >
                Log in
              </Link>
            </div>
          </div>
          <PhoneMockup posts={phonePosts} />
        </div>
      </section>

      <BookArchive posts={archivePosts} />

      {/* ---- Paper half ---- */}
      <div className="relative bg-paper text-ink">
        {/* Features */}
        <section id="features" className="scroll-mt-24 px-6 pt-24 pb-28 sm:pt-32">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="font-mono text-[11px] tracking-[0.2em] text-gold-deep uppercase">
              What&apos;s inside
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tighter sm:text-5xl">
              Four tools, one page.
            </h2>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 90}>
                <div className="page-curl group relative h-full overflow-hidden rounded-2xl bg-ink p-7 pb-11 text-paper transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(10,10,10,0.35)] motion-reduce:transition-none">
                  <div className="mb-6 size-9 rounded-[10px] bg-gradient-to-br from-gold to-[#7a5a2f]" />
                  <h3 className="font-display text-base font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-paper/55">
                    {feature.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="px-6 pb-28">
          <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <p className="font-display text-2xl font-bold tracking-tight text-ink-soft sm:text-3xl">
                Read by some of{" "}
                <span className="text-ink">the best</span> in the industry
              </p>
            </Reveal>
            <Reveal delay={120}>
              <figure className="rounded-[22px] bg-paper-card p-8 shadow-[0_30px_70px_rgba(10,10,10,0.08)] sm:p-11">
                <blockquote className="font-display text-lg leading-snug font-semibold tracking-tight sm:text-2xl">
                  &ldquo;Serif is the first AI writing tool that actually sounds
                  like me by the second draft — not the fifth.&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="size-10 shrink-0 rounded-full bg-gradient-to-br from-gold to-[#7a5a2f]" />
                  <span>
                    <span className="font-display block text-sm font-bold">
                      Priya Sharma
                    </span>
                    <span className="block text-xs text-ink-soft">
                      Founder, Learn Writing Co.
                    </span>
                    <span className="mt-0.5 block text-xs tracking-[0.2em] text-gold-deep">
                      ★★★★★
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 px-6 pb-28">
          <Reveal className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tighter sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              Start free. Upgrade when your writing does.
            </p>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl bg-paper-card p-7 shadow-[0_18px_50px_rgba(10,10,10,0.08)] ${
                    plan.highlight ? "ring-2 ring-gold-deep/50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                    {plan.highlight && (
                      <span className="rounded-full bg-gold px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink uppercase">
                        Best value
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm text-ink-soft">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {plan.description}
                  </p>
                  <Link
                    href={plan.href}
                    className={`mt-6 w-full rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-ink text-paper hover:bg-ink/85"
                        : "border border-ink/20 hover:bg-ink/[0.04]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-ink-soft"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-6 pt-4 pb-20 text-center sm:pb-32">
          <Reveal>
            <h2 className="font-display text-5xl leading-[0.98] font-bold tracking-tighter sm:text-6xl lg:text-8xl">
              Start your
              <br />
              <span className="font-medium text-ink-soft">next</span> post.
            </h2>
            <Link
              href="/signup"
              className="font-display mt-8 inline-block rounded-full bg-ink px-8 py-4 text-base font-bold text-paper transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(10,10,10,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 sm:mt-11 sm:px-11 sm:py-5 sm:text-lg"
            >
              Start writing — it&apos;s free
            </Link>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
