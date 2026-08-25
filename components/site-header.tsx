"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
];

function isActive(pathname: string, href: string) {
  if (href === "/blog") return pathname.startsWith("/blog");
  if (href === "/pricing") return pathname.startsWith("/pricing");
  return false;
}

const ghostPill =
  "rounded-lg border border-border/60 bg-transparent px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-muted-foreground/60";

const solidPill =
  "rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0";

export function SiteHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();

  return (
    <header
      data-site-header
      className="sticky top-3 z-50 mx-auto mt-3 flex h-11 w-[min(840px,calc(100%-2.5rem))] items-center gap-6 rounded-xl border border-border/50 bg-background/80 pl-4 pr-2.5 shadow-sm backdrop-blur-xl"
    >
      <div className="mr-auto flex shrink-0 items-center">
        <Logo />
      </div>

      {!isLoggedIn && (
        <nav
          className="hidden items-center gap-5 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "text-sm transition-colors",
                isActive(pathname, link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {isLoggedIn ? (
        <div className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "sm", className: "rounded-full" })}
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="hidden items-center gap-1.5 md:flex">
          <Link href="/login" className={ghostPill}>
            Log in
          </Link>
          <Link href="/signup" className={solidPill}>
            Get Started
          </Link>
        </div>
      )}

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="rounded-full"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Logo compact />
              </SheetTitle>
            </SheetHeader>
            <nav
              className="flex flex-col gap-1 px-4"
              aria-label="Mobile navigation"
            >
              {isLoggedIn ? (
                <div className="mt-4 flex flex-col gap-2">
                  <Link href="/dashboard" className={buttonVariants()}>
                    Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-2">
                    <Link href="/login" className={buttonVariants({ variant: "outline" })}>
                      Log in
                    </Link>
                    <Link href="/signup" className={buttonVariants()}>
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
