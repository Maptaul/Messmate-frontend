import type { ListParams, Money } from "./api.type";

export interface Mess {
  id: string;
  name: string;
  address: string;
  monthlyRent: Money;
  monthlyDeposit: Money;
  createdAt: string;
  manager: { id: string; name: string; email: string };
  _count: { members: number; cycles: number };
}

export interface MessDetail extends Mess {
  cycles: {
    id: string;
    year: number;
    month: number;
    status: "OPEN" | "CLOSED";
    mealRate: Money | null;
    totalMeals: number | null;
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
