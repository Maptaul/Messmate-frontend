import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
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
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ApiClient } from "@/lib/api-client";
import { formatBDT } from "@/lib/format";
import type {
  DepositListParams,
  ExpenseListParams,
  MessAuditParams,
} from "@/types";
import { keys } from "./keys";

// --- Queries ----------------------------------------------------------------

export const cycleExpensesQuery = (
  cycleId: string,
  params: ExpenseListParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "expenses", params),
    queryFn: () => getCycleExpenses(cycleId, params, client),
    placeholderData: keepPreviousData,
  });

export const expenseSummaryQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "expense-summary"),
    queryFn: () => getExpenseSummary(cycleId, client),
  });

export const cycleDepositsQuery = (
  cycleId: string,
  params: DepositListParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "deposits", params),
    queryFn: () => getCycleDeposits(cycleId, params, client),
    placeholderData: keepPreviousData,
  });

export const cycleDutiesQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "duties"),
    queryFn: () => getCycleDuties(cycleId, client),
  });

export const dutyCalendarQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "duty-calendar"),
    queryFn: () => getDutyCalendar(cycleId, client),
  });

export const myDutyDaysQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "my-duty"),
    queryFn: () => getMyDutyDays(cycleId, client),
  });

export const messAuditQuery = (
  messId: string,
  params: MessAuditParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.messAudit(messId, params),
    queryFn: () => getMessAuditLogs(messId, params, client),
    placeholderData: keepPreviousData,
  });

export const activityUnreadQuery = (messId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.messUnread(messId),
    queryFn: () => getActivityUnread(messId, client),
    select: (res) => res.data.unread,
    refetchInterval: 60 * 1000,
  });

export const useCycleExpenses = (cycleId: string, params: ExpenseListParams) =>
  useQuery(cycleExpensesQuery(cycleId, params));
export const useExpenseSummary = (cycleId: string) =>
  useQuery(expenseSummaryQuery(cycleId));
export const useCycleDeposits = (cycleId: string, params: DepositListParams) =>
  useQuery(cycleDepositsQuery(cycleId, params));
export const useCycleDuties = (cycleId: string) =>
  useQuery(cycleDutiesQuery(cycleId));
export const useDutyCalendar = (cycleId: string) =>
  useQuery(dutyCalendarQuery(cycleId));
export const useMyDutyDays = (cycleId: string) =>
  useQuery(myDutyDaysQuery(cycleId));
export const useMessAudit = (messId: string, params: MessAuditParams) =>
  useQuery(messAuditQuery(messId, params));
export const useActivityUnread = (messId: string) =>
  useQuery(activityUnreadQuery(messId));

// --- Mutations ----------------------------------------------------------

function useCycleWrite<TVars, TRes>(
  mutationFn: (vars: TVars) => Promise<TRes>,
  cycleId: string,
  message: (res: TRes, vars: TVars) => string,
  { silent = false } = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    meta: { silent },
    onSuccess: (res, vars) => {
      toast.success(message(res, vars));
      queryClient.invalidateQueries({ queryKey: keys.cycle(cycleId) });
    },
  });
}

/** Forms show their own errors, so these stay silent on failure. */
export const useAddExpense = (cycleId: string) => {
  const t = useT();
  const locale = useLocale();
  return useCycleWrite(
    addExpense,
    cycleId,
    ({ data }) =>
      t("toast.expenseAdded", { amount: formatBDT(data.amount, locale) }),
    { silent: true },
  );
};

export const useUpdateExpense = (cycleId: string) => {
  const t = useT();
  return useCycleWrite(
    updateExpense,
    cycleId,
    () => t("toast.expenseUpdated"),
    {
      silent: true,
    },
  );
};

export const useDeleteExpense = (cycleId: string) => {
  const t = useT();
  return useCycleWrite(deleteExpense, cycleId, () => t("toast.deleted"));
};

export const useAddDeposit = (cycleId: string) => {
  const t = useT();
  const locale = useLocale();
  return useCycleWrite(
    addDeposit,
    cycleId,
    ({ data }) =>
      t("toast.depositAdded", {
        amount: formatBDT(data.amount, locale),
        name: data.member.user.name,
      }),
    { silent: true },
  );
};

export const useUpdateDeposit = (cycleId: string) => {
  const t = useT();
  return useCycleWrite(updateDeposit, cycleId, () => t("toast.saved"), {
    silent: true,
  });
};

export const useDeleteDeposit = (cycleId: string) => {
  const t = useT();
  return useCycleWrite(deleteDeposit, cycleId, () => t("toast.deleted"));
};

export const useAssignDuty = (cycleId: string) => {
  const t = useT();
  return useCycleWrite(
    assignDuty,
    cycleId,
    ({ data }) => t("toast.dutyAssigned", { name: data.member.user.name }),
    { silent: true },
  );
};

export const useUpdateDuty = (cycleId: string) => {
  const t = useT();
  return useCycleWrite(updateDuty, cycleId, () => t("toast.saved"), {
    silent: true,
  });
};

export const useRemoveDuty = (cycleId: string) => {
  const t = useT();
  return useCycleWrite(removeDuty, cycleId, () => t("toast.deleted"));
};

/** Opening the activity page resets the bell. */
export const useMarkActivitySeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markActivitySeen,
    meta: { silent: true },
    onSuccess: (_res, messId) =>
      queryClient.setQueryData(keys.messUnread(messId), (old: unknown) =>
        old && typeof old === "object"
          ? {
              ...old,
              data: { unread: 0, lastSeenAt: new Date().toISOString() },
            }
          : old,
      ),
  });
};
