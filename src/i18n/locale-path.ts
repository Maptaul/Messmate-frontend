import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/** `/manager/bills` → `/manager/bills` (en) or `/bn/manager/bills` (bn). */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** `/bn/manager?x=1` → `{ locale: "bn", path: "/manager" }`. */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
  explicit: boolean;
} {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) {
    return { locale: first, path: `/${rest.join("/")}`, explicit: true };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/", explicit: false };
}
