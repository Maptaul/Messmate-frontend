"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSuspenseFinanceSummary } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { SummaryPeriod } from "@/types";
import {
  formatDate,
  formatLongDate,
  formatMonth,
  formatYear,
  shiftPeriod,
} from "@/utils";

/** ‹ September 2026 › — steps the summary one period back or forward. */
export default function FinancePeriodNav({
  period,
  date,
  onChange,
}: {
  period: SummaryPeriod;
  date?: string;
  onChange: (date: string) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const { data } = useSuspenseFinanceSummary({ period, date });

  const { from, to } = data.data;
  const anchor = from.slice(0, 10);
  const year = Number(anchor.slice(0, 4));
  const label =
    period === "daily"
      ? formatLongDate(from, locale)
      : period === "weekly"
        ? `${formatDate(from, locale)} – ${formatDate(to, locale)}`
        : period === "monthly"
          ? formatMonth(year, Number(anchor.slice(5, 7)), locale)
          : formatYear(year, locale);

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-card p-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("finance.prevPeriod")}
        onClick={() => onChange(shiftPeriod(anchor, period, -1))}
      >
        <ChevronLeftIcon />
      </Button>
      <span className="min-w-36 text-center text-[13px] font-semibold">
        {label}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("finance.nextPeriod")}
        onClick={() => onChange(shiftPeriod(anchor, period, 1))}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
