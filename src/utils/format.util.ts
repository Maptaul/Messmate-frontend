import { INTL_LOCALE, type Locale } from "@/i18n/config";
import type { Money } from "@/types";

const DHAKA = "Asia/Dhaka";

/** Decimals arrive as strings ("1250.50"); never do maths on them raw. */
export const toNumber = (value: Money | null | undefined): number =>
  value === null || value === undefined ? 0 : Number(value);

// Bangla gets Bangla digits and month names from the bn-BD locale.
export const formatBDT = (
  value: Money | null | undefined,
  locale: Locale = "en",
) =>
  new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2,
  }).format(toNumber(value));

export const formatNumber = (
  value: Money | null | undefined,
  locale: Locale = "en",
) =>
  new Intl.NumberFormat(INTL_LOCALE[locale], {
    maximumFractionDigits: 2,
  }).format(toNumber(value));

export const formatDate = (value: string | Date, locale: Locale = "en") =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    timeZone: DHAKA,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const formatDateTime = (value: string | Date, locale: Locale = "en") =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    timeZone: DHAKA,
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export const formatMonth = (
  year: number,
  month: number,
  locale: Locale = "en",
) =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));

/** The API's deadlines are "YYYY-MM-DD HH:mm" in Dhaka time (UTC+6, no DST). */
export const formatDeadline = (deadline: string, locale: Locale = "en") =>
  formatDateTime(`${deadline.replace(" ", "T")}:00+06:00`, locale);

/** Just the month name ("September" / "সেপ্টেম্বর"), for pickers. */
export const formatMonthName = (month: number, locale: Locale = "en") =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, month - 1, 1)));

/** Today's date in Dhaka as YYYY-MM-DD — the format every API date takes. */
export const todayInDhaka = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: DHAKA }).format(new Date());

/** "MESS_MANAGER" → "Mess manager" (fallback when a value has no translation). */
export const humanize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");
