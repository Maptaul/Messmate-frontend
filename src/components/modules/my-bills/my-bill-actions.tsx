"use client";

import { CreditCardIcon, SmartphoneIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBkashPayment, useStripeCheckout } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { getErrorMessage } from "@/utils";

/**
 * Card (Stripe) and bKash both hand back a hosted page; we send the browser
 * there. The amount is the bill's full due, decided by the API — not by us.
 */
export default function MyBillActions({ billId }: { billId: string }) {
  const t = useT();

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
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
      <Button size="sm" disabled={busy} onClick={handleStripe}>
        {stripePending ? <Spinner /> : <CreditCardIcon />}
        {stripePending
          ? t("resident.bills.payingCard")
          : t("resident.bills.payCard")}
      </Button>
      <Button size="sm" variant="outline" disabled={busy} onClick={handleBkash}>
        {bkashPending ? <Spinner /> : <SmartphoneIcon />}
        {bkashPending
          ? t("resident.bills.payingBkash")
          : t("resident.bills.payBkash")}
      </Button>
    </div>
  );
}
