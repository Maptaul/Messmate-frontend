"use client";

import type { ReactNode } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface RadioCardOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
  icon?: ReactNode;
}

export default function RadioCards<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: RadioCardOption<T>[];
  label: string;
  className?: string;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as T)}
      aria-label={label}
      className={cn("gap-2", className)}
    >
      {options.map((option) => (
        // biome-ignore lint/a11y/noLabelWithoutControl: the radio is inside
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-colors has-data-checked:border-primary has-data-checked:bg-primary-tint"
        >
          {option.icon ?? (
            <RadioGroupItem value={option.value} className="mt-0.5" />
          )}
          {option.icon && (
            <RadioGroupItem value={option.value} className="sr-only" />
          )}
          <span className="grid gap-0.5">
            <span className="font-medium">{option.label}</span>
            {option.hint && (
              <span className="text-xs text-muted-foreground">
                {option.hint}
              </span>
            )}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}
