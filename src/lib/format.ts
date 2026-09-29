import type { Money } from "@/types";

const DHAKA = "Asia/Dhaka";

const bdt = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 2,
});

const plain = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 });

/** Decimals arrive as strings ("1250.50"); never do maths on them raw. */
export const toNumber = (value: Money | null | undefined): number =>
  value === null || value === undefined ? 0 : Number(value);

export const formatBDT = (value: Money | null | undefined) =>
  bdt.format(toNumber(value));

export const formatNumber = (value: Money | null | undefined) =>
  plain.format(toNumber(value));

export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const formatDateTime = (value: string | Date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA,
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export const formatMonth = (year: number, month: number) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );

/** Today's date in Dhaka as YYYY-MM-DD — the format every API date takes. */
export const todayInDhaka = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: DHAKA }).format(new Date());

/** "MESS_MANAGER" → "Mess manager" */
export const humanize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " ");
