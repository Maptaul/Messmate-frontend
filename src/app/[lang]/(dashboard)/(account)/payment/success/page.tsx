import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { confirmStripePayment, getPayment } from "@/api";
import PaymentResult, {
  type PaymentOutcome,
} from "@/components/modules/payment-result/payment-result";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import serverApi from "@/lib/serverApi";
import type { Payment } from "@/types";
import { getErrorMessage } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("resident.paymentResult.successMeta") };
}

/**
 * Where Stripe (?session_id=) and bKash (?status=) send the browser back to.
 * Neither is taken on the URL's word: Stripe's session is confirmed with the
 * API, and a bKash success shows "received" only once the payment it names
 * (`?paymentId=`) reads back as paid. Any other bKash status goes to the
 * cancel page.
 */
export default async function page({
  searchParams,
}: PageProps<"/[lang]/payment/success">) {
  const [locale, client, sp] = await Promise.all([
    getLocale(),
    serverApi(),
    searchParams,
  ]);

  const sessionId = typeof sp.session_id === "string" ? sp.session_id : "";
  const bkashStatus = typeof sp.status === "string" ? sp.status : "";
  const paymentId = typeof sp.paymentId === "string" ? sp.paymentId : "";

  if (bkashStatus && bkashStatus !== "success") {
    redirect(localePath(locale, `/payment/cancel?status=${bkashStatus}`));
  }

  let outcome: PaymentOutcome = "pending";
  let errorKey: string | undefined;
  let payment: Payment | null = null;

  if (sessionId) {
    try {
      const res = await confirmStripePayment(sessionId, client);
      outcome = res.data.paid ? "success" : "failed";
      if (res.data.paid) {
        // The receipt details; the outcome stands even if this read fails.
        payment = await getPayment(res.data.paymentId, client)
          .then((detail) => detail.data)
          .catch(() => null);
      }
    } catch (err) {
      outcome = "error";
      errorKey = getErrorMessage(err);
    }
  } else if (bkashStatus === "success" && paymentId) {
    try {
      payment = (await getPayment(paymentId, client)).data;
      outcome = payment.status === "PAID" ? "success" : "pending";
    } catch (err) {
      outcome = "error";
      errorKey = getErrorMessage(err);
    }
  }

  return (
    <section className="page-frame">
      <PaymentResult outcome={outcome} errorKey={errorKey} payment={payment} />
    </section>
  );
}
