import type { ListParams, Money } from "./api.type";
import type { CycleStatus } from "./cycle.type";

export const EXPENSE_TYPES = [
  "GROCERY",
  "GAS",
  "ELECTRICITY",
  "WATER",
  "INTERNET",
  "MAID",
  "RENT",
  "OTHER",
] as const;
export type ExpenseType = (typeof EXPENSE_TYPES)[number];

export const SPLIT_METHODS = ["EQUAL", "BY_MEAL"] as const;
export type SplitMethod = (typeof SPLIT_METHODS)[number];

export interface Expense {
  id: string;
  type: ExpenseType;
  amount: Money;
  splitMethod: SplitMethod;
  description: string | null;
  spentAt: string;
  receiptUrl: string | null;
  createdAt: string;
  /** null = paid from the mess fund */
  paidByMember: { id: string; user: { id: string; name: string } } | null;
  createdBy: { id: string; name: string };
}

export interface ExpenseListParams extends ListParams {
  type?: ExpenseType;
  paidByMemberId?: string;
}

export interface ExpenseSummary {
  cycle: { id: string; year: number; month: number; status: CycleStatus };
  grandTotal: number;
  grocery: number;
  rent: number;
  sharedTotal: number;
  totalMeals: number;
  runningMealRate: number;
  byType: { type: ExpenseType; total: number; count: number }[];
  paidByMembers: { memberId: string; name: string; total: number }[];
}

export interface ExpenseFields {
  type: ExpenseType;
  amount: number;
  splitMethod?: SplitMethod;
  paidByMemberId?: string;
  description?: string;
  /** YYYY-MM-DD */
  spentAt: string;
}

export interface AddExpensePayload extends ExpenseFields {
  cycleId: string;
  receipt?: File;
}

export type UpdateExpensePayload = Partial<ExpenseFields> & {
  expenseId: string;
  receipt?: File;
};
