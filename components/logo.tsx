import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
  markClassName,
  textClassName,
  compact = false,
}: {
  href?: string;
  className?: string;
  markClassName?: string;
  textClassName?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("flex shrink-0 items-center gap-2", className)}
      aria-label="Serif home"
    >
      <span
        className={cn(
          "flex items-center justify-center",
          markClassName
        )}
      >
        <span className="block size-2 rounded-full bg-gold" />
      </span>
      {!compact && (
        <span
          className={cn(
            "font-display text-xl font-bold tracking-tight",
            textClassName
          )}
        >
          Serif
        </span>
      )}
    </Link>
  );
}