import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <Logo />
          <span>&copy; {new Date().getFullYear()} Serif</span>
        </div>
        <nav className="flex items-center gap-6" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="transition-colors hover:text-foreground"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </footer>
  );
}
