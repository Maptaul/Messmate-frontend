import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addDailyMeals,
  applyPlanToRegister,
  deleteMeal,
  getCycleCalendar,
  getCycleMeals,
  getMealSummary,
  getMyCalendar,
  setDefaultMeals,
  setMealPlan,
  updateMeal,
} from "@/api";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ApiClient } from "@/lib/api-client";
import { formatDate, formatNumber } from "@/lib/format";
import type {
  ApiResponse,
  MealListParams,
  MyCalendar,
  SetMealPlanPayload,
} from "@/types";
import { keys } from "./keys";

// --- Queries ----------------------------------------------------------------

export const cycleMealsQuery = (
  cycleId: string,
  params: MealListParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "meals", params),
    queryFn: () => getCycleMeals(cycleId, params, client),
    placeholderData: keepPreviousData,
  });

export const mealSummaryQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "meal-summary"),
    queryFn: () => getMealSummary(cycleId, client),
  });

export const myCalendarQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "my-calendar"),
    queryFn: () => getMyCalendar(cycleId, client),
  });

/** `date` → that day's headcount; none → the month (sparse). */
export const cycleCalendarQuery = (
  cycleId: string,
  date?: string,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "headcount", { date }),
    queryFn: () => getCycleCalendar(cycleId, date, client),
  });

export const useCycleMeals = (cycleId: string, params: MealListParams) =>
  useQuery(cycleMealsQuery(cycleId, params));
export const useMealSummary = (cycleId: string) =>
  useQuery(mealSummaryQuery(cycleId));
export const useMyCalendar = (cycleId: string) =>
  useQuery(myCalendarQuery(cycleId));
export const useCycleCalendar = (cycleId: string, date?: string) =>
  useQuery(cycleCalendarQuery(cycleId, date));

// --- Meal register (manager) -------------------------------------------

function useCycleRefresh() {
  const queryClient = useQueryClient();
  return (cycleId: string) =>
    queryClient.invalidateQueries({ queryKey: keys.cycle(cycleId) });
}

export const useAddDailyMeals = () => {
  const refresh = useCycleRefresh();
  const t = useT();
  const locale = useLocale();

  return useMutation({
    mutationFn: addDailyMeals,
    onSuccess: (_res, { cycleId, date }) => {
      toast.success(t("toast.mealsSaved", { date: formatDate(date, locale) }));
      refresh(cycleId);
    },
  });
};

export const useUpdateMeal = (cycleId: string) => {
  const refresh = useCycleRefresh();
  const t = useT();

  return useMutation({
    mutationFn: updateMeal,
    onSuccess: () => {
      toast.success(t("toast.saved"));
      refresh(cycleId);
    },
  });
};

export const useDeleteMeal = (cycleId: string) => {
  const refresh = useCycleRefresh();
  const t = useT();

  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      toast.success(t("toast.deleted"));
      refresh(cycleId);
    },
  });
};

export const useApplyPlan = () => {
  const refresh = useCycleRefresh();
  const t = useT();
  const locale = useLocale();

  return useMutation({
    mutationFn: applyPlanToRegister,
    onSuccess: ({ data }, { cycleId }) => {
      toast.success(
        t("toast.planApplied", {
          created: formatNumber(data.created, locale),
          fromDefaults: formatNumber(data.fromDefaults, locale),
        }),
      );
      refresh(cycleId);
    },
  });
};

// --- Meal plan (everyone) ---------------------------------------------

/**
 * Optimistic: the calendar shows the new plan at once. A day that locked in
 * the meantime comes back as a 409 — the global toast explains, and the
 * snapshot puts the calendar back.
 */
export const useSetMealPlan = () => {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: setMealPlan,
    onMutate: async ({ cycleId, memberId, days }: SetMealPlanPayload) => {
      // Planning for someone else doesn't touch *my* calendar.
      if (memberId) return undefined;

      const key = keys.cyclePart(cycleId, "my-calendar");
      await queryClient.cancelQueries({ queryKey: key });
      const snapshot = queryClient.getQueryData<ApiResponse<MyCalendar>>(key);

      const changes = new Map(days.map((day) => [day.date, day]));
      queryClient.setQueryData<ApiResponse<MyCalendar>>(key, (old) =>
        old
          ? {
              ...old,
              data: {
                ...old.data,
                days: old.data.days.map((day) => {
                  const change = changes.get(day.date);
                  return change
                    ? {
                        ...day,
                        lunch: change.lunch,
                        dinner: change.dinner,
                        isPlanned: true,
                        isDefault: false,
                      }
                    : day;
                }),
              },
            }
          : old,
      );

      return { key, snapshot };
    },
    onError: (_error, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(context.key, context.snapshot);
      }
    },
    onSuccess: () => toast.success(t("toast.planSaved")),
    onSettled: (_res, _error, { cycleId }) =>
      queryClient.invalidateQueries({ queryKey: keys.cycle(cycleId) }),
  });
};

export const useSetDefaultMeals = () => {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: setDefaultMeals,
    meta: { silent: true },
    onSuccess: (_res, { messId }) => {
      toast.success(t("toast.defaultsSaved"));
      queryClient.invalidateQueries({ queryKey: keys.mess(messId) });
      queryClient.invalidateQueries({ queryKey: ["cycle"] });
    },
  });
};
