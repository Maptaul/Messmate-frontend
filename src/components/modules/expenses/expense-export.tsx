"use client";

import { getCycleExpenses } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { Expense } from "@/types";
import { EXPORT_PAGE_SIZE, expensesParams } from "@/utils";

export default function ExpenseExport({ cycleId }: { cycleId: string }) {
  const t = useT();
  const { get } = useQueryParams();
  const params = expensesParams(get);

  return (
    <ExportCsvButton<Expense>
      name="expenses"
      fetchPage={(page) =>
        getCycleExpenses(cycleId, { ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("manager.expenses.date"), (expense) => expense.spentAt.slice(0, 10)],
        [
          t("manager.expenses.type"),
          (expense) => t(`expenseTypes.${expense.type}`),
        ],
        [
          t("manager.expenses.description_col"),
          (expense) => expense.description ?? "",
        ],
        [t("manager.expenses.amount"), (expense) => expense.amount],
        [
          t("manager.expenses.split"),
          (expense) => t(`manager.expenses.splits.${expense.splitMethod}`),
        ],
        [
          t("manager.expenses.paidBy"),
          (expense) =>
            expense.paidByMember?.user.name ?? t("manager.expenses.fund"),
        ],
        [t("manager.expenses.receipt"), (expense) => expense.receiptUrl ?? ""],
        [t("manager.expenses.recordedBy"), (expense) => expense.createdBy.name],
      ]}
    />
  );
}
