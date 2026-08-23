import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

export interface ArchivePost {
  slug: string | null;
  title: string;
  summary: string;
  author: string;
  dateLabel: string;
  readLabel: string;
  imageUrl: string | null;
}

/* Warm editorial placeholders for posts without a cover image. */
const PLACEHOLDERS = [
  "linear-gradient(135deg,#2a251c,#0e0d0b)",
  "linear-gradient(135deg,#33291a,#131009)",
  "linear-gradient(135deg,#24211f,#0b0b0a)",
];

function PostMeta({ post, className }: { post: ArchivePost; className?: string }) {
  return (
    <p
      className={`font-mono text-[10px] tracking-[0.16em] text-paper/45 uppercase ${className ?? ""}`}
    >
      {post.author}
      <span aria-hidden> · </span>
      {post.dateLabel}
      <span aria-hidden> · </span>
      {post.readLabel}
    </p>
  );
}

function Cover({
  post,
  index,
  aspect,
}: {
  post: ArchivePost;
  index: number;
  aspect: string;
}) {
  if (post.imageUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={post.imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className={`${aspect} w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
      />
    );
  }
  return (
    <div
      aria-hidden
      style={{ background: PLACEHOLDERS[index % PLACEHOLDERS.length] }}
      className={`${aspect} w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]`}
    />
  );
}

/**
 * Premium editorial blog archive fed by the existing Supabase data layer.
 * Server-renderable; motion comes from the shared Reveal wrapper only.
 */
export function EditorialArchive({ posts }: { posts: ArchivePost[] }) {
  const [featured, ...rest] = posts;

  return (
    <section
      id="stories"
      aria-label="Stories worth reading"
      className="relative bg-ink px-6 pt-10 pb-28 text-paper sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">
              From the community
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
              Stories worth reading.
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-paper/70 transition-colors hover:text-gold"
          >
            View all stories
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        {posts.length === 0 ? (
          <div className="mt-14 rounded-xl border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="font-display text-lg font-semibold">
              No published stories yet
            </p>
            <p className="mt-2 text-sm text-paper/55">
              The first published posts will appear here — maybe yours.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <Reveal className="mt-12">
                <ArticleOrLink post={featured} featured>
                  <article className="group grid items-center gap-7 lg:grid-cols-2 lg:gap-12">
                    <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                      <Cover post={featured} index={0} aspect="aspect-[16/10]" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.22em] text-gold uppercase">
                        Featured story
                      </p>
                      <h3 className="font-display mt-3 text-2xl leading-tight font-bold tracking-tight text-balance transition-colors duration-300 group-hover:text-gold sm:text-4xl">
                        {featured.title}
                      </h3>
                      {featured.summary && (
                        <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-paper/60 sm:text-base">
                          {featured.summary}
                        </p>
                      )}
                      <PostMeta post={featured} className="mt-5" />
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-paper transition-colors group-hover:text-gold">
                        Read story
                        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </article>
                </ArticleOrLink>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal key={`${post.title}-${i}`} delay={(i % 3) * 90}>
                    <ArticleOrLink post={post}>
                      <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white/[0.03] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:ring-gold/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                        <div className="overflow-hidden">
                          <Cover post={post} index={i + 1} aspect="aspect-[16/9]" />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <h3 className="font-display text-lg leading-snug font-bold tracking-tight text-balance transition-colors duration-300 group-hover:text-gold">
                            {post.title}
                          </h3>
                          {post.summary && (
                            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-paper/55">
                              {post.summary}
                            </p>
                          )}
                          <PostMeta post={post} className="mt-auto pt-4" />
                        </div>
                      </article>
                    </ArticleOrLink>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ArticleOrLink({
  post,
  featured = false,
  children,
}: {
  post: ArchivePost;
  featured?: boolean;
  children: React.ReactNode;
}) {
  const className = featured ? "block" : "block h-full";
  if (post.slug) {
    return (
      <Link href={`/blog/${post.slug}`} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}
