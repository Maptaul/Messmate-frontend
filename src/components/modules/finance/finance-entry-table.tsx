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
  /** A filter is on, so an empty page means "no match". */
  filtered: boolean;
  handlePageChange: (page: number) => void;
}

export default function FinanceEntryTable({
  filtered,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseFinanceEntries(params);

  const entries = data?.data ?? [];

  const columns: Column<FinanceEntry>[] = [
    {
      key: "date",
      header: t("finance.date"),
      className: "font-medium whitespace-nowrap",
      cell: (entry) => formatDate(entry.date, locale),
    },
    {
      key: "type",
      header: t("finance.type"),
      cell: (entry) => <StatusBadge status={entry.type} />,
    },
    {
      key: "category",
      header: t("finance.category"),
      cell: (entry) => t.dynamic(`finance.categories.${entry.category}`),
    },
    {
      key: "note",
      header: t("finance.note"),
      className: "max-w-64 text-muted-foreground",
      cell: (entry) => (
        <span className="line-clamp-2">{entry.note || "—"}</span>
      ),
    },
    {
      key: "amount",
      header: t("finance.amount"),
      className: "text-right font-semibold whitespace-nowrap tabular-nums",
      cell: (entry) => (
        <span
          className={
            entry.type === "INCOME"
              ? "text-(--tone-g-fg)"
              : "text-(--tone-r-fg)"
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
        empty={
          filtered
            ? { icon: WalletIcon, title: t("finance.noMatch") }
            : {
                icon: WalletIcon,
                title: t("finance.empty"),
                description: t("finance.emptyHint"),
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
