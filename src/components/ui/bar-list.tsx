import { cn } from "@/lib/utils";

export interface BarSegment {
  value: number;
  color: string;
}

export interface BarItem {
  key: string;
  label: string;
  /** The figure printed after the bar (already formatted). */
  display: string;
  value: number;
  /** Stacked parts (lunch + dinner); their values should add up to `value`. */
  segments?: BarSegment[];
  color?: string;
  /** Hover text; defaults to "label: display". */
  tip?: string;
}

/** Leaves room after the longest bar for its figure. */
const MAX_WIDTH = 80;

/**
 * Horizontal bars with direct labels — the design's chart for any "by type" or
 * "by member" breakdown. Bars scale to the largest value; the figure sits at
 * the bar's end, so there is no axis to read.
 */
export default function BarList({
  items,
  className,
  barClassName = "h-4.5",
}: {
  items: BarItem[];
  className?: string;
  barClassName?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 0);

  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li
          key={item.key}
          title={item.tip ?? `${item.label}: ${item.display}`}
          className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-2.5"
        >
          <span className="truncate text-[13px] text-muted-foreground">
            {item.label}
          </span>
          <span className="flex min-w-0 items-center gap-2 border-l border-(--grid)">
            <span
              className={cn(
                "flex min-w-0.75 gap-px overflow-hidden rounded-r-sm",
                barClassName,
              )}
              style={{
                width: `${max > 0 ? (item.value / max) * MAX_WIDTH : 0}%`,
              }}
            >
              {(
                item.segments ?? [
                  { value: 1, color: item.color ?? "var(--chart-1)" },
                ]
              ).map((segment, index) => (
                <span
                  // Segments are positional (lunch, then dinner).
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed order
                  key={index}
                  className="h-full"
                  style={{ flex: segment.value, background: segment.color }}
                />
              ))}
            </span>
            <span className="text-[13px] font-semibold whitespace-nowrap tabular-nums">
              {item.display}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
