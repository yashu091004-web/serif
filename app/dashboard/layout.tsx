import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/shell";
import { authorInitials } from "@/lib/profiles";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fallbackName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.first_name as string) ||
    user.email?.split("@")[0] ||
    "Writer";
  const email = user.email ?? "";

  let name = fallbackName;
  let avatarUrl: string | null = null;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.full_name?.trim()) name = profile.full_name.trim();
    if (profile?.avatar_url) avatarUrl = profile.avatar_url;
  } catch {}

  return (
    <DashboardShell
      name={name}
      email={email}
      initials={authorInitials(name)}
      avatarUrl={avatarUrl}
    >
      {children}
    </DashboardShell>
  );
}
