import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogPost, PostStatus } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Db = SupabaseClient<any, "public", any>;

interface PostRow {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  body: string;
  image_url: string | null;
  status: PostStatus;
  slug: string;
  read_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapPost(row: PostRow): BlogPost {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    summary: row.summary ?? "",
    body: row.body ?? "",
    imageUrl: row.image_url || null,
    status: row.status,
    slug: row.slug,
    readTime: row.read_time,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function assertNoError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export interface PostInput {
  title: string;
  summary: string;
  body: string;
  imageUrl: string | null;
}

const SELECT_COLUMNS = "*";

export async function listOwnPosts(db: Db, userId: string): Promise<BlogPost[]> {
  const { data, error } = await db
    .from("posts")
    .select(SELECT_COLUMNS)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  assertNoError(error);
  return ((data ?? []) as PostRow[]).map(mapPost);
}

/**
 * Everything the signed-in user is allowed to see: every published post
 * (any author) plus the caller's own drafts. Deliberately applies no
 * user_id filter — visibility is enforced by the posts RLS policy
 * (posts_select_published_or_own), while ownership stays a separate concern.
 */
export async function listVisiblePosts(db: Db): Promise<BlogPost[]> {
  const { data, error } = await db
    .from("posts")
    .select(SELECT_COLUMNS)
    .order("updated_at", { ascending: false });
  assertNoError(error);
  return ((data ?? []) as PostRow[]).map(mapPost);
}

export async function listPublishedPosts(db: Db): Promise<BlogPost[]> {
  const { data, error } = await db
    .from("posts")
    .select(SELECT_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  assertNoError(error);
  return ((data ?? []) as PostRow[]).map(mapPost);
}

export async function getPostById(db: Db, id: string): Promise<BlogPost | null> {
  const { data, error } = await db
    .from("posts")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  assertNoError(error);
  return data ? mapPost(data as PostRow) : null;
}

export async function getPublishedPostBySlug(
  db: Db,
  slug: string
): Promise<BlogPost | null> {
  const { data, error } = await db
    .from("posts")
    .select(SELECT_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  assertNoError(error);
  return data ? mapPost(data as PostRow) : null;
}

export async function getPostBySlug(
  db: Db,
  slug: string
): Promise<BlogPost | null> {
  const { data, error } = await db
    .from("posts")
    .select(SELECT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  assertNoError(error);
  return data ? mapPost(data as PostRow) : null;
}

export async function createPost(
  db: Db,
  userId: string,
  input: PostInput,
  status: PostStatus
): Promise<BlogPost> {
  const { data, error } = await db
    .from("posts")
    .insert({
      user_id: userId,
      title: input.title.trim(),
      summary: input.summary.trim(),
      body: input.body,
      image_url: input.imageUrl,
      status,
    })
    .select(SELECT_COLUMNS)
    .single();
  assertNoError(error);
  return mapPost(data as PostRow);
}

export async function updatePost(
  db: Db,
  id: string,
  userId: string,
  input: PostInput,
  status: PostStatus
): Promise<BlogPost> {
  const { data, error } = await db
    .from("posts")
    .update({
      title: input.title.trim(),
      summary: input.summary.trim(),
      body: input.body,
      image_url: input.imageUrl,
      status,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select(SELECT_COLUMNS)
    .single();
  assertNoError(error);
  return mapPost(data as PostRow);
}

export async function deletePost(
  db: Db,
  id: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await db
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");
  assertNoError(error);
  return (data?.length ?? 0) > 0;
}

export async function uploadPostImage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: SupabaseClient<any, "public", any>,
  userId: string,
  file: File
): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now()}.${extension}`;
  const { error } = await client.storage
    .from("blog-images")
    .upload(path, file, { contentType: file.type });
  assertNoError(error);
  const { data } = client.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}
