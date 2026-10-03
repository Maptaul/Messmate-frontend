"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  LockIcon,
  LockOpenIcon,
} from "lucide-react";
import { Suspense } from "react";
import useQueryParams from "@/hooks/query-params.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import {
  dayInDhaka,
  formatDateTime,
  formatLongDate,
  registerDate,
  todayInDhaka,
} from "@/utils";
import HeadcountTable from "./headcount-table";
import HeadcountTableLoading from "./headcount-table-loading";

const shift = (date: string, days: number) =>
  new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);

/** A day's plan locks at 11 PM Dhaka time the night before. */
const lockMoment = (date: string) =>
  new Date(`${shift(date, -1)}T23:00:00+06:00`);

export default function HeadcountList({
  cycleId,
  year,
  month,
}: {
  cycleId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const locale = useLocale();
  const { get, set } = useQueryParams();

  const today = todayInDhaka();
  const tomorrow = dayInDhaka(1);
  const date = registerDate(get("date"), year, month, today);
  const prefix = `${year}-${String(month).padStart(2, "0")}-`;
  const inMonth = (day: string) => day.startsWith(prefix);

  const locksAt = lockMoment(date);
  const locked = Date.now() >= locksAt.getTime();
  const lock = locked
    ? {
        tone: "tone-n",
        icon: LockIcon,
        text: t("manager.headcount.lockedAt", {
          time: formatDateTime(locksAt, locale),
        }),
      }
    : date === tomorrow
      ? {
          tone: "tone-a",
          icon: ClockIcon,
          text: t("manager.headcount.locksTonight"),
        }
      : {
          tone: "tone-g",
          icon: LockOpenIcon,
          text: t("manager.headcount.openUntil", {
            time: formatDateTime(locksAt, locale),
          }),
        };

  const chip = (day: string, label: string) =>
    inMonth(day) && (
      <button
        type="button"
        onClick={() => set({ date: day })}
        className={cn(
          "h-7 rounded-full border px-2.5 text-xs font-medium transition-colors",
          date === day
            ? "border-ring bg-primary-tint"
            : "bg-card hover:bg-accent",
        )}
      >
        {label}
      </button>
    );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center overflow-hidden rounded-lg border bg-card">
          <button
            type="button"
            aria-label={t("manager.headcount.previousDay")}
            disabled={!inMonth(shift(date, -1))}
            onClick={() => set({ date: shift(date, -1) })}
            className="grid size-9 place-items-center hover:bg-accent disabled:opacity-40"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <span className="min-w-40 px-2 text-center font-semibold">
            {formatLongDate(`${date}T00:00:00+06:00`, locale)}
          </span>
          <button
            type="button"
            aria-label={t("manager.headcount.nextDay")}
            disabled={!inMonth(shift(date, 1))}
            onClick={() => set({ date: shift(date, 1) })}
            className="grid size-9 place-items-center hover:bg-accent disabled:opacity-40"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
        {chip(today, t("manager.headcount.today"))}
        {chip(tomorrow, t("manager.headcount.tomorrow"))}
        <span
          className={cn(
            "flex min-h-6.5 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
            lock.tone,
          )}
        >
          <lock.icon className="size-3.5" />
          {lock.text}
        </span>
      </div>

      <Suspense fallback={<HeadcountTableLoading />}>
        <HeadcountTable
          cycleId={cycleId}
          year={year}
          month={month}
          date={date}
          started={date <= today}
          onPick={(day) => set({ date: day })}
        />
      </Suspense>
    </>
  );
}
