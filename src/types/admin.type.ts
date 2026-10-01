import type { ListParams, Money } from "./api.type";
import type { UserRole } from "./user.type";

export interface DashboardStats {
  users: {
    total: number;
    admins: number;
    managers: number;
    members: number;
    blocked: number;
  };
  messes: { total: number; activeMemberships: number };
  cycles: { open: number; closed: number };
  money: {
    deposits: Money;
    expenses: Money;
    settledPayments: Money;
    outstandingDue: Money;
  };
  auditLogEntries: number;
}

/** Seven weekly points, oldest first, for the overview sparklines. */
export interface PlatformTrends {
  points: string[];
  users: number[];
  messes: number[];
  openCycles: number[];
  outstandingDue: number[];
}

export const AUDIT_ACTIONS = [
  "CYCLE_CLOSED",
  "CYCLE_REOPENED",
  "PAYMENT_SETTLED",
  "USER_ROLE_CHANGED",
  "USER_BLOCKED",
  "USER_UNBLOCKED",
  "MEMBER_REMOVED",
  "EXPENSE_ADDED",
  "EXPENSE_UPDATED",
  "EXPENSE_DELETED",
  "DEPOSIT_ADDED",
  "DEPOSIT_UPDATED",
  "DEPOSIT_DELETED",
  "MEAL_RECORDED",
  "MEAL_UPDATED",
  "MEAL_DELETED",
  "MANAGER_APPROVED",
  "MANAGER_REJECTED",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_ENTITIES = [
  "BillingCycle",
  "Payment",
  "User",
  "MessMember",
  "Expense",
  "Deposit",
  "MealEntry",
] as const;

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  createdAt: string;
  actor: { id: string; name: string; email: string; role: UserRole };
  subjectMember?: { id: string; user: { name: string } } | null;
}

export interface AuditLogParams extends ListParams {
  action?: AuditAction;
  entity?: string;
  actorId?: string;
}
