import Link from "next/link";
import { FileText, PenLine, CircleCheck, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PostStatus } from "@/lib/types";

function firstName(fullName: string): string {
  return fullName.split(/\s+/)[0] || fullName;
}

export default async function DashboardPage() {
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
  let name = fallbackName;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.full_name?.trim()) name = profile.full_name.trim();
  } catch {}

  async function countByStatus(status?: PostStatus): Promise<number> {
    let query = supabase.from("posts").select("id", { count: "exact", head: true });
    if (status) query = query.eq("status", status);
    const { count, error } = await query;
    if (error) return 0;
    return count ?? 0;
  }

  const [totalPosts, drafts, published] = await Promise.all([
    countByStatus(),
    countByStatus("draft"),
    countByStatus("published"),
  ]);

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      hint: "Across all statuses",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: PenLine,
      hint: "Not published yet",
    },
    {
      label: "Published",
      value: published,
      icon: CircleCheck,
      hint: "Live on your blog",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="animate-in fade-in slide-in-from-bottom-3 flex flex-col gap-4 duration-500 ease-out [animation-fill-mode:both] motion-reduce:animate-none sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {firstName(name)}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your writing workflow from this dashboard.
          </p>
        </div>
        <Button render={<Link href="/dashboard/blogs/new" />} className="gap-1.5">
          <Plus className="size-4" />
          New Post
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            style={{ animationDelay: `${80 + index * 80}ms` }}
            className="animate-in fade-in slide-in-from-bottom-3 p-5 duration-500 ease-out [animation-fill-mode:both] transition-shadow hover:shadow-md motion-reduce:animate-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                <stat.icon className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
          </Card>
        ))}
      </section>

      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out [animation-delay:240ms] [animation-fill-mode:both] motion-reduce:animate-none">
        <RecentPosts />
      </div>
    </div>
  );
}
