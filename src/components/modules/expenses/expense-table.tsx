"use client";

import { FileTextIcon, ImageIcon, ShoppingBasketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/ui/data-table";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseCycleExpenses } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Expense, ExpenseListParams } from "@/types";
import { formatBDT, formatDate } from "@/utils";
import ExpenseActions from "./expense-actions";
import ExpenseType from "./expense-type";

interface Props extends ExpenseListParams {
  cycleId: string;
  messId: string;
  canEdit: boolean;
  /** A filter is on, so an empty page means "no match", not "nothing yet". */
  filtered: boolean;
  onClear: () => void;
  handlePageChange: (page: number) => void;
}

export default function ExpenseTable({
  cycleId,
  messId,
  canEdit,
  filtered,
  onClear,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycleExpenses(cycleId, params);

  const expenses = data?.data ?? [];

  const columns: Column<Expense>[] = [
    {
      key: "date",
      header: t("manager.expenses.date"),
      className: "whitespace-nowrap text-muted-foreground",
      cell: (expense) => formatDate(expense.spentAt, locale),
    },
    {
      key: "type",
      header: t("manager.expenses.type"),
      cell: (expense) => <ExpenseType type={expense.type} />,
    },
    {
      key: "description",
      header: t("manager.expenses.description_col"),
      className: "max-w-64",
      cell: (expense) => (
        <span className="line-clamp-2">{expense.description || "-"}</span>
      ),
    },
    {
      key: "amount",
      header: t("manager.expenses.amount"),
      className: "text-right font-semibold whitespace-nowrap tabular-nums",
      cell: (expense) => formatBDT(expense.amount, locale),
    },
    {
      key: "split",
      header: t("manager.expenses.split"),
      className: "whitespace-nowrap text-muted-foreground",
      cell: (expense) => t(`manager.expenses.splits.${expense.splitMethod}`),
    },
    {
      key: "paidBy",
      header: t("manager.expenses.paidBy"),
      className: "whitespace-nowrap",
      cell: (expense) =>
        expense.paidByMember?.user.name ?? t("manager.expenses.fund"),
    },
    {
      key: "receipt",
      header: t("manager.expenses.receipt"),
      cell: (expense) =>
        expense.receiptUrl ? (
          <Button
            variant="outline"
            size="xs"
            render={
              // biome-ignore lint/a11y/useAnchorContent: the button renders the content
              <a
                href={expense.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("manager.expenses.viewReceipt")}
              />
            }
            nativeButton={false}
          >
            {/\.pdf($|\?)/i.test(expense.receiptUrl) ? (
              <>
                <FileTextIcon />
                {t("manager.expenses.receiptPdf")}
              </>
            ) : (
              <>
                <ImageIcon />
                {t("manager.expenses.receiptImage")}
              </>
            )}
          </Button>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "recordedBy",
      header: t("manager.expenses.recordedBy"),
      className: "whitespace-nowrap text-muted-foreground",
      cell: (expense) => expense.createdBy.name.split(" ")[0],
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
        empty={
          filtered
            ? {
                icon: ShoppingBasketIcon,
                title: t("manager.expenses.noMatch"),
                action: (
                  <Button variant="outline" onClick={onClear}>
                    {t("common.clearFilters")}
                  </Button>
                ),
              }
            : {
                icon: ShoppingBasketIcon,
                title: t("manager.expenses.empty"),
                description: t("manager.expenses.emptyHint"),
              }
        }
      />
      <TablePagination
        page={params.page ?? 1}
        totalPages={data?.meta?.totalPages ?? 0}
        total={data?.meta?.total}
        limit={data?.meta?.limit}
        handlePageChange={handlePageChange}
      />
    </>
  );
}
