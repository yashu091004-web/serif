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
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

function isActive(pathname: string, href: string) {
  if (href === "/blog") return pathname.startsWith("/blog");
  if (href === "/pricing") return pathname.startsWith("/pricing");
  return false;
}

const ghostPill =
  "rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-muted-foreground/60";

const solidPill =
  "rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0";

export function SiteHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 mx-auto mt-4 flex h-14 w-[min(920px,calc(100%-2rem))] items-center gap-8 rounded-full border border-border/70 bg-background/70 pl-5 pr-3 backdrop-blur-xl">
      <div className="mr-auto flex shrink-0 items-center">
        <Logo />
      </div>

      {!isLoggedIn && (
        <nav
          className="hidden items-center gap-7 md:flex"
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
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "sm", className: "rounded-full" })}
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className={ghostPill}>
            Log in
          </Link>
          <Link href="/signup" className={solidPill}>
            Sign up
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
                      Sign up
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
