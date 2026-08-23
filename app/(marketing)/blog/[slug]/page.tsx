import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPostBySlug } from "@/lib/posts";
import { getAuthorProfile, authorInitials } from "@/lib/profiles";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const articleClasses = [
  "text-[0.9375rem]",
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
  "[&_blockquote]:my-5 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:pr-3",
  "[&_code]:rounded-md [&_code]:border [&_code]:border-border/80 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:font-medium [&_code]:text-primary",
  "[&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight",
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight",
  "[&_hr]:my-8 [&_hr]:border-border",
  "[&_img]:my-5 [&_img]:rounded-xl",
  "[&_li]:leading-7",
  "[&_ol]:my-4 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:marker:font-medium [&_ol]:marker:text-primary",
  "[&_p]:my-4 [&_p]:leading-7 [&_p]:text-muted-foreground [&_p_strong]:text-foreground",
  "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre_code]:border-none [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-foreground",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_ul]:my-4 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:marker:text-primary/60",
].join(" ");

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getPost(slug: string) {
  const supabase = await createClient();
  try {
    return await getPostBySlug(supabase, slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Serif`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

const backOrigins: Record<string, string> = {
  "/dashboard": "Back to dashboard",
  "/dashboard/blogs": "Back to blogs",
};

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const supabase = await createClient();
  let author = { fullName: "Serif Writer", avatarUrl: null as string | null };
  try {
    author = await getAuthorProfile(supabase, post.userId);
  } catch {}

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === post.userId;

  if (post.status === "draft") {
    if (isOwner) redirect(`/dashboard/blogs/${post.id}/edit`);
    notFound();
  }

  const initials = authorInitials(author.fullName);

  const { from } = await searchParams;
  const backLabel = (from && backOrigins[from]) || "Back to blog";
  const backHref = from && backOrigins[from] ? from : "/blog";

  return (
    <article>
      <div className="mx-auto max-w-3xl px-4 pt-28 sm:px-6 sm:pt-32">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5 pl-2" })}
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-primary">
            Blog
          </Badge>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {post.readTime} min read
          </span>
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt ?? post.createdAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {post.title}
        </h1>
        {post.summary && (
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {post.summary}
          </p>
        )}

        <div className="mt-6 flex items-center gap-2.5 border-y border-border py-3">
          <Avatar className="size-9">
            {author.avatarUrl && (
              <AvatarImage src={author.avatarUrl} alt={author.fullName} />
            )}
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{author.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">Author</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {post.imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.imageUrl}
            alt=""
            className="mt-8 h-52 w-full rounded-xl object-cover sm:h-72"
          />
        )}
        {/* Post bodies are authored in the dashboard's rich-text editor by the owner. */}
        <div
          className={`mt-6 ${articleClasses}`}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>

      {isOwner && (
        <Link
          href={`/dashboard/blogs/${post.id}/edit`}
          className={buttonVariants({
            size: "lg",
            className:
              "animate-in fade-in slide-in-from-bottom-4 fixed right-5 z-50 gap-1.5 shadow-lg duration-500 ease-out motion-reduce:animate-none sm:right-8 [bottom:calc(env(safe-area-inset-bottom)+1.25rem)] sm:[bottom:calc(env(safe-area-inset-bottom)+2rem)]",
          })}
        >
          <Pencil className="size-4" />
          Edit post
        </Link>
      )}
    </article>
  );
}
