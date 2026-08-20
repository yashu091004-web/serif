import { publishedPosts, blogCategories } from "@/lib/blog-data";
import { BlogCard } from "@/components/blog-card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Blog | Serif",
  description:
    "Essays on AI-powered writing, content strategy, SEO, and the craft of publishing.",
};

export default function BlogPage() {
  const sorted = [...publishedPosts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="max-w-2xl">
        <Badge variant="outline" className="text-primary">
          The Serif Blog
        </Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Ideas for writing smarter
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Essays on AI-powered writing, content strategy, SEO, and the craft of
          publishing — from the people building Serif.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {blogCategories.map((category) => (
          <Badge key={category} variant="outline" className="bg-muted/40">
            {category}
          </Badge>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}