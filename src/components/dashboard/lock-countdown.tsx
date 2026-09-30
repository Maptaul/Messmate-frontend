"use client";

import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { formatNumber, minutesToPlanCutoff } from "@/utils";

/** Amber for the last 90 minutes before tomorrow's plan locks. */
const WARN_MINUTES = 90;
const TICK_MS = 30_000;

/** "Tomorrow locks in 2h 14m" until 11 PM Dhaka time, then "locked". */
export default function LockCountdown() {
  const t = useT();
  const locale = useLocale();
  // Null until mounted: the server's clock would render a stale countdown.
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMinutes(minutesToPlanCutoff());
    tick();
    const timer = setInterval(tick, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  if (minutes === null) return null;

  const locked = minutes <= 0;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const time =
    hours > 0
      ? t("shell.hoursMinutes", {
          h: formatNumber(hours, locale),
          m: formatNumber(rest, locale),
        })
      : t("shell.minutesOnly", { m: formatNumber(rest, locale) });

  return (
    <span
      title={t("shell.lockTitle")}
      className={cn(
        "hidden h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap min-[1200px]:inline-flex",
        !locked && minutes < WARN_MINUTES ? "tone-a" : "tone-n",
      )}
    >
      <ClockIcon className="size-3.5" />
      {locked ? t("shell.locked") : t("shell.locksIn", { time })}
    </span>
  );
}
