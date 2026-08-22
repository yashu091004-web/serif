import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPostById } from "@/lib/posts";
import { BlogEditor } from "@/components/dashboard/blog-editor";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let post = null;
  try {
    post = await getPostById(supabase, id);
  } catch {
    post = null;
  }
  if (!post || post.userId !== user.id) notFound();

  return <BlogEditor post={post} />;
}
