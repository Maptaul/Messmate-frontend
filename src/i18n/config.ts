export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

/** English has no URL prefix; every other locale lives under /<locale>. */
export const DEFAULT_LOCALE: Locale = "en";

/** Remembers a visitor's choice so an unprefixed link keeps them in Bangla. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const isLocale = (value: string | undefined): value is Locale =>
  LOCALES.includes(value as Locale);

/** The Intl locale behind each UI language (Bangla → Bangla digits). */
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-BD",
  bn: "bn-BD",
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  bn: "বাং",
};
