import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/shell";

export const dynamic = "force-dynamic";

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Y";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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

  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.first_name as string) ||
    user.email?.split("@")[0] ||
    "Writer";
  const email = user.email ?? "";

  return (
    <DashboardShell name={name} email={email} initials={initialsFor(name)}>
      {children}
    </DashboardShell>
  );
}