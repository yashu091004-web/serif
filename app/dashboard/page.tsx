import Link from "next/link";
import { FileText, PenLine, Eye, CircleCheck, ListTodo, CalendarDays } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { initialStats, initialTasks } from "@/lib/dashboard-data";
import { RecentPosts } from "@/components/dashboard/recent-posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const taskStatusStyles = {
  done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  "in-progress": "bg-sky-500/10 text-sky-600 dark:text-sky-500",
  todo: "bg-muted text-muted-foreground",
} as const;

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

  const name =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.first_name as string) ||
    user.email?.split("@")[0] ||
    "Writer";

  const stats = [
    {
      label: "Total Posts",
      value: initialStats.totalPosts,
      icon: FileText,
      hint: "Across all categories",
    },
    {
      label: "Drafts in Progress",
      value: initialStats.drafts,
      icon: PenLine,
      hint: "2 due this week",
    },
    {
      label: "Monthly Views",
      value: initialStats.monthlyViews,
      icon: Eye,
      hint: "↑ 18% from last month",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {firstName(name)}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your writing workflow from this dashboard.
          </p>
        </div>
        <Button render={<Link href="/dashboard/blogs/new" />} className="gap-1.5">
          <PenLine className="size-4" />
          New Post
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
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

      <section className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <ListTodo className="size-4 text-muted-foreground" />
            <h2 className="font-display text-base font-semibold tracking-tight">
              Upcoming tasks
            </h2>
          </div>
        </div>
        <ul className="divide-y divide-border/60">
          {initialTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              {task.status === "done" ? (
                <CircleCheck className="size-4.5 shrink-0 text-emerald-500" />
              ) : (
                <span
                  className="size-4.5 shrink-0 rounded-full border-2 border-border"
                  aria-hidden
                />
              )}
              <span
                className={
                  task.status === "done"
                    ? "flex-1 text-sm text-muted-foreground line-through"
                    : "flex-1 text-sm font-medium"
                }
              >
                {task.title}
              </span>
              <Badge className={taskStatusStyles[task.status]}>
                {task.status === "in-progress"
                  ? "In progress"
                  : task.status === "done"
                    ? "Done"
                    : "To do"}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {task.due}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <RecentPosts />
    </div>
  );
}