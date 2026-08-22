"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/blogs", label: "Blogs", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function SidebarNav({
  collapsed,
  name,
  email,
  initials,
  avatarUrl,
  onNavigate,
}: {
  collapsed: boolean;
  name: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        collapsed ? "items-center" : "items-stretch"
      )}
    >
      <div className={cn("flex h-14 shrink-0 items-center border-b border-border/80", collapsed ? "justify-center" : "px-4")}>
        <Logo compact={collapsed} href="/dashboard" />
      </div>

      <nav
        className={cn("flex flex-col gap-1 py-4", collapsed ? "px-3" : "px-3")}
        aria-label="Dashboard navigation"
      >
        <TooltipProvider delay={0}>
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const linkClassName = cn(
              "flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
              collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
              active
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            );

            if (!collapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={linkClassName}
                >
                  <item.icon className="size-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={linkClassName}
                    />
                  }
                >
                  <item.icon className="size-4.5 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/80 py-4">
        <div
          className={cn(
            "flex items-center gap-2.5 px-3",
            collapsed && "justify-center px-2"
          )}
        >
          <Avatar className="size-8 shrink-0">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-tight">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          )}
        </div>
        <div className={cn("px-3", collapsed && "flex justify-center px-0")}>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className={cn(
                "w-full gap-2 text-muted-foreground hover:text-destructive",
                collapsed && "w-9 px-0"
              )}
            >
              <LogOut className="size-4" />
              {!collapsed && "Log out"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}