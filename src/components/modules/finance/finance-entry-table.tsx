"use client";

import { WalletIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseFinanceEntries } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { FinanceEntry, FinanceEntryParams } from "@/types";
import { formatBDT, formatDate } from "@/utils";
import FinanceEntryActions from "./finance-entry-actions";

interface Props extends FinanceEntryParams {
  handlePageChange: (page: number) => void;
}

export default function FinanceEntryTable({
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseFinanceEntries(params);

  const entries = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<FinanceEntry>[] = [
    {
      key: "date",
      header: t("finance.date"),
      className: "whitespace-nowrap",
      cell: (entry) => formatDate(entry.date, locale),
    },
    {
      key: "category",
      header: t("finance.category"),
      cell: (entry) => (
        <div className="min-w-0">
          <p className="font-medium">
            {t(`finance.categories.${entry.category}`)}
          </p>
          {entry.note && (
            <p className="max-w-56 truncate text-xs text-muted-foreground">
              {entry.note}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: t("finance.type"),
      className: "hidden sm:table-cell",
      cell: (entry) => <StatusBadge status={entry.type} />,
    },
    {
      key: "amount",
      header: t("finance.amount"),
      className: "tabular-nums",
      cell: (entry) => (
        <span
          className={
            entry.type === "INCOME"
              ? "text-emerald-600 dark:text-emerald-400"
              : undefined
          }
        >
          {entry.type === "INCOME" ? "+" : "−"}
          {formatBDT(entry.amount, locale)}
        </span>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("finance.actions")}</span>,
      className: "text-right",
      cell: (entry) => <FinanceEntryActions entry={entry} />,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={entries}
        rowKey={(entry) => entry.id}
        caption={t("finance.caption")}
        empty={{
          icon: WalletIcon,
          title: t("finance.empty"),
          description: t("finance.emptyHint"),
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
