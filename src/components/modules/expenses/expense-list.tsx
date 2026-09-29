"use client";

import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FilterSelect from "@/components/ui/filter-select";
import { Skeleton } from "@/components/ui/skeleton";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { EXPENSE_TYPES } from "@/types";
import { expensesParams } from "@/utils";
import ExpenseCreateDialog from "./expense-create-dialog";
import ExpenseSummary from "./expense-summary";
import ExpenseTable from "./expense-table";
import ExpenseTableLoading from "./expense-table-loading";

export default function ExpenseList({
  cycleId,
  messId,
  locked,
  readOnly = false,
}: {
  cycleId: string;
  messId: string;
  /** The month is closed: read-only, and says why. */
  locked: boolean;
  /** The viewer can't edit (a member): read-only without the note. */
  readOnly?: boolean;
}) {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = expensesParams(get);
  const canEdit = !locked && !readOnly;

  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-28 rounded-xl" />}>
        <ExpenseSummary cycleId={cycleId} />
      </Suspense>

      {locked && (
        <Alert>
          <AlertDescription>{t("manager.closedNote")}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterSelect
          label={t("manager.expenses.typeFilter")}
          allLabel={t("manager.expenses.allTypes")}
          value={queryParams.type}
          options={EXPENSE_TYPES.map((type) => ({
            value: type,
            label: t(`expenseTypes.${type}`),
          }))}
          onChange={(type) => set({ type })}
        />
        {canEdit && <ExpenseCreateDialog cycleId={cycleId} messId={messId} />}
      </div>

      <Suspense fallback={<ExpenseTableLoading />}>
        <ExpenseTable
          cycleId={cycleId}
          messId={messId}
          canEdit={canEdit}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </div>
  );
}
