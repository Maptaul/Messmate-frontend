"use client";

import {
  BanknoteIcon,
  CopyIcon,
  CreditCardIcon,
  type LucideIcon,
  SmartphoneIcon,
  WalletIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseMyPayments } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Payment, PaymentGateway, PaymentListParams } from "@/types";
import { formatBDT, formatDate, formatMonth, formatTime } from "@/utils";
import PaymentDetailSheet from "./payment-detail-sheet";

const METHOD_ICON: Record<PaymentGateway, LucideIcon> = {
  stripe: CreditCardIcon,
  bkash: SmartphoneIcon,
  cash: BanknoteIcon,
};

interface Props extends PaymentListParams {
  handlePageChange: (page: number) => void;
}

export default function MyPaymentTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMyPayments(params);

  const payments = data?.data ?? [];
  const txn = (payment: Payment) =>
    payment.bkashTrxId ?? payment.merchantInvoiceNumber;

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("resident.payments.copied"));
    } catch {
      toast.error(value);
    }
  };

  const columns: Column<Payment>[] = [
    {
      key: "month",
      header: t("resident.payments.month"),
      className: "font-medium",
      cell: (payment) =>
        formatMonth(payment.bill.cycle.year, payment.bill.cycle.month, locale),
    },
    {
      key: "date",
      header: t("resident.payments.date"),
      className: "whitespace-nowrap text-muted-foreground",
      cell: (payment) => formatDate(payment.createdAt, locale),
    },
    {
      key: "method",
      header: t("resident.payments.method"),
      cell: (payment) => {
        const Icon = METHOD_ICON[payment.paymentGateway];
        return (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Icon className="size-4 text-muted-foreground" />
            {t(`resident.payments.gateways.${payment.paymentGateway}`)}
          </span>
        );
      },
    },
    {
      key: "amount",
      header: t("resident.payments.amount"),
      className: "text-right font-semibold whitespace-nowrap tabular-nums",
      cell: (payment) => formatBDT(payment.amount, locale),
    },
    {
      key: "status",
      header: t("resident.payments.status"),
      cell: (payment) => <StatusBadge status={payment.status} />,
    },
    {
      key: "txn",
      header: t("resident.payments.txn"),
      cell: (payment) => (
        <span className="inline-flex items-center gap-1">
          <span className="max-w-40 truncate font-mono text-xs">
            {txn(payment)}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={t("resident.payments.copy")}
            onClick={() => copy(txn(payment))}
          >
            <CopyIcon />
          </Button>
        </span>
      ),
    },
    {
      key: "paidAt",
      header: t("resident.payments.paidAt"),
      className: "font-mono text-xs whitespace-nowrap text-muted-foreground",
      cell: (payment) =>
        payment.paidAt ? formatTime(payment.paidAt, locale) : "—",
    },
    {
      key: "details",
      header: <span className="sr-only">{t("resident.payments.details")}</span>,
      className: "text-right",
      cell: (payment) => <PaymentDetailSheet payment={payment} />,
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
          title: params.status
            ? t("resident.payments.noMatch")
            : t("resident.payments.empty"),
          description: params.status
            ? undefined
            : t("resident.payments.emptyHint"),
        }}
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
