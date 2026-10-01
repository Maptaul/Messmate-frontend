"use client";

import { useEffect, useState } from "react";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatNumber, minutesToPlanCutoff } from "@/utils";

const TICK_MS = 30_000;

/**
 * Minutes until tomorrow's plan locks at 11 PM Dhaka time, ticking, with the
 * "2h 14m" label. Null until mounted: the server's clock would be stale.
 */
export default function usePlanCutoff() {
  const t = useT();
  const locale = useLocale();
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMinutes(minutesToPlanCutoff());
    tick();
    const timer = setInterval(tick, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  if (minutes === null) return null;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const time =
    hours > 0
      ? t("shell.hoursMinutes", {
          h: formatNumber(hours, locale),
          m: formatNumber(rest, locale),
        })
      : t("shell.minutesOnly", { m: formatNumber(rest, locale) });

  return { minutes, locked: minutes <= 0, time };
}
