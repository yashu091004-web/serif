"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Search, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { deletePost } from "@/lib/posts";
import type { BlogPost } from "@/lib/types";
import { usePosts } from "@/lib/use-posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Tab = "all" | "drafts" | "published";

function statusBadge(status: BlogPost["status"]) {
  return status === "published" ? (
    <Badge variant="secondary">Published</Badge>
  ) : (
    <Badge variant="outline">Draft</Badge>
  );
}

function formatDate(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "—";
}

function sortPosts(posts: BlogPost[], sort: string): BlogPost[] {
  const sorted = [...posts];
  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export default function BlogsPage() {
  const { posts, loading, refresh } = usePosts();
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (tab === "drafts" && post.status !== "draft") return false;
      if (tab === "published" && post.status !== "published") return false;
      if (q && !post.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, tab, query]);

  const visible = sortPosts(filtered, sort);

  const counts = {
    all: posts.length,
    drafts: posts.filter((p) => p.status === "draft").length,
    published: posts.filter((p) => p.status === "published").length,
  };

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
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Blogs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage, edit, and publish your posts.
          </p>
        </div>
        <Button render={<Link href="/dashboard/blogs/new" />} className="gap-1.5">
          <Plus className="size-4" />
          New Post
        </Button>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
          className="w-fit"
        >
          <TabsList variant="line" className="h-8">
            <TabsTrigger value="all">All Posts ({counts.all})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({counts.drafts})</TabsTrigger>
            <TabsTrigger value="published">
              Published ({counts.published})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts…"
              className="pl-8"
              aria-label="Search posts"
            />
          </div>
          <Select value={sort} onValueChange={(value) => setSort(value ?? "newest")}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <div className="hidden grid-cols-[minmax(0,1fr)_6.5rem_7rem_7rem_8rem] items-center gap-3 border-b border-border/80 bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground lg:grid">
          <span>Post</span>
          <span>Status</span>
          <span>Created</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="px-4 py-14 text-center text-sm text-muted-foreground">
            Loading posts…
          </div>
        ) : visible.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="text-sm font-medium">No posts found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters, or create a new post.
            </p>
            <Button
              render={<Link href="/dashboard/blogs/new" />}
              className="mt-4 gap-1.5"
              size="sm"
            >
              <Plus className="size-4" />
              New Post
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {visible.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 px-4 py-3 transition-colors hover:bg-muted/50 lg:grid lg:grid-cols-[minmax(0,1fr)_6.5rem_7rem_7rem_8rem] lg:items-center lg:gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {post.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="hidden size-9 shrink-0 rounded-lg object-cover sm:block"
                    />
                  ) : (
                    <div className="hidden size-9 shrink-0 rounded-lg bg-gradient-to-br from-primary/30 via-fuchsia-500/20 to-sky-500/20 sm:block" />
                  )}
                  <div className="min-w-0">
                    <Link
                      href={
                        post.status === "published"
                          ? `/blog/${post.slug}?from=/dashboard/blogs`
                          : `/dashboard/blogs/${post.id}/edit`
                      }
                      className="block truncate text-sm font-medium transition-colors hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {post.readTime} min read · /{post.slug}
                    </p>
                  </div>
                </div>
                <div>{statusBadge(post.status)}</div>
                <time className="text-sm text-muted-foreground" dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
                <time className="text-sm text-muted-foreground" dateTime={post.updatedAt}>
                  {formatDate(post.updatedAt)}
                </time>
                <div className="flex items-center gap-1 lg:justify-end">
                  {post.status === "published" && (
                    <Button
                      render={<Link href={`/blog/${post.slug}?from=/dashboard/blogs`} />}
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
    </div>
  );
}
