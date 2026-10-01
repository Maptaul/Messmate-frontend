import {
  CheckIcon,
  ClockIcon,
  type LucideIcon,
  MailIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types";
import { formatBDT, formatDateTime, formatMonth } from "@/utils";

export type PaymentOutcome = "success" | "failed" | "error" | "pending";

const LOOK: Record<PaymentOutcome, { tone: string; icon: LucideIcon }> = {
  success: { tone: "tone-g", icon: CheckIcon },
  failed: { tone: "tone-r", icon: XIcon },
  error: { tone: "tone-a", icon: TriangleAlertIcon },
  pending: { tone: "tone-n", icon: ClockIcon },
};

/** The centred card every payment outcome is shown in. */
export function ResultCard({
  tone,
  icon: Icon,
  title,
  body,
  children,
  actions,
}: {
  tone: string;
  icon: LucideIcon;
  title: string;
  body: string;
  children?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="grid min-h-[60svh] place-items-center">
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-7 text-center shadow-2">
        <span
          className={cn(
            "grid size-12 place-items-center rounded-full border",
            tone,
          )}
        >
          <Icon className="size-6" />
        </span>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-pretty text-muted-foreground">{body}</p>
        {children}
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
}

/** What the gateway round trip ended in; the page decides, this only shows it. */
export default async function PaymentResult({
  outcome,
  errorKey,
  payment,
}: {
  outcome: PaymentOutcome;
  errorKey?: string;
  /** The confirmed payment, read back from the API, when there is one. */
  payment?: Payment | null;
}) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  const text = {
    success: {
      title: t("resident.paymentResult.successTitle"),
      body: payment
        ? `${t("resident.paymentResult.successBody")} ${formatBDT(payment.amount, locale)} · ${formatMonth(payment.bill.cycle.year, payment.bill.cycle.month, locale)}`
        : t("resident.paymentResult.successBody"),
    },
    failed: {
      title: t("resident.paymentResult.failedTitle"),
      body: t("resident.paymentResult.failedBody"),
    },
    error: {
      title: t("resident.paymentResult.errorTitle"),
      body: errorKey
        ? t.dynamic(errorKey)
        : t("resident.paymentResult.errorBody"),
    },
    // Opened without a gateway's parameters: don't claim success.
    pending: {
      title: t("resident.paymentResult.pendingTitle"),
      body: t("resident.paymentResult.pendingBody"),
    },
  }[outcome];

  const rows: [string, string, boolean?][] = payment
    ? [
        [
          t("resident.paymentResult.method"),
          t(`resident.payments.gatewayFull.${payment.paymentGateway}`),
        ],
        [
          t("resident.paymentResult.reference"),
          payment.bkashTrxId ?? payment.id,
          true,
        ],
        [
          t("resident.paymentResult.invoice"),
          payment.merchantInvoiceNumber.slice(0, 13),
          true,
        ],
        [
          t("resident.paymentResult.paidAt"),
          payment.paidAt ? formatDateTime(payment.paidAt, locale) : "—",
        ],
        [
          t("resident.paymentResult.billStatus"),
          t(`status.${payment.bill.status}`),
        ],
      ]
    : [];

  return (
    <ResultCard
      {...LOOK[outcome]}
      title={text.title}
      body={text.body}
      actions={
        <>
          <Button
            render={<Link href={localePath(locale, "/dashboard/bills")} />}
            nativeButton={false}
          >
            {t("resident.paymentResult.viewBills")}
          </Button>
          <Button
            variant="outline"
            render={<Link href={localePath(locale, "/dashboard/payments")} />}
            nativeButton={false}
          >
            {t("resident.paymentResult.viewPayments")}
          </Button>
        </>
      }
    >
      {outcome === "success" && rows.length > 0 && (
        <>
          <dl className="mt-2 w-full overflow-hidden rounded-xl border text-left text-[13px]">
            {rows.map(([label, value, mono]) => (
              <div
                key={label}
                className="flex justify-between gap-3 border-b px-3.5 py-2 last:border-0"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd
                  className={cn(
                    "truncate font-medium",
                    mono && "font-mono text-xs",
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MailIcon className="size-3.5" />
            {t("resident.paymentResult.receiptOnWay")}
          </p>
        </>
      )}
    </ResultCard>
  );
}
