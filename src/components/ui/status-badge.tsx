"use client";

import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { humanize } from "@/utils/format.util";

type Tone = "tone-g" | "tone-a" | "tone-r" | "tone-b" | "tone-v" | "tone-n";

// Status → tone. The label always goes with the colour.
const STATUS_TONE: Record<string, Tone> = {
  // users & memberships
  ACTIVE: "tone-g",
  BLOCKED: "tone-r",
  LEFT: "tone-n",
  // roles
  ADMIN: "tone-v",
  MESS_MANAGER: "tone-b",
  MEMBER: "tone-n",
  // manager requests
  PENDING: "tone-a",
  APPROVED: "tone-g",
  REJECTED: "tone-r",
  // billing cycles and meal plans
  OPEN: "tone-g",
  CLOSED: "tone-n",
  PLANNED: "tone-g",
  DEFAULT: "tone-n",
  SOON: "tone-a",
  // bills & payments
  PAID: "tone-g",
  SETTLED: "tone-g",
  CREDIT: "tone-g",
  PARTIAL: "tone-a",
  CARRIED: "tone-n",
  UNPAID: "tone-a",
  OVERDUE: "tone-r",
  FAILED: "tone-r",
  CANCELLED: "tone-n",
  REFUNDED: "tone-b",
  CASH: "tone-n",
  CARD: "tone-b",
  BKASH: "tone-v",
  // finance
  INCOME: "tone-g",
  EXPENSE: "tone-r",
};

export default function StatusBadge({
  status,
  label,
  tone,
  className,
}: {
  status: string;
  label?: string;
  /** Overrides the status's own tone (audit actions pick theirs by verb). */
  tone?: Tone;
  className?: string;
}) {
  const t = useT();
  const translated = t.dynamic(`status.${status}`);

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-[22px] rounded-full px-2 text-xs",
        tone ?? STATUS_TONE[status] ?? "tone-n",
        className,
      )}
    >
      {label ??
        (translated.startsWith("status.") ? humanize(status) : translated)}
    </Badge>
  );
}
