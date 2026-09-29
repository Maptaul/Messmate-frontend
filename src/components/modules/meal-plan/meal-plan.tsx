"use client";

import { LockIcon } from "lucide-react";
import { toast } from "sonner";
import DataTable, { type Column } from "@/components/ui/data-table";
import MealStepper from "@/components/ui/meal-stepper";
import StatusBadge from "@/components/ui/status-badge";
import { useSetMealPlan, useSuspenseMyCalendar } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MealCounts, MyCalendarDay } from "@/types";
import {
  formatDate,
  formatDeadline,
  formatNumber,
  getErrorMessage,
  todayInDhaka,
} from "@/utils";
import DefaultMealsCard from "./default-meals-card";

/** Plan every day of the month; a tap saves at once, and a locked day says so. */
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

  const { data } = useSuspenseMyCalendar(cycleId);
  const { mutate: setMealPlan } = useSetMealPlan();

  const calendar = data.data;

  // Optimistic: the hook updates the calendar at once and rolls it back on error.
  const handleChange = (day: MyCalendarDay, next: Partial<MealCounts>) => {
    setMealPlan(
      {
        cycleId,
        days: [
          {
            date: day.date,
            lunch: next.lunch ?? day.lunch,
            dinner: next.dinner ?? day.dinner,
          },
        ],
      },
      {
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  const stepper = (day: MyCalendarDay, meal: keyof MealCounts) => {
    const mealName = t(`resident.mealPlan.${meal}`);
    const date = formatDate(day.date, locale);
    return (
      <MealStepper
        value={day[meal]}
        disabled={day.isLocked}
        onChange={(value) => handleChange(day, { [meal]: value })}
        decreaseLabel={t("resident.mealPlan.less", { meal: mealName, date })}
        increaseLabel={t("resident.mealPlan.more", { meal: mealName, date })}
      />
    );
  };

  const columns: Column<MyCalendarDay>[] = [
    {
      key: "day",
      header: t("resident.mealPlan.day"),
      cell: (day) => (
        <div>
          <p className="font-medium">
            {formatDate(day.date, locale)}
            {day.date === today && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {t("resident.today.metaTitle")}
              </span>
            )}
          </p>
          {!day.isLocked && (
            <p className="hidden text-xs text-muted-foreground sm:block">
              {t("resident.mealPlan.deadline", {
                time: formatDeadline(day.deadline, locale),
              })}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "lunch",
      header: t("resident.mealPlan.lunch"),
      cell: (day) => stepper(day, "lunch"),
    },
    {
      key: "dinner",
      header: t("resident.mealPlan.dinner"),
      cell: (day) => stepper(day, "dinner"),
    },
    {
      key: "status",
      header: t("resident.mealPlan.status"),
      className: "hidden md:table-cell",
      cell: (day) =>
        day.isLocked ? (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <LockIcon className="size-3.5" aria-hidden />
            {t("resident.mealPlan.locked")}
          </span>
        ) : (
          <StatusBadge
            status={day.isPlanned ? "OPEN" : "CLOSED"}
            label={t(
              day.isPlanned
                ? "resident.mealPlan.planned"
                : "resident.mealPlan.fromDefault",
            )}
          />
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <DefaultMealsCard
        // A saved default replaces the stale draft.
        key={`${calendar.defaultMeals.lunch}-${calendar.defaultMeals.dinner}`}
        messId={messId}
        defaults={calendar.defaultMeals}
      />

      <p className="text-sm text-muted-foreground">
        {t("resident.mealPlan.plannedTotal", {
          count: formatNumber(calendar.plannedMeals, locale),
        })}
      </p>

      <DataTable
        columns={columns}
        rows={calendar.days}
        rowKey={(day) => day.date}
        caption={t("resident.mealPlan.title")}
        empty={{ title: t("resident.noCycle.title") }}
      />
    </div>
  );
}
