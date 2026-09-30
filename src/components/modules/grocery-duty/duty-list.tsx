"use client";

import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/i18n-provider";
import DutyCalendar from "./duty-calendar";
import DutyTable from "./duty-table";
import DutyTableLoading from "./duty-table-loading";

export default function DutyList({
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

  return (
    <>
      {locked && (
        <Alert>
          <AlertDescription>{t("manager.closedNote")}</AlertDescription>
        </Alert>
      )}

      <Suspense
        fallback={<Skeleton className="hidden h-120 rounded-xl md:block" />}
      >
        <DutyCalendar cycleId={cycleId} />
      </Suspense>

      <Suspense fallback={<DutyTableLoading />}>
        <DutyTable
          cycleId={cycleId}
          messId={messId}
          year={year}
          month={month}
          locked={locked}
        />
      </Suspense>
    </>
  );
}
