"use client";

import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { registerDate, todayInDhaka } from "@/utils";
import MealEntriesTable from "./meal-entries-table";
import MealRegisterLoading from "./meal-register-loading";
import MealRegisterTable from "./meal-register-table";
import MealSummary from "./meal-summary";

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
  const { get, set } = useQueryParams();

  const tab = get("tab") === "all" ? "all" : "record";
  const date = registerDate(get("date"), year, month, todayInDhaka());

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={(value) =>
          set({ tab: value === "all" ? "all" : undefined })
        }
      >
        <TabsList>
          <TabsTrigger value="record" className="px-3">
            {t("manager.meals.tabRecord")}
          </TabsTrigger>
          <TabsTrigger value="all" className="px-3">
            {t("manager.meals.tabAll")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {locked && (
        <Alert>
          <AlertDescription>{t("manager.closedNote")}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-4">
          {tab === "record" ? (
            <Suspense fallback={<MealRegisterLoading />}>
              <MealRegisterTable
                cycleId={cycleId}
                year={year}
                month={month}
                date={date}
                locked={locked}
                onDateChange={(next) => set({ date: next })}
              />
            </Suspense>
          ) : (
            <MealEntriesTable
              cycleId={cycleId}
              year={year}
              month={month}
              locked={locked}
            />
          )}
        </div>
        <Suspense
          fallback={<Skeleton className="h-80 flex-[1_1_300px] rounded-xl" />}
        >
          <MealSummary cycleId={cycleId} year={year} month={month} />
        </Suspense>
      </div>
    </>
  );
}
