import type { ListParams, Money } from "./api.type";
import type { CycleStatus } from "./cycle.type";

interface MemberRef {
  id: string;
  user: { id: string; name: string; email: string };
}

// --- Deposits ---------------------------------------------------------------

export interface Deposit {
  id: string;
  amount: Money;
  note: string | null;
  createdAt: string;
  member: MemberRef;
  createdBy: { id: string; name: string };
}

export interface DepositListParams extends ListParams {
  memberId?: string;
}

export interface AddDepositPayload {
  cycleId: string;
  memberId: string;
  amount: number;
  note?: string;
}

// --- Grocery (bazar) duty -------------------------------------------------

export interface GroceryDuty {
  id: string;
  startDate: string;
  endDate: string;
  note: string | null;
  member: MemberRef;
}

export interface DutyCalendar {
  cycle: { id: string; year: number; month: number; status: CycleStatus };
  days: { date: string; memberId: string | null; memberName: string | null }[];
}

export interface MyDutyDays {
  cycle: { id: string; year: number; month: number; status: CycleStatus };
  memberId: string;
  totalDays: number;
  turns: {
    startDate: string;
    endDate: string;
    days: number;
    note: string | null;
  }[];
}

export interface AssignDutyPayload {
  cycleId: string;
  memberId: string;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string;
  note?: string;
}

// --- Activity feed ----------------------------------------------------------

export interface ActivityUnread {
  unread: number;
  lastSeenAt: string | null;
}

export interface MessAuditParams extends ListParams {
  memberId?: string;
  action?: string;
  entity?: string;
  actorId?: string;
}
