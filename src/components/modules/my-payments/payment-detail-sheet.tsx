"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types";
import { formatBDT, formatDateTime, formatMonth } from "@/utils";

export default function PaymentDetailSheet({ payment }: { payment: Payment }) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const { data, isPending } = usePayment(open ? payment.id : "");
  const detail = data?.data ?? payment;
  const amount = formatBDT(detail.amount, locale);
  const gateway = detail.paymentGateway;

  const rows: [string, string, ("mono" | "strong")?][] = [
    [t("resident.payments.rowStatus"), t(`status.${detail.status}`)],
    [t("resident.payments.invoiceNo"), detail.merchantInvoiceNumber, "mono"],
    [
      t("resident.payments.gateway"),
      t(`resident.payments.gatewayFull.${gateway}`),
    ],
    [
      t("resident.payments.txn"),
      detail.bkashTrxId ?? detail.merchantInvoiceNumber,
      "mono",
    ],
    ...(detail.bkashPaymentId
      ? [
          [
            t("resident.payments.bkashPaymentId"),
            detail.bkashPaymentId,
            "mono",
          ] as [string, string, "mono"],
        ]
      : []),
    [
      t("resident.payments.paidAt"),
      detail.paidAt ? formatDateTime(detail.paidAt, locale) : "-",
    ],
    [t("resident.payments.billAfter"), t(`status.${detail.bill.status}`)],
    [
      t("resident.payments.remaining"),
      formatBDT(Math.max(Number(detail.bill.dueAmount), 0), locale),
      "strong",
    ],
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="link"
            size="sm"
            className="h-auto px-0"
            aria-label={t("resident.payments.detailsAria", { amount })}
          />
        }
      >
        {t("resident.payments.details")}
      </SheetTrigger>
      <SheetContent className="w-full gap-4 overflow-y-auto p-6 sm:max-w-115">
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg">
            {amount} · {t(`resident.payments.gateways.${gateway}`)}
          </SheetTitle>
          <SheetDescription>
            {formatMonth(
              detail.bill.cycle.year,
              detail.bill.cycle.month,
              locale,
            )}
          </SheetDescription>
        </SheetHeader>
        {isPending && open ? (
          <Skeleton className="h-72 rounded-xl" />
        ) : (
          <dl className="overflow-hidden rounded-xl border text-[13px]">
            {rows.map(([label, value, kind]) => (
              <div
                key={label}
                className={cn(
                  "flex justify-between gap-3 border-b px-3.5 py-2.5 last:border-0",
                  kind === "strong" && "bg-muted font-semibold",
                )}
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd
                  className={cn(
                    "text-right break-all",
                    kind === "mono" && "font-mono text-xs",
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {detail.status === "PAID" && (
          <p className="text-[13px] text-muted-foreground">
            {t("resident.payments.receiptNote")}
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
