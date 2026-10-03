import type { ListParams, Money } from "./api.type";

export interface Mess {
  id: string;
  name: string;
  address: string;
  monthlyRent: Money;
  monthlyDeposit: Money;
  joinCode: string;
  createdAt: string;
  manager: { id: string; name: string; email: string };
  _count: { members: number; cycles: number };
  /** The open month, if any (lists only carry its id). */
  cycles?: { id: string }[];
}

export interface MessDetail extends Mess {
  cycles: {
    id: string;
    year: number;
    month: number;
    status: "OPEN" | "CLOSED";
    mealRate: Money | null;
    totalMeals: number | null;
    totalGrocery: Money | null;
    closedAt: string | null;
    closedBy: { name: string } | null;
  }[];
}

export interface MessListParams extends ListParams {
  managerId?: string;
}

export interface CreateMessPayload {
  name: string;
  address: string;
  monthlyRent: number;
  monthlyDeposit?: number;
}
