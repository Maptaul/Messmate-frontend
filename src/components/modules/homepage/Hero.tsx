import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

export default async function Hero() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const href = (path: string) => localePath(locale, path);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28">
        <p className="mb-4 text-sm font-medium text-primary">
          {t("marketing.home.eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {t("marketing.home.title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
          {t("marketing.home.body")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            render={<Link href={href("/register")} />}
            nativeButton={false}
          >
            {t("marketing.home.ctaPrimary")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href={href("/login")} />}
            nativeButton={false}
          >
            {t("marketing.home.ctaSecondary")}
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("marketing.home.ctaDemoNote")}
        </p>
      </div>
    </section>
  );
}
