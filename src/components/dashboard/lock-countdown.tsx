"use client";

import { ClockIcon } from "lucide-react";
import usePlanCutoff from "@/hooks/plan-cutoff.hook";
import { useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

const WARN_MINUTES = 90;

export default function LockCountdown() {
  const t = useT();
  const cutoff = usePlanCutoff();

  if (!cutoff) return null;

  return (
    <span
      title={t("shell.lockTitle")}
      className={cn(
        "hidden h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap min-[1200px]:inline-flex",
        !cutoff.locked && cutoff.minutes < WARN_MINUTES ? "tone-a" : "tone-n",
      )}
    >
      <ClockIcon className="size-3.5" />
      {cutoff.locked
        ? t("shell.locked")
        : t("shell.locksIn", { time: cutoff.time })}
    </span>
  );
}
