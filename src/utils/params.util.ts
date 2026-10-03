import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  type AuditAction,
  type AuditLogParams,
  type BillListParams,
  type BillStatus,
  type CycleListParams,
  type CycleStatus,
  type DepositListParams,
  EXPENSE_CATEGORIES,
  EXPENSE_TYPES,
  type ExpenseListParams,
  type ExpenseType,
  type FinanceEntryParams,
  INCOME_CATEGORIES,
  MANAGER_REQUEST_STATUSES,
  type ManagerRequestParams,
  type MealListParams,
  type MemberListParams,
  type MembershipStatus,
  type MessAuditParams,
  type MessListParams,
  type PaymentListParams,
  type PaymentStatus,
  type SummaryPeriod,
  type UserListParams,
  type UserRole,
  type UserStatus,
} from "@/types";

export const PAGE_SIZE = 10;

type Get = (key: string) => string | undefined;

const ROLES: readonly UserRole[] = ["ADMIN", "MESS_MANAGER", "MEMBER"];
const STATUSES: readonly UserStatus[] = ["ACTIVE", "BLOCKED"];

const oneOf = <T extends string>(
  options: readonly T[],
  value: string | undefined,
): T | undefined => options.find((option) => option === value);

const pageOf = (get: Get) => {
  const page = Number(get("page"));
  return Number.isInteger(page) && page > 1 ? page : 1;
};

/**
 * The server page (searchParams) and the client table (useSearchParams) both
 * build their query from the URL through these, so a bookmarked link and a
 * click in the UI land on the same TanStack Query key.
 */
export function usersParams(get: Get): UserListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    searchTerm: get("searchTerm") || undefined,
    role: oneOf(ROLES, get("role")),
    status: oneOf(STATUSES, get("status")),
  };
}

export const MANAGER_REQUEST_TABS = [
  ...MANAGER_REQUEST_STATUSES,
  "ALL",
] as const;

export type ManagerRequestTab = (typeof MANAGER_REQUEST_TABS)[number];

/** The tab is the status filter: none means the pending queue, ALL means every request. */
export const managerRequestTab = (get: Get): ManagerRequestTab =>
  oneOf(MANAGER_REQUEST_TABS, get("status")) ?? "PENDING";

export function managerRequestsParams(get: Get): ManagerRequestParams {
  const tab = managerRequestTab(get);
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    searchTerm: get("searchTerm") || undefined,
    status: tab === "ALL" ? undefined : tab,
  };
}

/** The sidebar badge: how many requests wait for an admin. */
export const PENDING_REQUESTS_PARAMS: ManagerRequestParams = {
  status: "PENDING",
  limit: 1,
};

export function messesParams(get: Get): MessListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    searchTerm: get("searchTerm") || undefined,
    managerId: get("managerId") || undefined,
  };
}

export function auditParams(get: Get): AuditLogParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    action: oneOf<AuditAction>(AUDIT_ACTIONS, get("action")),
    entity: oneOf(AUDIT_ENTITIES, get("entity")),
    sortOrder: get("sortOrder") === "asc" ? "asc" : undefined,
  };
}

/** Adapts Next's `searchParams` object to the `get` the builders take. */
export const fromSearchParams =
  (searchParams: Record<string, string | string[] | undefined>): Get =>
  (key) => {
    const value = searchParams[key];
    return typeof value === "string" ? value : undefined;
  };

/** The overview card and its server prefetch share this key, so it renders with data at once. */
export const RECENT_ACTIVITY_PARAMS = { page: 1, limit: 5 };

const MEMBERSHIP_STATUSES: readonly MembershipStatus[] = ["ACTIVE", "LEFT"];
const CYCLE_STATUSES: readonly CycleStatus[] = ["OPEN", "CLOSED"];

/** Active members unless the URL asks for left ones or everyone ("ALL"). */
export function membersParams(get: Get): MemberListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    searchTerm: get("searchTerm") || undefined,
    status:
      get("status") === "ALL"
        ? undefined
        : (oneOf(MEMBERSHIP_STATUSES, get("status")) ?? "ACTIVE"),
  };
}

export function cyclesParams(get: Get): CycleListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    status: oneOf(CYCLE_STATUSES, get("status")),
    year: Number(get("year")) || undefined,
  };
}

export const MY_MESSES_PARAMS = { page: 1, limit: 50 };

/** The mess's one open month — the overview and its server prefetch share this key. */
export const OPEN_CYCLE_PARAMS = { status: "OPEN" as const, limit: 1 };

const BILL_STATUSES: readonly BillStatus[] = ["UNPAID", "PARTIAL", "PAID"];

export function expensesParams(get: Get): ExpenseListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    type: oneOf<ExpenseType>(EXPENSE_TYPES, get("type")),
    paidByMemberId: get("paidBy") || undefined,
    searchTerm: get("searchTerm") || undefined,
  };
}

