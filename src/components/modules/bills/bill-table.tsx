"use client";

import { ReceiptTextIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import UserAvatar from "@/components/ui/user-avatar";
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
  /** A search or status is on, so an empty page means "no match". */
  filtered: boolean;
  handlePageChange: (page: number) => void;
}

export default function BillTable({
  cycleId,
  messName,
  period,
  periodKey,
  filtered,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycleBills(cycleId, params);

  const bills = data?.data ?? [];
  const fileName = (bill: CycleBill) =>
    `messmate-bill-${periodKey}-${bill.member.user.name.toLowerCase().replace(/\s+/g, "-")}`;

  const columns: Column<CycleBill>[] = [
    {
      key: "member",
      header: t("manager.bills.member"),
      cell: (bill) => (
        <span className="flex items-center gap-2">
          <UserAvatar name={bill.member.user.name} className="size-7" />
          <span className="truncate font-medium">{bill.member.user.name}</span>
        </span>
      ),
    },
    {
      key: "payable",
      header: t("manager.bills.payable"),
      className: "text-right tabular-nums",
      cell: (bill) => formatBDT(bill.totalPayable, locale),
    },
    {
      key: "credit",
      header: t("manager.bills.credit"),
      className: "text-right text-(--tone-g-fg) tabular-nums",
      cell: (bill) => `−${formatBDT(bill.creditAmount, locale)}`,
    },
    {
      key: "paid",
      header: t("manager.bills.paid"),
      className: "text-right tabular-nums",
      cell: (bill) => formatBDT(bill.paidAmount, locale),
    },
    {
      key: "due",
      header: t("manager.bills.due"),
      className: "text-right font-bold whitespace-nowrap tabular-nums",
      cell: (bill) => {
        const due = toNumber(bill.dueAmount);
        if (due > 0) return formatBDT(due, locale);
        return (
          <span className="text-(--tone-g-fg)">
            {due < 0
              ? t("manager.bills.inCredit", { amount: formatBDT(-due, locale) })
              : formatBDT(0, locale)}
          </span>
        );
      },
    },
    {
      key: "status",
      header: t("manager.bills.status"),
      cell: (bill) => {
        const due = toNumber(bill.dueAmount);
        if (due < 0) {
          return (
            <StatusBadge
              status="CREDIT"
              label={`${t("status.CREDIT")} ${formatBDT(-due, locale)}`}
            />
          );
        }
        return <StatusBadge status={due === 0 ? "SETTLED" : bill.status} />;
      },
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.bills.actions")}</span>,
      className: "text-right",
      cell: (bill) => (
        <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
          {toNumber(bill.dueAmount) > 0 && <CashPaymentDialog bill={bill} />}
          <BillInvoiceDialog
            bill={bill}
            messName={messName}
            memberName={bill.member.user.name}
            period={period}
            fileName={fileName(bill)}
          />
          <BillInvoiceDialog
            variant="breakdown"
            bill={bill}
            messName={messName}
            memberName={bill.member.user.name}
            period={period}
            fileName={fileName(bill)}
          />
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
        empty={
          filtered
            ? { icon: ReceiptTextIcon, title: t("manager.bills.noMatch") }
            : {
                icon: ReceiptTextIcon,
                title: t("manager.bills.empty"),
                description: t("manager.bills.emptyHint"),
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
