import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { listPublishedPosts } from "@/lib/posts";
import { getAuthorProfiles, type AuthorInfo } from "@/lib/profiles";
import { BlogCard } from "@/components/blog-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types";

export const metadata = {
  title: "Blog | Serif",
  description:
    "Essays on AI-powered writing, content strategy, SEO, and the craft of publishing.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const supabase = await createClient();
  let posts: BlogPost[] = [];
  let authors = new Map<string, AuthorInfo>();
  try {
    posts = await listPublishedPosts(supabase);
    authors = await getAuthorProfiles(
      supabase,
      posts.map((post) => post.userId)
    );
  } catch {
    posts = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-10 sm:px-6 sm:pt-32 sm:pb-14">
      <div className="mx-auto max-w-2xl text-center">
        <Badge
          variant="secondary"
          className="animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out motion-reduce:animate-none"
        >
          The Serif Blog
        </Badge>
        <h1 className="animate-in fade-in slide-in-from-bottom-4 mt-4 font-display text-4xl font-semibold tracking-tight text-balance duration-700 ease-out [animation-delay:100ms] motion-reduce:animate-none sm:text-5xl">
          Ideas for writing smarter
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-4 mt-3 text-base leading-7 text-muted-foreground duration-700 ease-out [animation-delay:200ms] motion-reduce:animate-none">
          Essays on AI-powered writing, content strategy, SEO, and the craft of
          publishing.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mt-14 rounded-xl border border-dashed border-border px-4 py-16 text-center">
          <p className="text-sm font-medium">No published posts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Published posts will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="animate-in fade-in slide-in-from-bottom-3 h-full duration-500 ease-out [animation-delay:calc(var(--stagger)*60ms)] motion-reduce:animate-none"
              style={{ "--stagger": index } as CSSProperties}
            >
              <BlogCard post={post} author={authors.get(post.userId)} />
            </div>
          ))}
        </div>
      )}

      <section className="animate-in fade-in slide-in-from-bottom-4 mt-16 rounded-2xl border border-border bg-muted/30 px-4 py-12 text-center duration-700 ease-out motion-reduce:animate-none sm:px-8">
        <Badge variant="secondary">Newsletter</Badge>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Get new writing in your inbox
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          One email when we publish something worth reading. No spam,
          unsubscribe anytime.
        </p>
        <div className="mt-7">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
