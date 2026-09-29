import apiClient from "@/lib/apiClient";
import type {
  ActivityUnread,
  AddDepositPayload,
  ApiResponse,
  AssignDutyPayload,
  AuditLog,
  Deposit,
  DepositListParams,
  DutyCalendar,
  GroceryDuty,
  MessAuditParams,
  MyDutyDays,
} from "@/types";

// --- Deposits ---------------------------------------------------------------

export function getCycleDeposits(
  cycleId: string,
  params: DepositListParams,
  client = apiClient,
) {
  return client<ApiResponse<Deposit[]>>(`/deposit/cycle-deposits/${cycleId}`, {
    params,
  });
}

export function addDeposit(payload: AddDepositPayload) {
  return apiClient<ApiResponse<Deposit>>("/deposit/add-deposit", {
    method: "POST",
    body: payload,
  });
}

export function updateDeposit({
  depositId,
  ...payload
}: {
  depositId: string;
  amount?: number;
  note?: string;
}) {
  return apiClient<ApiResponse<Deposit>>(
    `/deposit/update-deposit/${depositId}`,
    { method: "PATCH", body: payload },
  );
}

export function deleteDeposit(depositId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/deposit/delete-deposit/${depositId}`,
    { method: "DELETE" },
  );
}

// --- Grocery (bazar) duty -------------------------------------------------

export function getCycleDuties(cycleId: string, client = apiClient) {
  return client<ApiResponse<GroceryDuty[]>>(
    `/grocery-duty/cycle-duties/${cycleId}`,
  );
}

export function getDutyCalendar(
  cycleId: string,
  client = apiClient,
) {
  return client<ApiResponse<DutyCalendar>>(
    `/grocery-duty/cycle-calendar/${cycleId}`,
  );
}

export function getMyDutyDays(cycleId: string, client = apiClient) {
  return client<ApiResponse<MyDutyDays>>(
    `/grocery-duty/my-duty-days/${cycleId}`,
  );
}

export function assignDuty(payload: AssignDutyPayload) {
  return apiClient<ApiResponse<GroceryDuty>>("/grocery-duty/assign-duty", {
    method: "POST",
    body: payload,
  });
}

export function updateDuty({
  dutyId,
  ...payload
}: { dutyId: string } & Partial<Omit<AssignDutyPayload, "cycleId">>) {
  return apiClient<ApiResponse<GroceryDuty>>(
    `/grocery-duty/update-duty/${dutyId}`,
    { method: "PATCH", body: payload },
  );
}

export function removeDuty(dutyId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/grocery-duty/remove-duty/${dutyId}`,
    { method: "DELETE" },
  );
}

// --- Mess audit log & activity feed --------------------------------------

/** A member only ever gets the rows about themselves. */
export function getMessAuditLogs(
  messId: string,
  params: MessAuditParams,
  client = apiClient,
) {
  return client<ApiResponse<AuditLog[]>>(`/mess/audit-logs/${messId}`, {
    params,
  });
}

export function getActivityUnread(
  messId: string,
  client = apiClient,
) {
  return client<ApiResponse<ActivityUnread>>(`/mess/activity-unread/${messId}`);
}

export function markActivitySeen(messId: string) {
  return apiClient<ApiResponse<ActivityUnread>>(
    `/mess/activity-seen/${messId}`,
    { method: "PATCH" },
  );
}
