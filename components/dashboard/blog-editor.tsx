"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Sparkles, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createPost, updatePost, getPostById } from "@/lib/dashboard-store";
import { dashboardCategories } from "@/lib/dashboard-data";
import type { PostStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const coverPresets = [
  "from-indigo-500 via-violet-500 to-purple-700",
  "from-fuchsia-500 via-purple-600 to-violet-800",
  "from-sky-500 via-blue-600 to-indigo-700",
  "from-emerald-500 via-teal-500 to-cyan-700",
  "from-amber-500 via-orange-500 to-rose-600",
  "from-rose-500 via-pink-500 to-fuchsia-600",
];

const emptyForm = {
  title: "",
  subtitle: "",
  category: dashboardCategories[0],
  cover: coverPresets[0],
  content: "",
  seoTitle: "",
  seoDescription: "",
};

export function BlogEditor({
  postId,
}: {
  postId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(postId);
  const existing = postId ? getPostById(postId) : undefined;

  const [form, setForm] = useState(
    existing
      ? {
          title: existing.title,
          subtitle: existing.subtitle,
          category: existing.category,
          cover: existing.cover,
          content: existing.content,
          seoTitle: existing.seoTitle,
          seoDescription: existing.seoDescription,
        }
      : emptyForm
  );
  const [saving, setSaving] = useState<PostStatus | null>(null);

  if (isEdit && !existing) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium">Post not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been deleted.
        </p>
        <Button
          render={<Link href="/dashboard/blogs" />}
          variant="outline"
          className="mt-4 gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back to blogs
        </Button>
      </div>
    );
  }

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function save(status: PostStatus) {
    if (!form.title.trim()) {
      toast.error("Please add a title before saving.");
      return;
    }
    setSaving(status);
    const input = { ...form, status };
    if (isEdit && postId) {
      updatePost(postId, input);
    } else {
      createPost(input);
    }
    toast.success(
      status === "published" ? "Post published" : "Draft saved",
      { description: `"${form.title}" was saved.` }
    );
    router.push("/dashboard/blogs");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to blogs
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {isEdit ? "Edit post" : "New post"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEdit
            ? "Update the content and metadata for this post."
            : "Create a new post with the help of your AI writing tools."}
        </p>
      </div>

      <section className="space-y-5 rounded-xl ring-1 ring-foreground/10 p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="A headline that earns the click"
            className="h-10 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={form.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            placeholder="A short, specific promise about what the reader will learn."
            className="h-10 text-base"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={form.category} onValueChange={(value) => update("category", value ?? form.category)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dashboardCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">Featured image</Label>
            <Input
              id="cover"
              value={form.cover}
              onChange={(e) => update("cover", e.target.value)}
              placeholder="Image URL or gradient"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cover preview</Label>
          <div className="flex flex-wrap items-center gap-2">
            {coverPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => update("cover", preset)}
                aria-label={`Use gradient ${preset}`}
                className={`h-8 w-14 rounded-lg bg-gradient-to-br transition-transform hover:scale-105 ${
                  form.cover === preset
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "opacity-70"
                } ${preset}`}
              />
            ))}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ImageIcon className="size-3.5" />
              Or paste an image URL above.
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Content</Label>
            <span className="text-xs text-muted-foreground">
              {form.content.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder="Write in Markdown… Use headings, lists, and code blocks to structure your post."
            className="min-h-[18rem] text-base leading-7"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl ring-1 ring-foreground/10 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="font-display text-base font-semibold tracking-tight">
            SEO &amp; search preview
          </h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo-title">SEO title</Label>
          <Input
            id="seo-title"
            value={form.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            placeholder="An optimized title for search engines (60 characters or less)."
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">
            {form.seoTitle.length}/60 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo-description">SEO description</Label>
          <Textarea
            id="seo-description"
            value={form.seoDescription}
            onChange={(e) => update("seoDescription", e.target.value)}
            placeholder="A concise summary for search results and social sharing."
            className="min-h-20"
          />
          <p className="text-xs text-muted-foreground">
            {form.seoDescription.length}/160 characters
          </p>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/blogs")}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => save("draft")}
          disabled={saving !== null}
          className="gap-1.5"
        >
          <Save className="size-4" />
          Save Draft
        </Button>
        <Button
          type="button"
          onClick={() => save("published")}
          disabled={saving !== null}
          className="gap-1.5"
        >
          <Send className="size-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}