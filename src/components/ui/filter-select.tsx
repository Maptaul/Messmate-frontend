"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/i18n/i18n-provider";

const ALL = "__all__";

/** A dropdown filter whose first option clears it. */
export default function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel,
}: {
  label: string;
  value: string | undefined;
  options: { label: string; value: string }[];
  onChange: (value: string | undefined) => void;
  allLabel?: string;
}) {
  const t = useT();
  const items = [
    { label: allLabel ?? t("common.all"), value: ALL },
    ...options,
  ];

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
