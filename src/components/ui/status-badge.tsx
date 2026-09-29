"use client";

import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { humanize } from "@/utils/format.util";

type Tone = "green" | "amber" | "red" | "blue" | "violet" | "gray";

// Fixed semantic hues (with dark variants) — the one place raw colours are
// allowed, because "paid" must look paid whatever the theme.
const TONE_CLASS: Record<Tone, string> = {
  green:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  amber:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  red: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  blue: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  violet:
    "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  gray: "border-border bg-muted text-muted-foreground",
};

const STATUS_TONE: Record<string, Tone> = {
  // users & memberships
  ACTIVE: "green",
  BLOCKED: "red",
  LEFT: "gray",
  // roles
  ADMIN: "violet",
  MESS_MANAGER: "blue",
  MEMBER: "gray",
  // billing cycles
  OPEN: "green",
  CLOSED: "gray",
  // bills & payments
  PAID: "green",
  PARTIAL: "amber",
  UNPAID: "amber",
  FAILED: "red",
  CANCELLED: "gray",
  REFUNDED: "blue",
  // finance
  INCOME: "green",
  EXPENSE: "red",
};

export default function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) {
  const t = useT();
  const tone = STATUS_TONE[status] ?? "gray";
  const translated = t.dynamic(`status.${status}`);

  return (
    <Badge variant="outline" className={cn(TONE_CLASS[tone], className)}>
      {label ??
        (translated.startsWith("status.") ? humanize(status) : translated)}
    </Badge>
  );
}
