import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import type { AuthorInfo } from "@/lib/profiles";
import { authorInitials } from "@/lib/profiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const gradientPresets = [
  "from-indigo-500 via-violet-500 to-purple-700",
  "from-fuchsia-500 via-purple-600 to-violet-800",
  "from-sky-500 via-blue-600 to-indigo-700",
  "from-emerald-500 via-teal-500 to-cyan-700",
  "from-amber-500 via-orange-500 to-rose-600",
  "from-rose-500 via-pink-500 to-fuchsia-600",
];

function coverGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return gradientPresets[Math.abs(hash) % gradientPresets.length];
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({
  post,
  author,
}: {
  post: BlogPost;
  author?: AuthorInfo;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/blog/${post.slug}`}
        aria-label={post.title}
        className="block overflow-hidden transition-opacity duration-300 group-hover:opacity-90"
      >
        {post.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.imageUrl}
            alt=""
            className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className={`aspect-video w-full bg-gradient-to-br ${coverGradient(post.slug)} transition-transform duration-500 group-hover:scale-[1.03]`}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-snug font-semibold tracking-tight">
          <Link
            href={`/blog/${post.slug}`}
            className="underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
          >
            {post.title}
          </Link>
        </h3>

        <div className="mt-2.5 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          {author && (
            <>
              <Avatar size="sm" className="shrink-0">
                {author.avatarUrl && (
                  <AvatarImage src={author.avatarUrl} alt={author.fullName} />
                )}
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {authorInitials(author.fullName)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-medium text-foreground">
                {author.fullName}
              </span>
              <span aria-hidden>·</span>
            </>
          )}
          <time
            dateTime={post.publishedAt ?? post.createdAt}
            className="shrink-0"
          >
            {formatDate(post.publishedAt)}
          </time>
        </div>

        {post.summary && (
          <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {post.summary}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Read more
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
