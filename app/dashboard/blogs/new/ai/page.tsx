import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";
import { AIPostForm } from "@/components/dashboard/ai-post-form";

export default async function AiNewBlogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!(await isPro(supabase, user.id))) {
    redirect("/pricing");
  }

  return <AIPostForm />;
}
