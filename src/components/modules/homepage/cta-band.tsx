import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

/** The dark band that closes the home and about pages. */
export default async function CtaBand() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <section className="bg-brand-panel text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-[26px] font-semibold tracking-tight md:text-[32px]">
          {t("marketing.home.ctaTitle")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className="h-11 bg-white px-5 text-[#064e3b] hover:bg-white/90"
            render={<Link href={localePath(locale, "/register")} />}
            nativeButton={false}
          >
            {t("marketing.home.ctaPrimary")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 border-white/40 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
            render={<Link href={localePath(locale, "/login")} />}
            nativeButton={false}
          >
            {t("marketing.home.ctaSecondary")}
          </Button>
        </div>
      </div>
    </section>
  );
}
