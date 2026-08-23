"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { listVisiblePosts } from "@/lib/posts";
import { getAuthorProfiles, type AuthorInfo } from "@/lib/profiles";
import type { BlogPost } from "@/lib/types";

const EMPTY_AUTHORS = new Map<string, AuthorInfo>();

/**
 * Loads every post the signed-in user is allowed to see — all published
 * posts from every author plus the user's own drafts (enforced by RLS) —
 * together with the current user id and author names so consumers can
 * separate ownership (edit/delete) from visibility (view/browse).
 */
export function usePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Map<string, AuthorInfo>>(EMPTY_AUTHORS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setPosts([]);
        setUserId(null);
        setAuthors(EMPTY_AUTHORS);
        return;
      }
      const rows = await listVisiblePosts(supabase);
      let authorsMap = EMPTY_AUTHORS;
      if (rows.length > 0) {
        try {
          authorsMap = await getAuthorProfiles(
            supabase,
            rows.map((row) => row.userId)
          );
        } catch {
          // Author names fall back to "Serif Writer" in the UI.
        }
      }
      setPosts(rows);
      setUserId(user.id);
      setAuthors(authorsMap);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  return { posts, userId, authors, loading, refresh: load };
}
