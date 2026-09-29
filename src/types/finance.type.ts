import type { ListParams, Money } from "./api.type";

export type FinanceType = "INCOME" | "EXPENSE";

export const INCOME_CATEGORIES = [
  "SALARY",
  "TUITION",
  "FAMILY",
  "BUSINESS",
  "OTHER",
] as const;

export const EXPENSE_CATEGORIES = [
  "FOOD",
  "MESS",
  "TRANSPORT",
  "EDUCATION",
  "MOBILE_INTERNET",
  "HEALTH",
  "SHOPPING",
  "ENTERTAINMENT",
  "OTHER",
] as const;

export type FinanceCategory =
  | (typeof INCOME_CATEGORIES)[number]
  | (typeof EXPENSE_CATEGORIES)[number];

export type SummaryPeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface FinanceEntry {
  id: string;
  type: FinanceType;
  category: FinanceCategory;
  amount: Money;
  date: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceEntryParams extends ListParams {
  type?: FinanceType;
  category?: FinanceCategory;
  /** YYYY-MM-DD */
  from?: string;
  to?: string;
}

export interface FinanceSummary {
  period: SummaryPeriod;
  from: string;
  to: string;
  income: number;
  expense: number;
  balance: number;
  byCategory: {
    income: { category: FinanceCategory; total: number }[];
    expense: { category: FinanceCategory; total: number }[];
  };
  /** Gap-free buckets: 7 days for a week, each day of a month, 12 months. */
  breakdown: {
    label: string;
    from: string;
    to: string;
    income: number;
    expense: number;
    balance: number;
  }[];
}

export interface FinanceEntryPayload {
  type: FinanceType;
  category: FinanceCategory;
  amount: number;
  /** YYYY-MM-DD, never in the future */
  date?: string;
  note?: string;
}
