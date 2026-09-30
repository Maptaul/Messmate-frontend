import type { ListParams, Money } from "./api.type";

export type CycleStatus = "OPEN" | "CLOSED";

export interface Cycle {
  id: string;
  year: number;
  month: number;
  status: CycleStatus;
  totalMeals: number | null;
  totalGrocery: Money | null;
  mealRate: Money | null;
  closedAt: string | null;
  createdAt: string;
  mess: { id: string; name: string; monthlyRent: Money };
  closedBy: { id: string; name: string } | null;
}

export interface CycleDetail extends Cycle {
  _count: { meals: number; expenses: number; deposits: number; bills: number };
  summary: {
    totalMeals: number;
    totalGrocery: number;
    runningMealRate: number;
    expenseByType: { type: string; total: number }[];
  };
}

export interface CycleListParams extends ListParams {
  status?: CycleStatus;
  year?: number;
}

export interface OpenCyclePayload {
  messId: string;
  year: number;
  month: number;
}

/** One member's line of the settlement — every amount is a number here. */
export interface SettlementBill {
  memberId: string;
  name?: string;
  openingBalance: number;
  mealCount: number;
  mealCost: number;
  sharedCost: number;
  sharedBreakdown: { type: string; amount: number }[];
  rentShare: number;
  advanceCharged: number;
  totalPayable: number;
  depositTotal: number;
  paidExpenseTotal: number;
  creditAmount: number;
  dueAmount: number;
}

export interface SettlementPreview {
  cycle: { id: string; year: number; month: number; status: CycleStatus };
  isPreview: true;
  asOf: string;
  totalMeals: number;
  totalGrocery: number;
  mealRate: number;
  bills: SettlementBill[];
  warnings: string[];
}

export interface CloseCycleResult {
  cycle: Cycle;
  bills: SettlementBill[];
  warnings: string[];
}

/** One value per day of the month so far (not running totals). */
export interface CycleTrends {
  cycle: { id: string; year: number; month: number };
  previousCycle: { id: string; year: number; month: number } | null;
  days: string[];
  meals: number[];
  grocery: number[];
  shared: number[];
  /** The caller's own meals; null when they don't eat in the mess. */
  myMeals: number[] | null;
  /** What the previous closed month still owed at each day's close. */
  previousDue: number[] | null;
}
