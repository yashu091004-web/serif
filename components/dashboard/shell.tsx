"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { Menu, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { Logo } from "@/components/logo";
import { SidebarNav } from "@/components/dashboard/sidebar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function DashboardShell({
  name,
  email,
  initials,
  avatarUrl,
  children,
}: {
  name: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}) {
  const isTablet = useMediaQuery("(max-width: 1023px)");
  const [manualCollapsed, setManualCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const collapsed = isTablet || manualCollapsed;

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border/80 bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarNav
          collapsed={collapsed}
          name={name}
          email={email}
          initials={initials}
          avatarUrl={avatarUrl}
        />
      </aside>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-[padding] duration-200",
          collapsed ? "md:pl-16" : "md:pl-60"
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-background/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarNav
                collapsed={false}
                name={name}
                email={email}
                initials={initials}
                avatarUrl={avatarUrl}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <button
            type="button"
            onClick={() => setManualCollapsed((value) => !value)}
            className="hidden size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4.5" />
            ) : (
              <PanelLeftClose className="size-4.5" />
            )}
          </button>

          <div className="md:hidden">
            <Logo href="/dashboard" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/dashboard/blogs/new"
              className={buttonVariants({ size: "sm", className: "gap-1" })}
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}