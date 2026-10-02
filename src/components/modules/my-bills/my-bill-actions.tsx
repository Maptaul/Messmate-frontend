"use client";

import { CreditCardIcon, InfoIcon, SmartphoneIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBkashPayment, useStripeCheckout } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatBDT, getErrorMessage } from "@/utils";

/**
 * Card (Stripe) and bKash both hand back a hosted page; we send the browser
 * there. The amount is the bill's full due, decided by the API — not by us.
 */
export default function MyBillActions({
  billId,
  due,
}: {
  billId: string;
  due: number;
}) {
  const t = useT();
  const locale = useLocale();

  const {
    mutate: stripeCheckout,
    isPending: stripePending,
    isSuccess: stripeStarted,
  } = useStripeCheckout();
  const {
    mutate: bkashPayment,
    isPending: bkashPending,
    isSuccess: bkashStarted,
  } = useBkashPayment();

  const busy = stripePending || bkashPending || stripeStarted || bkashStarted;

  const handleStripe = () => {
    stripeCheckout(billId, {
      onSuccess: (res) => {
        toast.message(t("toast.redirectingStripe"));
        window.location.assign(res.data.checkoutUrl);
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  const handleBkash = () => {
    bkashPayment(billId, {
      onSuccess: (res) => {
        toast.message(t("toast.redirectingBkash"));
        window.location.assign(res.data.paymentUrl);
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" disabled={busy} onClick={handleStripe}>
        {stripePending ? <Spinner /> : <CreditCardIcon />}
        {stripePending
          ? t("resident.bills.payingCard")
          : t("resident.bills.payCardAmount", {
              amount: formatBDT(due, locale),
            })}
      </Button>
      <Button size="lg" variant="outline" disabled={busy} onClick={handleBkash}>
        {bkashPending ? (
          <Spinner />
        ) : (
          <SmartphoneIcon className="text-[#e2136e]" />
        )}
        {bkashPending
          ? t("resident.bills.payingBkash")
          : t("resident.bills.payBkash")}
      </Button>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <InfoIcon className="size-3.5 shrink-0" />
        {t("resident.bills.testCard")}
      </p>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <InfoIcon className="size-3.5 shrink-0" />
        {t("resident.bills.testBkash")}
      </p>
    </div>
  );
}
