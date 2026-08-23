"use client";

import Link from "next/link";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deletePost } from "@/lib/posts";
import type { BlogPost } from "@/lib/types";
import { usePosts } from "@/lib/use-posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "—";
}

export function RecentPosts() {
  const { posts, loading, refresh } = usePosts();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);

  const recent = posts.slice(0, 5);

  async function confirmDelete() {
    if (!pendingDelete || deletingId) return;
    setDeletingId(pendingDelete.id);
    try {
      await deletePost(createClient(), pendingDelete.id);
      toast.success(`"${pendingDelete.title}" deleted`);
      setPendingDelete(null);
      await refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Your blog posts
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your latest drafts and published posts.
          </p>
        </div>
        <Button render={<Link href="/dashboard/blogs" />} variant="outline" size="sm">
          View all
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <div className="hidden grid-cols-[1fr_7rem_7rem_6.5rem] items-center gap-3 border-b border-border/80 bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
          <span>Post</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Loading posts…
          </div>
        ) : recent.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No posts yet.{" "}
            <Link
              href="/dashboard/blogs/new"
              className="font-medium text-primary hover:text-primary/80"
            >
              Create your first post
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 px-4 py-3 transition-colors hover:bg-muted/50 sm:grid sm:grid-cols-[1fr_7rem_7rem_6.5rem] sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {post.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="hidden size-8 shrink-0 rounded-lg object-cover sm:flex"
                    />
                  ) : (
                    <span className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-xs font-semibold text-primary sm:flex">
                      {post.title.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <Link
                      href={
                        post.status === "published"
                          ? `/blog/${post.slug}?from=/dashboard`
                          : `/dashboard/blogs/${post.id}/edit`
                      }
                      className="block truncate text-sm font-medium transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {post.readTime} min read · {formatDate(post.publishedAt ?? post.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  {post.status === "published" ? (
                    <Badge variant="secondary">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
                <time className="text-sm text-muted-foreground" dateTime={post.updatedAt}>
                  {formatDate(post.updatedAt)}
                </time>
                <div className="flex items-center gap-1 sm:justify-end">
                  {post.status === "published" && (
                    <Button
                      render={<Link href={`/blog/${post.slug}?from=/dashboard`} />}
                      variant="ghost"
                      size="icon-sm"
                      aria-label="View post"
                      className="size-9 sm:size-7"
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  )}
                  <Button
                    render={<Link href={`/dashboard/blogs/${post.id}/edit`} />}
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit post"
                    className="size-9 sm:size-7"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete post"
                    disabled={deletingId !== null}
                    onClick={() => setPendingDelete(post)}
                    className="size-9 sm:size-7"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>
            <DialogDescription>
              This will permanently remove “{pendingDelete?.title}”. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDelete(null)}
              disabled={deletingId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingId !== null}
            >
              {deletingId ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
