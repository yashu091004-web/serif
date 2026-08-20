"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useDashboard, deletePost } from "@/lib/dashboard-store";
import type { BlogPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

function statusBadge(status: BlogPost["status"]) {
  return status === "published" ? (
    <Badge variant="secondary">Published</Badge>
  ) : (
    <Badge variant="outline">Draft</Badge>
  );
}

export function RecentPosts() {
  const { posts } = useDashboard();
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);

  const recent = posts.slice(0, 5);

  function confirmDelete() {
    if (!pendingDelete) return;
    deletePost(pendingDelete.id);
    toast.success(`"${pendingDelete.title}" deleted`);
    setPendingDelete(null);
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
        <div className="hidden grid-cols-[1fr_7rem_7rem_5rem_6.5rem] items-center gap-3 border-b border-border/80 bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
          <span>Post</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">Views</span>
          <span className="text-right">Actions</span>
        </div>
        <ul className="divide-y divide-border/60">
          {recent.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              No posts yet.{" "}
              <Link
                href="/dashboard/blogs/new"
                className="font-medium text-primary hover:text-primary/80"
              >
                Create your first post
              </Link>
              .
            </li>
          ) : (
            recent.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 px-4 py-3 sm:grid sm:grid-cols-[1fr_7rem_7rem_5rem_6.5rem] sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="hidden size-8 shrink-0 rounded-lg sm:flex">
                    <AvatarFallback className="rounded-lg bg-primary/10 font-display text-xs font-semibold text-primary">
                      {post.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {post.category} · {post.subtitle || "No subtitle"}
                    </p>
                  </div>
                </div>
                <div>{statusBadge(post.status)}</div>
                <time className="text-sm text-muted-foreground" dateTime={post.updatedAt}>
                  {post.updatedAt}
                </time>
                <p className="flex items-center gap-1 text-sm text-muted-foreground sm:justify-end">
                  <Eye className="size-3.5" />
                  {post.views > 0 ? post.views.toLocaleString() : "—"}
                </p>
                <div className="flex items-center gap-1 sm:justify-end">
                  {post.status === "published" && (
                    <Button
                      render={<Link href={`/blog/${post.slug}`} />}
                      variant="ghost"
                      size="icon-sm"
                      aria-label="View post"
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  )}
                  <Button
                    render={<Link href={`/dashboard/blogs/${post.id}/edit`} />}
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit post"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete post"
                    onClick={() => setPendingDelete(post)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
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
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}