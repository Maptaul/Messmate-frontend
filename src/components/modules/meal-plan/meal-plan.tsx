"use client";

import { ChevronRightIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import StatusBadge from "@/components/ui/status-badge";
import { useSuspenseMyCalendar } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { MyCalendarDay } from "@/types";
import {
  formatDate,
  formatMonth,
  formatNumber,
  todayInDhaka,
  weekdayNames,
} from "@/utils";
import DefaultMealsCard from "./default-meals-card";
import MealPlanBulkDialog from "./meal-plan-bulk-dialog";
import MealPlanDayDialog from "./meal-plan-day-dialog";

export default function MealPlan({
  cycleId,
  messId,
}: {
  cycleId: string;
  messId: string;
}) {
  const t = useT();
  const locale = useLocale();
  const today = todayInDhaka();
  const n = (value: number) => formatNumber(value, locale);
  const [picked, setPicked] = useState<string | null>(null);

  const { data } = useSuspenseMyCalendar(cycleId);
  const calendar = data.data;
  const { year, month } = calendar.cycle;
  const lead = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const cells: (MyCalendarDay | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...calendar.days,
  ];
  while (cells.length % 7) cells.push(null);
  const weekdays = weekdayNames(locale);

  const counts = (day: MyCalendarDay) =>
    `${t("resident.mealPlan.lunchShort")} ${n(day.lunch)}  ${t("resident.mealPlan.dinnerShort")} ${n(day.dinner)}`;
  const badge = (day: MyCalendarDay) => (
    <StatusBadge
      status={day.isPlanned ? "PLANNED" : "DEFAULT"}
      label={
        day.isPlanned
          ? t("resident.mealPlan.planned")
          : t("resident.mealPlan.fromDefault")
      }
    />
  );
  const aria = (day: MyCalendarDay) =>
    t("resident.mealPlan.dayAria", {
      date: formatDate(day.date, locale),
      lunch: n(day.lunch),
      dinner: n(day.dinner),
    });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">
            {t("resident.mealPlan.title")} · {formatMonth(year, month, locale)}
          </h1>
          <p className="text-muted-foreground">
            {t("resident.mealPlan.description")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MealPlanBulkDialog
            away
            cycleId={cycleId}
            days={calendar.days}
            defaults={calendar.defaultMeals}
          />
          <MealPlanBulkDialog
            cycleId={cycleId}
            days={calendar.days}
            defaults={calendar.defaultMeals}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DefaultMealsCard
          // A saved default replaces the stale draft.
          key={`${calendar.defaultMeals.lunch}-${calendar.defaultMeals.dinner}`}
          messId={messId}
          defaults={calendar.defaultMeals}
        />
        <div className="flex flex-col justify-center gap-2 rounded-xl border bg-card p-4 text-[13px] text-muted-foreground shadow-1">
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5">
              <StatusBadge
                status="PLANNED"
                label={t("resident.mealPlan.planned")}
              />
              {t("resident.mealPlan.lgPlanned")}
            </span>
            <span className="flex items-center gap-1.5">
              <StatusBadge
                status="DEFAULT"
                label={t("resident.mealPlan.fromDefault")}
              />
              {t("resident.mealPlan.lgDefault")}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <LockIcon className="size-3.5" />
            {t("resident.mealPlan.lgLocked")}
          </span>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-1 md:block">
        <div className="grid grid-cols-7 bg-muted">
          {weekdays.map((name) => (
            <div key={name} className="micro px-3 py-2 text-muted-foreground">
              {name}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, index) =>
            day ? (
              <button
                key={day.date}
                type="button"
                aria-label={aria(day)}
                onClick={() => setPicked(day.date)}
                className={cn(
                  "flex min-h-24 flex-col items-start gap-1.5 border-t border-r p-2.5 text-left transition-colors hover:bg-accent/70",
                  day.date === today &&
                    "bg-primary-tint ring-1 ring-primary ring-inset",
                  day.isLocked && day.date !== today && "text-muted-foreground",
                )}
              >
                <span className="flex w-full items-center justify-between text-xs font-medium">
                  {n(Number(day.date.slice(8, 10)))}
                  {day.isLocked && <LockIcon className="size-3" />}
                </span>
                <span className="font-mono text-xs whitespace-pre">
                  {counts(day)}
                </span>
                {badge(day)}
              </button>
            ) : (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: blank cells have nothing else
                key={index}
                className="min-h-24 border-t border-r bg-muted"
              />
            ),
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-2 md:hidden">
        {calendar.days.map((day) => (
          <li key={day.date}>
            <button
              type="button"
              aria-label={aria(day)}
              onClick={() => setPicked(day.date)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border bg-card px-3.5 py-3 text-left shadow-1",
                day.date === today && "border-primary bg-primary-tint",
              )}
            >
              <span className="w-24 font-medium">
                {formatDate(day.date, locale)}
              </span>
              <span className="flex-1 font-mono text-xs whitespace-pre">
                {counts(day)}
              </span>
              {badge(day)}
              {day.isLocked ? (
                <LockIcon className="size-4 text-muted-foreground" />
              ) : (
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <MealPlanDayDialog
        cycleId={cycleId}
        day={calendar.days.find((day) => day.date === picked) ?? null}
        defaults={calendar.defaultMeals}
        onClose={() => setPicked(null)}
      />
    </>
  );
}
