"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2, Save, Send, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { createPost, updatePost, uploadPostImage } from "@/lib/posts";
import type { BlogPost, PostStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/dashboard/rich-text-editor";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function countWords(html: string): number {
  return html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

interface BlogEditorProps {
  post?: BlogPost;
  initial?: {
    title?: string;
    summary?: string;
    body?: string;
  };
  heading?: string;
}

export function BlogEditor({ post, initial, heading }: BlogEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(post?.title ?? initial?.title ?? "");
  const [summary, setSummary] = useState(post?.summary ?? initial?.summary ?? "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? "");
  const [body, setBody] = useState(post?.body ?? initial?.body ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState<PostStatus | null>(null);

  async function handleImageChange(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be signed in to upload images.");
      const url = await uploadPostImage(supabase, user.id, file);
      setImageUrl(url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function save(status: PostStatus) {
    if (!title.trim()) {
      toast.error("Please add a title before saving.");
      return;
    }
    setSaving(status);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be signed in.");
      const input = {
        title,
        summary,
        body,
        imageUrl: imageUrl || null,
      };
      if (post) {
        await updatePost(supabase, post.id, user.id, input, status);
      } else {
        await createPost(supabase, user.id, input, status);
      }
      toast.success(
        status === "published" ? "Post published" : "Draft saved",
        { description: `"${title.trim()}" was saved.` }
      );
      router.push("/dashboard/blogs");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(null);
    }
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
          {heading ?? (post ? "Edit post" : "New post")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select text in the editor for formatting options.
        </p>
      </div>

      <section className="space-y-5 rounded-xl ring-1 ring-foreground/10 p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A headline that earns the click"
            className="h-10 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A short, specific promise about what the reader will learn."
            className="min-h-20"
          />
        </div>

        <div className="space-y-2">
          <Label>Featured image</Label>
          {imageUrl ? (
            <div className="relative overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Featured image preview"
                className="h-44 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                aria-label="Remove image"
                className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md bg-background/90 text-muted-foreground shadow transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <ImagePlus className="size-4" />
                  Click to upload an image (max 5 MB)
                </>
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files?.[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Content</Label>
            <span className="text-xs text-muted-foreground">
              {countWords(body)} words · ~{Math.max(1, Math.ceil(countWords(body) / 200))} min read
            </span>
          </div>
          <RichTextEditor initialContent={body} onChange={setBody} />
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
          disabled={saving !== null || uploading}
          className="gap-1.5"
        >
          <Save className="size-4" />
          Save Draft
        </Button>
        <Button
          type="button"
          onClick={() => save("published")}
          disabled={saving !== null || uploading}
          className="gap-1.5"
        >
          <Send className="size-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}
