import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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
import type { ApiResponse, MealListParams, MyCalendar } from "@/types";

// --- Meal register (manager) -------------------------------------------

export function useSuspenseCycleMeals(cycleId: string, params: MealListParams) {
  return useSuspenseQuery({
    queryKey: ["meals", cycleId, params],
    queryFn: () => getCycleMeals(cycleId, params),
  });
}

export function useSuspenseMealSummary(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["meal-summary", cycleId],
    queryFn: () => getMealSummary(cycleId),
  });
}

function useInvalidateMeals() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["meals"] });
    queryClient.invalidateQueries({ queryKey: ["meal-summary"] });
    queryClient.invalidateQueries({ queryKey: ["cycle"] });
    queryClient.invalidateQueries({ queryKey: ["settlement"] });
  };
}

export function useAddDailyMeals() {
  const invalidate = useInvalidateMeals();

  return useMutation({
    mutationFn: addDailyMeals,
    onSuccess: invalidate,
  });
}

export function useUpdateMeal() {
  const invalidate = useInvalidateMeals();

  return useMutation({
    mutationFn: updateMeal,
    onSuccess: invalidate,
  });
}

export function useDeleteMeal() {
  const invalidate = useInvalidateMeals();

  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: invalidate,
  });
}

export function useApplyPlan() {
  const invalidate = useInvalidateMeals();

  return useMutation({
    mutationFn: applyPlanToRegister,
    onSuccess: invalidate,
  });
}

// --- Meal plan & headcount --------------------------------------------

export function useSuspenseMyCalendar(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["my-calendar", cycleId],
    queryFn: () => getMyCalendar(cycleId),
  });
}

export function useSuspenseCycleCalendar(cycleId: string, date?: string) {
  return useSuspenseQuery({
    queryKey: ["headcount", cycleId, date],
    queryFn: () => getCycleCalendar(cycleId, date),
  });
}

/**
 * Optimistic: the calendar shows the new plan at once. A day that
 * locked meanwhile comes back as a 409 and the calendar is put back.
 */
export function useSetMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setMealPlan,
    onMutate: async ({ cycleId, memberId, days }) => {
      // Planning for someone else doesn't touch *my* calendar.
      if (memberId) return undefined;

      const queryKey = ["my-calendar", cycleId];
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<ApiResponse<MyCalendar>>(queryKey);

      const changes = new Map(days.map((day) => [day.date, day]));
      queryClient.setQueryData<ApiResponse<MyCalendar>>(
        queryKey,
        (old) =>
          old && {
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
          },
      );

      return { queryKey, previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["headcount"] });
    },
  });
}

export function useSetDefaultMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultMeals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["headcount"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
