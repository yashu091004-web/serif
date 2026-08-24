import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { listPublishedPosts } from "@/lib/posts";
import { getAuthorProfiles } from "@/lib/profiles";
import type { Db } from "@/lib/posts";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getSubscriptionStatus } from "@/lib/subscription";
import { CinematicStory } from "@/components/marketing/CinematicStory";
import {
  EditorialArchive,
  type ArchivePost,
} from "@/components/marketing/EditorialArchive";
import { FeatureEditorial } from "@/components/marketing/FeatureEditorial";
import { ProductStory } from "@/components/marketing/ProductStory";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FinalCta } from "@/components/marketing/FinalCta";

const MAX_ARCHIVE_POSTS = 7;

/**
 * Shown only when the database has no published posts yet, so the landing
 * never renders an empty archive. These are display strings, not fake data.
 */
const FALLBACK_POSTS: ArchivePost[] = [
  {
    slug: null,
    title: "Notes on slow mornings",
    summary:
      "What happens to your writing when you stop rushing the first hour of the day.",
    author: "Aanya K.",
    dateLabel: "Aug 12",
    readLabel: "4 min",
    imageUrl: null,
  },
  {
    slug: null,
    title: "Why first drafts don't need to be good",
    summary:
      "The draft's only job is to exist. Everything else is revision.",
    author: "Rohan M.",
    dateLabel: "Aug 9",
    readLabel: "6 min",
    imageUrl: null,
  },
  {
    slug: null,
    title: "The case for writing in public",
    summary:
      "Publishing before you feel ready is uncomfortable — and it works.",
    author: "Elena V.",
    dateLabel: "Aug 3",
    readLabel: "5 min",
    imageUrl: null,
  },
  {
    slug: null,
    title: "Tone is a setting, not a talent",
    summary:
      "How to choose a voice on purpose instead of hoping one shows up.",
    author: "Marcus T.",
    dateLabel: "Jul 28",
    readLabel: "3 min",
    imageUrl: null,
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
      return posts.slice(0, MAX_ARCHIVE_POSTS).map((post) => ({
        slug: post.slug || null,
        title: post.title,
        summary: post.summary?.trim() || "",
        author:
          authors.get(post.userId)?.fullName?.trim() || "Serif Writer",
        dateLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
        readLabel: `${post.readTime || 4} min`,
        imageUrl: post.imageUrl,
      }));
    } catch {
      return [];
    }
  },
  ["landing-archive-posts"],
  { revalidate: 300, tags: ["posts"] }
);

export const revalidate = 300;

export const metadata = {
  title: "Serif — Where writers get read",
  description:
    "Serif drafts, refines, and publishes — a scroll-driven story from first idea to published post. Start free.",
};

export default async function LandingPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const isPro = user
    ? (await getSubscriptionStatus(supabase, user.id)) === "active"
    : false;

  const fetched = await getArchivePosts();
  const archivePosts =
    fetched.length > 0 ? fetched.slice(0, MAX_ARCHIVE_POSTS) : FALLBACK_POSTS;

  return (
    <div className="landing flex flex-col">
      <CinematicStory />

      <EditorialArchive posts={archivePosts} />

      <FeatureEditorial />

      <ProductStory />

      <PricingSection isLoggedIn={isLoggedIn} isPro={isPro} />

      <FinalCta />
    </div>
  );
}
