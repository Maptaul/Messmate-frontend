import { CircleCheckIcon, CircleXIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

export type PaymentOutcome = "success" | "failed" | "error" | "pending";

/** What the gateway round trip ended in; the page decides, this only shows it. */
export default async function PaymentResult({
  outcome,
  errorKey,
}: {
  outcome: PaymentOutcome;
  errorKey?: string;
}) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  const content = {
    success: {
      icon: CircleCheckIcon,
      title: t("resident.paymentResult.successTitle"),
      description: t("resident.paymentResult.successBody"),
    },
    failed: {
      icon: CircleXIcon,
      title: t("resident.paymentResult.failedTitle"),
      description: t("resident.paymentResult.failedBody"),
    },
    error: {
      icon: CircleXIcon,
      title: t("resident.paymentResult.errorTitle"),
      description: t.dynamic(errorKey ?? "errors.generic"),
    },
    // Opened without a gateway's parameters: don't claim success.
    pending: {
      icon: ClockIcon,
      title: t("resident.paymentResult.pendingTitle"),
      description: t("resident.paymentResult.pendingBody"),
    },
  }[outcome];

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl border">
      <EmptyState
        icon={content.icon}
        title={content.title}
        description={content.description}
        action={
          <div className="flex flex-wrap justify-center gap-2">
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
          </div>
        }
      />
    </div>
  );
}