/** The read-only ledger's sections; the first is the default. */
export const LEDGER_TABS = [
  "meals",
  "expenses",
  "deposits",
  "duty",
  "members",
  "cycles",
  "summary",
] as const;
export type LedgerTab = (typeof LEDGER_TABS)[number];

export function ledgerTab(get: Get): LedgerTab {
  return oneOf(LEDGER_TABS, get("tab")) ?? "meals";
}

/** Every meal entry of the month, a page at a time (the ledger's meals tab). */
export function ledgerMealsParams(get: Get): MealListParams {
  return { page: pageOf(get), limit: PAGE_SIZE };
}

export function depositsParams(get: Get): DepositListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    memberId: get("memberId") || undefined,
  };
}

export function billsParams(get: Get): BillListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    status: oneOf(BILL_STATUSES, get("status")),
    searchTerm: get("searchTerm") || undefined,
  };
}

/** Every active member, for pickers (deposit, expense payer, register). */
/** Everyone who ever lived in the mess, left ones included. */
export const ALL_MEMBERS_PARAMS = { page: 1, limit: 100 };

/** Every bill of a closed month, for its totals (a mess has ~10 members). */
export const ALL_BILLS_PARAMS = { page: 1, limit: 100 };

/** Every deposit of a month, for its totals. */
// One page of 100; a mess of ~10 members deposits far fewer.
export const ALL_DEPOSITS_PARAMS = { page: 1, limit: 100 };

/** The latest changes in one mess (admin mess detail). */
export const MESS_ACTIVITY_PARAMS = { page: 1, limit: 20 };

export const ACTIVE_MEMBERS_PARAMS = {
  status: "ACTIVE" as const,
  limit: 100,
};

const YMD = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The day the meal register shows: the `date` in the URL if it falls inside
 * the month, otherwise today (when today is in the month), otherwise the 1st.
 */
export function registerDate(
  requested: string | undefined,
  year: number,
  month: number,
  today: string,
): string {
  const prefix = `${year}-${String(month).padStart(2, "0")}-`;
  if (requested && YMD.test(requested) && requested.startsWith(prefix)) {
    const day = Number(requested.slice(8));
    const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
    if (day >= 1 && day <= last) return requested;
  }
  return today.startsWith(prefix) ? today : `${prefix}01`;
}

export const MEAL_PAGE_PARAMS = { limit: 100 };

const PAYMENT_STATUSES: readonly PaymentStatus[] = [
  "UNPAID",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
];

export function paymentsParams(get: Get): PaymentListParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    status: oneOf(PAYMENT_STATUSES, get("status")),
  };
}

/** The newest bill only — what the Today page shows. */
export const LATEST_BILL_PARAMS = { page: 1, limit: 1 };

export const FINANCE_PERIODS = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;

/** The finance page's summary window; a month unless the URL says otherwise. */
export const financePeriod = (get: Get): SummaryPeriod =>
  oneOf(FINANCE_PERIODS, get("period")) ?? "monthly";

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const isoDay = (value: string | undefined) =>
  value && ISO_DAY.test(value) ? value : undefined;

/** The summary's window: a period, anchored on `date` (default today). */
export function financeSummaryParams(get: Get) {
  return { period: financePeriod(get), date: isoDay(get("date")) };
}

/** Moves a summary anchor one period back (-1) or forward (+1). */
export function shiftPeriod(
  date: string,
  period: SummaryPeriod,
  step: -1 | 1,
): string {
  const day = new Date(`${date}T00:00:00Z`);
  if (period === "daily") day.setUTCDate(day.getUTCDate() + step);
  if (period === "weekly") day.setUTCDate(day.getUTCDate() + 7 * step);
  if (period === "monthly") day.setUTCMonth(day.getUTCMonth() + step, 1);
  if (period === "yearly")
    day.setUTCFullYear(day.getUTCFullYear() + step, 0, 1);
  return day.toISOString().slice(0, 10);
}

export function financeEntriesParams(get: Get): FinanceEntryParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    type: oneOf(["INCOME", "EXPENSE"] as const, get("type")),
    category: oneOf(
      [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES],
      get("category"),
    ),
    from: isoDay(get("from")),
    to: isoDay(get("to")),
    searchTerm: get("searchTerm") || undefined,
  };
}

export function messAuditParams(get: Get): MessAuditParams {
  return {
    page: pageOf(get),
    limit: PAGE_SIZE,
    action: oneOf<AuditAction>(AUDIT_ACTIONS, get("action")),
    entity: oneOf(AUDIT_ENTITIES, get("entity")),
    memberId: get("memberId") || undefined,
    actorId: get("actorId") || undefined,
  };
}
