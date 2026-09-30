"use client";

import { ShoppingCartIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { useSuspenseCycleDuties, useSuspenseDutyCalendar } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatDate, formatNumber, formatShortMonth } from "@/utils";
import DutyActions from "./duty-actions";
import { dutyColors } from "./duty-colors";

const DAY_MS = 24 * 60 * 60 * 1000;
const daysBetween = (start: string, end: string) =>
  Math.round(
    (Date.parse(end.slice(0, 10)) - Date.parse(start.slice(0, 10))) / DAY_MS,
  ) + 1;

/** Runs of consecutive day numbers: [1,2,3,7] → [[1,3],[7,7]]. */
function runs(days: number[]) {
  const out: [number, number][] = [];
  for (const day of days) {
    const last = out.at(-1);
    if (last && last[1] === day - 1) last[1] = day;
    else out.push([day, day]);
  }
  return out;
}

/** Every turn of the month, then the days nobody covers. */
export default function DutyTable({
  cycleId,
  messId,
  year,
  month,
  locked,
}: {
  cycleId: string;
  messId: string;
  year: number;
  month: number;
  locked: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);

  const { data } = useSuspenseCycleDuties(cycleId);
  const { data: calendar } = useSuspenseDutyCalendar(cycleId);

  const duties = [...data.data].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
  const colorOf = dutyColors(duties);
  const gaps = runs(
    calendar.data.days
      .filter((day) => !day.memberId)
      .map((day) => Number(day.date.slice(8, 10))),
  );

  if (duties.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCartIcon}
        title={t("manager.duty.empty")}
        description={t("manager.duty.emptyHint")}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-1">
      <h2 className="border-b px-4 py-3.5 font-semibold">
        {t("manager.duty.turns")}
      </h2>
      <ul>
        {duties.map((duty) => (
          <li
            key={duty.id}
            className="flex flex-wrap items-center gap-3 border-b px-4 py-2.5"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ background: colorOf(duty.member.id) }}
            />
            <span className="flex-[1_1_140px] font-medium">
              {duty.member.user.name}
            </span>
            <span className="tabular-nums">
              {formatDate(duty.startDate, locale)} –{" "}
              {formatDate(duty.endDate, locale)}
            </span>
            <span className="text-[13px] text-muted-foreground">
              {t("manager.duty.dayCount", {
                count: n(daysBetween(duty.startDate, duty.endDate)),
              })}
            </span>
            <span className="flex-[1_1_140px] text-[13px] text-muted-foreground">
              {duty.note}
            </span>
            {!locked && (
              <DutyActions
                duty={duty}
                cycleId={cycleId}
                messId={messId}
                year={year}
                month={month}
              />
            )}
          </li>
        ))}
      </ul>
      <p className="px-4 py-2.5 text-xs text-muted-foreground">
        {gaps.length > 0
          ? t("manager.duty.gaps", {
              days: gaps
                .map(([from, to]) =>
                  from === to ? n(from) : `${n(from)}–${n(to)}`,
                )
                .join(", "),
              month: formatShortMonth(year, month, locale),
            })
          : t("manager.duty.noGaps")}
      </p>
    </div>
  );
}
