"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useLocale } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format.util";

const STEP = 0.5;
const MAX = 10;

export default function MealStepper({
  value,
  onChange,
  decreaseLabel,
  increaseLabel,
  disabled,
  size = "sm",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  disabled?: boolean;
  size?: "sm" | "lg";
  className?: string;
}) {
  const locale = useLocale();
  const button = cn(
    "grid h-full place-items-center rounded-lg transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
    size === "sm" ? "w-8" : "w-10",
  );

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between rounded-lg border border-input bg-card",
        size === "sm" ? "h-8" : "h-10",
        className,
      )}
    >
      <button
        type="button"
        className={button}
        disabled={disabled || value <= 0}
        aria-label={decreaseLabel}
        onClick={() => onChange(Math.max(0, value - STEP))}
      >
        <MinusIcon />
      </button>
      <output
        className={cn(
          "min-w-9 text-center font-semibold tabular-nums",
          size === "lg" && "text-base",
        )}
      >
        {formatNumber(value, locale)}
      </output>
      <button
        type="button"
        className={button}
        disabled={disabled || value >= MAX}
        aria-label={increaseLabel}
        onClick={() => onChange(Math.min(MAX, value + STEP))}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
