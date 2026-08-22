import type { Db } from "@/lib/posts";

export interface AuthorInfo {
  fullName: string;
  avatarUrl: string | null;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const AUTHOR_COLUMNS = "id, full_name, avatar_url";
const FALLBACK_AUTHOR = "Serif Writer";

function assertNoError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function mapAuthor(row: ProfileRow): AuthorInfo {
  return {
    fullName: row.full_name?.trim() || FALLBACK_AUTHOR,
    avatarUrl: row.avatar_url || null,
  };
}

export function authorInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "S";
}

export async function getAuthorProfile(
  db: Db,
  userId: string
): Promise<AuthorInfo> {
  const { data, error } = await db
    .from("profiles")
    .select(AUTHOR_COLUMNS)
    .eq("id", userId)
    .maybeSingle();
  assertNoError(error);
  return data ? mapAuthor(data as ProfileRow) : { fullName: FALLBACK_AUTHOR, avatarUrl: null };
}

export async function getAuthorProfiles(
  db: Db,
  userIds: string[]
): Promise<Map<string, AuthorInfo>> {
  const unique = [...new Set(userIds)];
  const map = new Map<string, AuthorInfo>();
  if (unique.length === 0) return map;
  const { data, error } = await db
    .from("profiles")
    .select(AUTHOR_COLUMNS)
    .in("id", unique);
  assertNoError(error);
  for (const row of (data ?? []) as ProfileRow[]) {
    map.set(row.id, mapAuthor(row));
  }
  return map;
}

export interface ProfileUpdate {
  fullName?: string;
  avatarUrl?: string;
}

export async function updateProfile(
  db: Db,
  userId: string,
  input: ProfileUpdate
): Promise<void> {
  const updates: Record<string, string> = {};
  if (input.fullName !== undefined) updates.full_name = input.fullName.trim();
  if (input.avatarUrl !== undefined) updates.avatar_url = input.avatarUrl;
  if (Object.keys(updates).length === 0) return;
  const { error } = await db.from("profiles").update(updates).eq("id", userId);
  assertNoError(error);
}

export async function uploadAvatar(
  db: Db,
  userId: string,
  file: File
): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now()}.${extension}`;
  const { error } = await db.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type });
  assertNoError(error);
  const { data } = db.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
