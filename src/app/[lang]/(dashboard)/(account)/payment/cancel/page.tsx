import { CircleXIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("resident.paymentResult.cancelMeta") };
}

export default async function page() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <section className="p-5">
      <div className="mx-auto w-full max-w-lg rounded-xl border">
        <EmptyState
          icon={CircleXIcon}
          title={t("resident.paymentResult.cancelTitle")}
          description={t("resident.paymentResult.cancelBody")}
          action={
            <Button
              render={<Link href={localePath(locale, "/dashboard/bills")} />}
              nativeButton={false}
            >
              {t("resident.paymentResult.tryAgain")}
            </Button>
          }
        />
      </div>
    </section>
  );
}
