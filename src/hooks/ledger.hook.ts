import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  addDeposit,
  addExpense,
  assignDuty,
  deleteDeposit,
  deleteExpense,
  getActivityUnread,
  getCycleDeposits,
  getCycleDuties,
  getCycleExpenses,
  getDutyCalendar,
  getExpenseSummary,
  getMessAuditLogs,
  getMyDutyDays,
  markActivitySeen,
  removeDuty,
  updateDeposit,
  updateDuty,
  updateExpense,
} from "@/api";
import type {
  DepositListParams,
  ExpenseListParams,
  MessAuditParams,
} from "@/types";

// --- Expenses ---------------------------------------------------------------

export function useSuspenseCycleExpenses(
  cycleId: string,
  params: ExpenseListParams,
) {
  return useSuspenseQuery({
    queryKey: ["expenses", cycleId, params],
    queryFn: () => getCycleExpenses(cycleId, params),
  });
}

export function useSuspenseExpenseSummary(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["expense-summary", cycleId],
    queryFn: () => getExpenseSummary(cycleId),
  });
}

function useInvalidateExpenses() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["expense-summary"] });
    queryClient.invalidateQueries({ queryKey: ["cycle"] });
    queryClient.invalidateQueries({ queryKey: ["settlement"] });
  };
}

export function useAddExpense() {
  const invalidate = useInvalidateExpenses();

  return useMutation({
    mutationFn: addExpense,
    onSuccess: invalidate,
  });
}

export function useUpdateExpense() {
  const invalidate = useInvalidateExpenses();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: invalidate,
  });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateExpenses();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: invalidate,
  });
}

// --- Deposits ---------------------------------------------------------------

export function useSuspenseCycleDeposits(
  cycleId: string,
  params: DepositListParams,
) {
  return useSuspenseQuery({
    queryKey: ["deposits", cycleId, params],
    queryFn: () => getCycleDeposits(cycleId, params),
  });
}

function useInvalidateDeposits() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["deposits"] });
    queryClient.invalidateQueries({ queryKey: ["settlement"] });
  };
}

export function useAddDeposit() {
  const invalidate = useInvalidateDeposits();

  return useMutation({
    mutationFn: addDeposit,
    onSuccess: invalidate,
  });
}

export function useUpdateDeposit() {
  const invalidate = useInvalidateDeposits();

  return useMutation({
    mutationFn: updateDeposit,
    onSuccess: invalidate,
  });
}

export function useDeleteDeposit() {
  const invalidate = useInvalidateDeposits();

  return useMutation({
    mutationFn: deleteDeposit,
    onSuccess: invalidate,
  });
}

// --- Bazar duty -------------------------------------------------------------

export function useSuspenseCycleDuties(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["duties", cycleId],
    queryFn: () => getCycleDuties(cycleId),
  });
}

export function useSuspenseDutyCalendar(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["duty-calendar", cycleId],
    queryFn: () => getDutyCalendar(cycleId),
  });
}

export function useSuspenseMyDutyDays(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["my-duty", cycleId],
    queryFn: () => getMyDutyDays(cycleId),
  });
}

function useInvalidateDuties() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["duties"] });
    queryClient.invalidateQueries({ queryKey: ["duty-calendar"] });
    queryClient.invalidateQueries({ queryKey: ["my-duty"] });
  };
}

export function useAssignDuty() {
  const invalidate = useInvalidateDuties();

  return useMutation({
    mutationFn: assignDuty,
    onSuccess: invalidate,
  });
}

export function useUpdateDuty() {
  const invalidate = useInvalidateDuties();

  return useMutation({
    mutationFn: updateDuty,
    onSuccess: invalidate,
  });
}

export function useRemoveDuty() {
  const invalidate = useInvalidateDuties();

  return useMutation({
    mutationFn: removeDuty,
    onSuccess: invalidate,
  });
}

// --- Mess audit log & activity feed --------------------------------------

export function useSuspenseMessAudit(messId: string, params: MessAuditParams) {
  return useSuspenseQuery({
    queryKey: ["mess-audit", messId, params],
    queryFn: () => getMessAuditLogs(messId, params),
  });
}

/** The bell's short feed; fetched only while the panel is open. */
export function useMessAudit(
  messId: string,
  params: MessAuditParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["mess-audit", messId, params],
    queryFn: () => getMessAuditLogs(messId, params),
    enabled,
  });
}

export function useActivityUnread(messId: string) {
  return useQuery({
    queryKey: ["activity-unread", messId],
    queryFn: () => getActivityUnread(messId),
    refetchInterval: 60 * 1000,
    enabled: !!messId,
  });
}

export function useMarkActivitySeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markActivitySeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-unread"] });
    },
  });
}
