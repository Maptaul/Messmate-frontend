"use client";

import { WalletIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseMyPayments } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Payment, PaymentListParams } from "@/types";
import { formatBDT, formatDateTime, formatMonth } from "@/utils";

interface Props extends PaymentListParams {
  handlePageChange: (page: number) => void;
}

export default function MyPaymentTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMyPayments(params);

  const payments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<Payment>[] = [
    {
      key: "date",
      header: t("resident.payments.date"),
      className: "hidden whitespace-nowrap sm:table-cell",
      cell: (payment) =>
        formatDateTime(payment.paidAt ?? payment.createdAt, locale),
    },
    {
      key: "month",
      header: t("resident.payments.month"),
      cell: (payment) => (
        <div>
          <p>
            {formatMonth(
              payment.bill.cycle.year,
              payment.bill.cycle.month,
              locale,
            )}
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            {formatDateTime(payment.paidAt ?? payment.createdAt, locale)}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: t("resident.payments.amount"),
      className: "tabular-nums",
      cell: (payment) => formatBDT(payment.amount, locale),
    },
    {
      key: "method",
      header: t("resident.payments.method"),
      className: "hidden sm:table-cell",
      cell: (payment) =>
        t(`resident.payments.gateways.${payment.paymentGateway}`),
    },
    {
      key: "status",
      header: t("resident.payments.status"),
      cell: (payment) => <StatusBadge status={payment.status} />,
    },
    {
      key: "invoice",
      header: t("resident.payments.invoice"),
      className: "hidden font-mono text-xs lg:table-cell",
      cell: (payment) => payment.merchantInvoiceNumber,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={payments}
        rowKey={(payment) => payment.id}
        caption={t("resident.payments.caption")}
        empty={{
          icon: WalletIcon,
          title: t("resident.payments.empty"),
          description: t("resident.payments.emptyHint"),
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
