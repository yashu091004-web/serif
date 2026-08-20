import { BlogEditor } from "@/components/dashboard/blog-editor";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogEditor postId={id} />;
}