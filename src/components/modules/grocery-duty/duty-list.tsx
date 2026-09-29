"use client";

import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/i18n-provider";
import DutyCreateDialog from "./duty-create-dialog";
import DutyTable from "./duty-table";
import DutyTableLoading from "./duty-table-loading";
import DutyToday from "./duty-today";

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
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-28 rounded-xl" />}>
        <DutyToday cycleId={cycleId} />
      </Suspense>

      {locked ? (
        <Alert>
          <AlertDescription>{t("manager.closedNote")}</AlertDescription>
        </Alert>
      ) : (
        <div className="flex justify-end">
          <DutyCreateDialog
            cycleId={cycleId}
            messId={messId}
            year={year}
            month={month}
          />
        </div>
      )}

      <Suspense fallback={<DutyTableLoading />}>
        <DutyTable
          cycleId={cycleId}
          messId={messId}
          year={year}
          month={month}
          locked={locked}
        />
      </Suspense>
    </div>
  );
}
