import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <Logo />
          <p className="max-w-xs text-center text-sm text-muted-foreground sm:text-left">
            The intelligent way to create, optimize, and publish compelling
            content.
          </p>
        </div>
        <nav
          className="flex items-center gap-6 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          <Link
            href="/#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link
            href="/signup"
            className="transition-colors hover:text-foreground"
          >
            Get started
          </Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Serif. All rights reserved.
        </p>
      </div>
    </footer>
  );
}