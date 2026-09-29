"use client";

import { ExternalLinkIcon, ReceiptTextIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseCycleExpenses } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Expense, ExpenseListParams } from "@/types";
import { formatBDT, formatDate } from "@/utils";
import ExpenseActions from "./expense-actions";

interface Props extends ExpenseListParams {
  cycleId: string;
  messId: string;
  canEdit: boolean;
  handlePageChange: (page: number) => void;
}

export default function ExpenseTable({
  cycleId,
  messId,
  canEdit,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycleExpenses(cycleId, params);

  const expenses = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<Expense>[] = [
    {
      key: "date",
      header: t("manager.expenses.date"),
      className: "whitespace-nowrap",
      cell: (expense) => formatDate(expense.spentAt, locale),
    },
    {
      key: "type",
      header: t("manager.expenses.type"),
      cell: (expense) => (
        <div className="min-w-0">
          <StatusBadge
            status={expense.type}
            label={t(`expenseTypes.${expense.type}`)}
          />
          {expense.description && (
            <p className="mt-1 max-w-56 truncate text-xs text-muted-foreground">
              {expense.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "paidBy",
      header: t("manager.expenses.paidBy"),
      className: "hidden md:table-cell",
      cell: (expense) =>
        expense.paidByMember?.user.name ?? t("manager.expenses.fund"),
    },
    {
      key: "split",
      header: t("manager.expenses.split"),
      className: "hidden lg:table-cell",
      cell: (expense) => t(`manager.expenses.splits.${expense.splitMethod}`),
    },
    {
      key: "amount",
      header: t("manager.expenses.amount"),
      className: "tabular-nums",
      cell: (expense) => formatBDT(expense.amount, locale),
    },
    {
      key: "receipt",
      header: t("manager.expenses.receipt"),
      className: "hidden sm:table-cell",
      cell: (expense) =>
        expense.receiptUrl ? (
          <a
            href={expense.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
          >
            <ExternalLinkIcon className="size-3.5" aria-hidden />
            {t("manager.expenses.viewReceipt")}
          </a>
        ) : (
          "—"
        ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.expenses.actions")}</span>,
      className: "text-right",
      cell: (expense) =>
        canEdit ? (
          <ExpenseActions expense={expense} cycleId={cycleId} messId={messId} />
        ) : null,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={expenses}
        rowKey={(expense) => expense.id}
        caption={t("manager.expenses.caption")}
        empty={{
          icon: ReceiptTextIcon,
          title: t("manager.expenses.empty"),
          description: t("manager.expenses.emptyHint"),
        }}
      />
      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
