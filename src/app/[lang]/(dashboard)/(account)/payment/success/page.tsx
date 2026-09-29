import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { confirmStripePayment } from "@/api";
import PaymentResult, {
  type PaymentOutcome,
} from "@/components/modules/payment-result/payment-result";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import serverApi from "@/lib/serverApi";
import { getErrorMessage } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("resident.paymentResult.successMeta") };
}

/**
 * Where Stripe (?session_id=) and bKash (?status=) send the browser back to.
 * Stripe's result is confirmed with the API — the URL alone never marks
 * anything paid. bKash reports its own outcome; anything but "success" goes
 * to the cancel page.
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

  if (bkashStatus && bkashStatus !== "success") {
    redirect(localePath(locale, "/payment/cancel"));
  }

  let outcome: PaymentOutcome = bkashStatus ? "success" : "pending";
  let errorKey: string | undefined;

  if (sessionId) {
    try {
      const res = await confirmStripePayment(sessionId, client);
      outcome = res.data.paid ? "success" : "failed";
    } catch (err) {
      outcome = "error";
      errorKey = getErrorMessage(err);
    }
  }

  return (
    <section className="p-5">
      <PaymentResult outcome={outcome} errorKey={errorKey} />
    </section>
  );
}
