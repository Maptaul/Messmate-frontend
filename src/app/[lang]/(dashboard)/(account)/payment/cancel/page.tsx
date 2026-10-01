import { XIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ResultCard } from "@/components/modules/payment-result/payment-result";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { getSessionUser } from "@/lib/session";
import { ROLE_HOME } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("resident.paymentResult.cancelMeta") };
}

/** Back from a gateway without paying: cancelled, or (bKash) failed. */
export default async function page({
  searchParams,
}: PageProps<"/[lang]/payment/cancel">) {
  const [t, locale, user, sp] = await Promise.all([
    getT(),
    getLocale(),
    getSessionUser(),
    searchParams,
  ]);
  const failed = sp.status === "failure";

  return (
    <section className="page-frame">
      <ResultCard
        tone={failed ? "tone-r" : "tone-n"}
        icon={XIcon}
        title={
          failed
            ? t("resident.paymentResult.failedPaymentTitle")
            : t("resident.paymentResult.cancelTitle")
        }
        body={
          failed
            ? t("resident.paymentResult.failedPaymentBody")
            : t("resident.paymentResult.cancelBody")
        }
        actions={
          <>
            <Button
              render={<Link href={localePath(locale, "/dashboard/bills")} />}
              nativeButton={false}
            >
              {t("resident.paymentResult.tryAgain")}
            </Button>
            <Button
              variant="outline"
              render={
                <Link
                  href={localePath(
                    locale,
                    user ? ROLE_HOME[user.role] : "/dashboard",
                  )}
                />
              }
              nativeButton={false}
            >
              {t("resident.paymentResult.goDashboard")}
            </Button>
          </>
        }
      />
    </section>
  );
}
