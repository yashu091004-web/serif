import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

function isImage(cover: string) {
  return /^(https?:)?\/\//.test(cover) || cover.startsWith("/");
}

export function BlogCover({
  post,
  className,
}: {
  post: BlogPost;
  className?: string;
}) {
  if (isImage(post.cover)) {
    return (
      <div
        role="img"
        aria-label={post.title}
        className={cn("bg-cover bg-center", className)}
        style={{ backgroundImage: `url(${post.cover})` }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        post.cover,
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
    </div>
  );
}