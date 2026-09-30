import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Sparkline from "./sparkline";

/**
 * One cell of a StatStrip: label, a big tabular value, a hint and an optional
 * trend. With `href` the whole cell is a link to the page behind the number.
 */
export default function StatCard({
  label,
  value,
  hint,
  hintClassName,
  valueClassName,
  href,
  trend,
  trendColor,
  children,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  hintClassName?: string;
  valueClassName?: string;
  href?: string;
  trend?: number[];
  trendColor?: string;
  /** Extra content under the value, e.g. a progress meter. */
  children?: ReactNode;
}) {
  const body = (
    <>
      <span className="text-[12.5px] font-medium text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "truncate text-2xl leading-tight font-semibold tracking-[-0.01em] tabular-nums",
          valueClassName,
        )}
      >
        {value}
      </span>
      {children}
      {(hint || trend) && (
        <span className="mt-auto flex items-end justify-between gap-2">
          <span
            className={cn(
              "text-xs leading-snug text-muted-foreground",
              hintClassName,
            )}
          >
            {hint}
          </span>
          {trend && <Sparkline values={trend} color={trendColor} />}
        </span>
      )}
    </>
  );
  const className = cn(
    "flex min-w-0 flex-col gap-1.5 border-r border-b px-5 py-4 text-foreground",
    trend && "gap-2.5",
  );

  return href ? (
    <Link
      href={href}
      className={cn(className, "transition-colors hover:bg-accent")}
    >
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
