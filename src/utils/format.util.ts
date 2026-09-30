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

/** 2026 → "2026" / "২০২৬" — a year, without a thousands separator. */
export const formatYear = (year: number, locale: Locale = "en") =>
  new Intl.NumberFormat(INTL_LOCALE[locale], { useGrouping: false }).format(
    year,
  );

export const formatDate = (value: string | Date, locale: Locale = "en") =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    timeZone: DHAKA,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

/** "Tuesday, Sep 15, 2026" — a day heading. */
export const formatLongDate = (value: string | Date, locale: Locale = "en") =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    timeZone: DHAKA,
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

/** Sun…Sat, short — a month grid's header. 6 Sep 2026 is a Sunday. */
export const weekdayNames = (locale: Locale = "en") =>
  Array.from({ length: 7 }, (_, day) =>
    new Intl.DateTimeFormat(INTL_LOCALE[locale], {
      timeZone: "UTC",
      weekday: "short",
    }).format(new Date(Date.UTC(2026, 8, 6 + day))),
  );

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

/** A Dhaka date some days from today, as YYYY-MM-DD (1 = tomorrow). */
export const dayInDhaka = (offsetDays = 0) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: DHAKA }).format(
    new Date(Date.now() + offsetDays * 86_400_000),
  );

/** "Sep 2026" / "সেপ্টেম্বর ২০২৬" — the header's cycle pill. */
export const formatShortMonth = (
  year: number,
  month: number,
  locale: Locale = "en",
) =>
  new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));

/** "1h ago", "12d ago" — newest-first feeds. */
export const formatRelative = (value: string | Date, locale: Locale = "en") => {
  const seconds = (new Date(value).getTime() - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat(INTL_LOCALE[locale], {
    style: "narrow",
    numeric: "auto",
  });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) {
      return format.format(Math.round(seconds / size), unit);
    }
  }
  return format.format(0, "minute");
};

export const PLAN_CUTOFF_HOUR = 23;

/**
 * Minutes until tomorrow's meal plan locks at 11 PM Dhaka time; zero or less
 * once it has locked (until midnight starts a new day).
 */
export const minutesToPlanCutoff = (now: Date = new Date()) => {
  const [hour, minute] = new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(now)
    .split(":")
    .map(Number);
  return PLAN_CUTOFF_HOUR * 60 - (hour * 60 + minute);
};

/** "MESS_MANAGER" → "Mess manager" (fallback when a value has no translation). */
export const humanize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");
