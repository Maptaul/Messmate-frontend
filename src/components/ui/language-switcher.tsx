"use client";

import { Button } from "@/components/ui/button";
import { LOCALE_LABEL, LOCALES, type Locale } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { splitLocale } from "@/i18n/locale-path";
import { cn } from "@/lib/utils";

const LANGUAGE_NAME: Record<Locale, string> = { en: "English", bn: "বাংলা" };

/**
 * "EN · বাং". Always links to the prefixed URL (`/en/...` or `/bn/...`); the
 * proxy stores the choice in a cookie and drops the `/en` prefix again.
 */
export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const current = useLocale();
  const t = useT();

  const switchTo = (locale: Locale) => {
    const { pathname, search, hash } = window.location;
    const { path } = splitLocale(pathname);
    const target = `/${locale}${path === "/" ? "" : path}${search}${hash}`;
    // A full load: the <html lang>, fonts and dictionary all change.
    window.location.assign(target);
  };

  return (
    <fieldset
      aria-label={t("common.language")}
      className={cn("flex items-center rounded-lg border p-0.5", className)}
    >
      {LOCALES.map((locale) => (
        <Button
          key={locale}
          type="button"
          size="xs"
          variant={locale === current ? "secondary" : "ghost"}
          aria-pressed={locale === current}
          aria-label={t("common.switchLanguage", {
            language: LANGUAGE_NAME[locale],
          })}
          lang={locale}
          onClick={() => locale !== current && switchTo(locale)}
          className="min-w-9"
        >
          {LOCALE_LABEL[locale]}
        </Button>
      ))}
    </fieldset>
  );
}
