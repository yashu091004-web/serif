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
          "flex size-7 items-center justify-center rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground",
          markClassName
        )}
      >
        S
      </span>
      {!compact && (
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            textClassName
          )}
        >
          Serif
        </span>
      )}
    </Link>
  );
}