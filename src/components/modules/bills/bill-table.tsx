"use client";

import { ReceiptTextIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseCycleBills } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { BillListParams, CycleBill } from "@/types";
import { formatBDT, toNumber } from "@/utils";
import BillInvoiceDialog from "./bill-invoice-dialog";
import CashPaymentDialog from "./cash-payment-dialog";

interface Props extends BillListParams {
  cycleId: string;
  messName: string;
  /** e.g. "September 2026", already in the page's language. */
  period: string;
  /** YYYY-MM, for the PDF file name. */
  periodKey: string;
  handlePageChange: (page: number) => void;
}

export default function BillTable({
  cycleId,
  messName,
  period,
  periodKey,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycleBills(cycleId, params);

  const bills = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<CycleBill>[] = [
    {
      key: "member",
      header: t("manager.bills.member"),
      cell: (bill) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{bill.member.user.name}</p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {bill.member.user.email}
          </p>
        </div>
      ),
    },
    {
      key: "payable",
      header: t("manager.bills.payable"),
      className: "hidden tabular-nums md:table-cell",
      cell: (bill) => formatBDT(bill.totalPayable, locale),
    },
    {
      key: "paid",
      header: t("manager.bills.paid"),
      className: "hidden tabular-nums sm:table-cell",
      cell: (bill) => formatBDT(bill.paidAmount, locale),
    },
    {
      key: "due",
      header: t("manager.bills.due"),
      className: "tabular-nums",
      cell: (bill) => {
        const due = toNumber(bill.dueAmount);
        if (due > 0) return formatBDT(due, locale);
        return due < 0
          ? `${t("manager.bills.credit")} ${formatBDT(-due, locale)}`
          : t("manager.bills.settled");
      },
    },
    {
      key: "status",
      header: t("manager.bills.status"),
      cell: (bill) => <StatusBadge status={bill.status} />,
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.bills.actions")}</span>,
      className: "text-right",
      cell: (bill) => (
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
          <BillInvoiceDialog
            bill={bill}
            messName={messName}
            memberName={bill.member.user.name}
            period={period}
            fileName={`messmate-bill-${periodKey}-${bill.member.user.name.toLowerCase().replace(/\s+/g, "-")}`}
          />
          {toNumber(bill.dueAmount) > 0 && <CashPaymentDialog bill={bill} />}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={bills}
        rowKey={(bill) => bill.id}
        caption={t("manager.bills.caption")}
        empty={{
          icon: ReceiptTextIcon,
          title: t("manager.bills.empty"),
          description: t("manager.bills.emptyHint"),
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
