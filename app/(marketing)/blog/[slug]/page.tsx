import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getPublishedPost, getRelatedPublishedPosts } from "@/lib/blog-data";
import { Markdown } from "@/components/markdown";
import { BlogCover } from "@/components/blog-cover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { BlogCard } from "@/components/blog-card";

export function generateStaticParams() {
  return [
    { slug: "the-intelligent-future-of-blogging" },
    { slug: "ten-habits-of-prolific-writers" },
    { slug: "seo-in-the-age-of-ai-search" },
    { slug: "writing-headlines-that-earn-the-click" },
    { slug: "the-draft-to-publish-workflow" },
    { slug: "finding-your-writing-voice-with-ai" },
    { slug: "building-a-content-engine" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) notFound();

  const related = getRelatedPublishedPosts(slug);

  return (
    <article>
      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        <Link
          href="/blog"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5 pl-2" })}
        >
          <ArrowLeft className="size-4" />
          Back to blog
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-primary">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readTime} min read
          </span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {post.subtitle}
        </p>

        <div className="mt-6 flex items-center gap-2.5 border-y border-border py-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {post.author.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{post.author.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {post.author.role}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <BlogCover post={post} className="mt-8 h-52 rounded-xl sm:h-72" />
        <div className="mt-6">
          <Markdown content={post.content} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Continue reading
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {related.map((relatedPost) => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}