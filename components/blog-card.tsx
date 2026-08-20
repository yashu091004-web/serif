import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { BlogCover } from "@/components/blog-cover";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group h-full overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-md">
        <BlogCover post={post} className="h-44" />
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-primary">
              {post.category}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.readTime} min read
            </span>
          </div>
          <h3 className="font-display text-lg leading-snug font-semibold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {post.subtitle}
          </p>
          <div className="mt-auto flex items-center gap-2 pt-3">
            <Avatar className="size-6">
              <AvatarFallback className="bg-primary/10 text-[0.625rem] font-semibold text-primary">
                {post.author.initials}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-xs font-medium text-foreground">
              {post.author.name}
            </span>
            <span aria-hidden className="text-muted-foreground">
              ·
            </span>
            <time className="text-xs text-muted-foreground" dateTime={post.publishedAt}>
              {post.publishedAt}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}