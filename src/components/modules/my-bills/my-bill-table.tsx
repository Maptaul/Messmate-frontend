"use client";

import { BanknoteIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseMyBills } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { BillListParams, MyBill } from "@/types";
import { formatBDT, formatMonth, toNumber } from "@/utils";
import MyBillActions from "./my-bill-actions";

interface Props extends BillListParams {
  handlePageChange: (page: number) => void;
}

export default function MyBillTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMyBills(params);

  const bills = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<MyBill>[] = [
    {
      key: "month",
      header: t("resident.bills.month"),
      cell: (bill) => (
        <div className="min-w-0">
          <p className="font-medium">
            {formatMonth(bill.cycle.year, bill.cycle.month, locale)}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {bill.cycle.mess.name}
          </p>
        </div>
      ),
    },
    {
      key: "payable",
      header: t("resident.bills.payable"),
      className: "hidden tabular-nums md:table-cell",
      cell: (bill) => formatBDT(bill.totalPayable, locale),
    },
    {
      key: "paid",
      header: t("resident.bills.paid"),
      className: "hidden tabular-nums sm:table-cell",
      cell: (bill) => formatBDT(bill.paidAmount, locale),
    },
    {
      key: "due",
      header: t("resident.bills.due"),
      className: "tabular-nums",
      cell: (bill) => {
        const due = toNumber(bill.dueAmount);
        if (due > 0) {
          return <span className="font-medium">{formatBDT(due, locale)}</span>;
        }
        return due < 0
          ? `${t("resident.bills.credit")} ${formatBDT(-due, locale)}`
          : t("resident.bills.settled");
      },
    },
    {
      key: "status",
      header: t("resident.bills.status"),
      className: "hidden sm:table-cell",
      cell: (bill) => <StatusBadge status={bill.status} />,
    },
    {
      key: "pay",
      header: <span className="sr-only">{t("resident.bills.actions")}</span>,
      className: "text-right",
      cell: (bill) =>
        toNumber(bill.dueAmount) > 0 ? (
          <MyBillActions billId={bill.id} />
        ) : null,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={bills}
        rowKey={(bill) => bill.id}
        caption={t("resident.bills.caption")}
        empty={{
          icon: BanknoteIcon,
          title: t("resident.bills.empty"),
          description: t("resident.bills.emptyHint"),
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
