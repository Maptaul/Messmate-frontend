"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEP = 0.5;
const MAX = 10;

/** − 1.5 + for a meal count: halves allowed, 0 to 10. */
export default function MealStepper({
  value,
  onChange,
  decreaseLabel,
  increaseLabel,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled || value <= 0}
        aria-label={decreaseLabel}
        onClick={() => onChange(Math.max(0, value - STEP))}
      >
        <MinusIcon />
      </Button>
      <output className="w-9 text-center text-sm font-medium tabular-nums">
        {value}
      </output>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={disabled || value >= MAX}
        aria-label={increaseLabel}
        onClick={() => onChange(Math.min(MAX, value + STEP))}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
