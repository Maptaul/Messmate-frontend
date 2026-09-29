"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

/** A dropdown filter whose first option clears it. */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel = "All",
}: {
  label: string;
  value: string | undefined;
  options: { label: string; value: string }[];
  onChange: (value: string | undefined) => void;
  allLabel?: string;
}) {
  const items = [{ label: allLabel, value: ALL }, ...options];

  return (
    <Select
      items={items}
      value={value ?? ALL}
      onValueChange={(next) =>
        onChange(next && next !== ALL ? String(next) : undefined)
      }
    >
      <SelectTrigger aria-label={label} className="w-full sm:w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
