"use client";

import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useQueryParams from "@/hooks/query-params.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatDate, registerDate, todayInDhaka } from "@/utils";
import MealRegisterLoading from "./meal-register-loading";
import MealRegisterTable from "./meal-register-table";
import MealSummary from "./meal-summary";

/** One day's meals for everyone: pick the day, nudge the counts, save. */
export default function MealRegister({
  cycleId,
  year,
  month,
  locked,
}: {
  cycleId: string;
  year: number;
  month: number;
  locked: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const { get, set } = useQueryParams();

  const date = registerDate(get("date"), year, month, todayInDhaka());
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-28 rounded-xl" />}>
        <MealSummary cycleId={cycleId} />
      </Suspense>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label htmlFor="register-date" className="text-sm font-medium">
            {t("manager.meals.date")}
          </label>
          <Input
            id="register-date"
            type="date"
            className="w-44"
            min={`${prefix}-01`}
            max={`${prefix}-${String(last).padStart(2, "0")}`}
            value={date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </div>
        <p className="pb-2 text-sm text-muted-foreground">
          {formatDate(date, locale)}
        </p>
      </div>

      {locked && (
        <Alert>
          <AlertDescription>{t("manager.closedNote")}</AlertDescription>
        </Alert>
      )}

      <Suspense fallback={<MealRegisterLoading />}>
        <MealRegisterTable cycleId={cycleId} date={date} locked={locked} />
      </Suspense>
    </div>
  );
}
