import type { ListParams } from "./api.type";
import type { CycleStatus } from "./cycle.type";
import type { MembershipStatus } from "./user.type";

interface MemberRef {
  id: string;
  user: { id: string; name: string; email: string };
}

/** Meal counts are multiples of 0.5 between 0 and 10. */
export interface MealEntry {
  id: string;
  date: string;
  lunch: number;
  dinner: number;
  member: MemberRef;
}

export interface MealListParams extends ListParams {
  memberId?: string;
  /** YYYY-MM-DD */
  date?: string;
}

export interface MealSummary {
  cycle: { id: string; year: number; month: number; status: CycleStatus };
  totalMeals: number;
  totalGrocery: number;
  runningMealRate: number;
  members: {
    memberId: string;
    name: string;
    email: string;
    status: MembershipStatus;
    lunch: number;
    dinner: number;
    totalMeals: number;
  }[];
}

export interface MealCounts {
  lunch: number;
  dinner: number;
}

export interface AddDailyMealsPayload {
  cycleId: string;
  /** YYYY-MM-DD */
  date: string;
  entries: ({ memberId: string } & MealCounts)[];
}

// --- Meal plan ------------------------------------------------------------

export interface MyCalendarDay extends MealCounts {
  date: string;
  isPlanned: boolean;
  isDefault: boolean;
  isLocked: boolean;
  /** "YYYY-MM-DD HH:mm", Dhaka time */
  deadline: string;
}

export interface MyCalendar {
  cycle: { id: string; year: number; month: number; status: CycleStatus };
  memberId: string;
  defaultMeals: MealCounts;
  plannedMeals: number;
  days: MyCalendarDay[];
}

export interface CycleCalendarDay extends MealCounts {
  date: string;
  deadline: string;
  isLocked: boolean;
  members: ({
    memberId: string;
    name: string;
    isDefault: boolean;
  } & MealCounts)[];
}

export interface CycleCalendar {
  cycle: { id: string; year: number; month: number; status: CycleStatus };
  totalPlannedMeals: number;
  /** Sparse: days nobody eats are left out. */
  days: CycleCalendarDay[];
}

export interface SetMealPlanPayload {
  cycleId: string;
  memberId?: string;
  days: ({ date: string } & MealCounts)[];
}

export interface SetDefaultMealsPayload extends MealCounts {
  messId: string;
  memberId?: string;
}

export interface ApplyPlanResult {
  date: string;
  created: number;
  fromDefaults: number;
  skipped: number;
  message: string;
}
