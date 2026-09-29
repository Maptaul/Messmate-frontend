import apiClient from "@/lib/apiClient";
import type {
  AddDailyMealsPayload,
  ApiResponse,
  ApplyPlanResult,
  CycleCalendar,
  MealCounts,
  MealEntry,
  MealListParams,
  MealSummary,
  MyCalendar,
  SetDefaultMealsPayload,
  SetMealPlanPayload,
} from "@/types";

// --- Meal register (manager) -------------------------------------------

export function getCycleMeals(
  cycleId: string,
  params: MealListParams,
  client = apiClient,
) {
  return client<ApiResponse<MealEntry[]>>(`/meal/cycle-meals/${cycleId}`, {
    params,
  });
}

export function getMealSummary(cycleId: string, client = apiClient) {
  return client<ApiResponse<MealSummary>>(`/meal/meal-summary/${cycleId}`);
}

export function addDailyMeals(payload: AddDailyMealsPayload) {
  return apiClient<ApiResponse<MealEntry[]>>("/meal/add-daily-meals", {
    method: "POST",
    body: payload,
  });
}

export function updateMeal({
  mealId,
  ...counts
}: Partial<MealCounts> & { mealId: string }) {
  return apiClient<ApiResponse<MealEntry>>(`/meal/update-meal/${mealId}`, {
    method: "PATCH",
    body: counts,
  });
}

export function deleteMeal(mealId: string) {
  return apiClient<ApiResponse<{ id: string }>>(`/meal/delete-meal/${mealId}`, {
    method: "DELETE",
  });
}

// --- Meal plan (everyone) ---------------------------------------------

export function getMyCalendar(cycleId: string, client = apiClient) {
  return client<ApiResponse<MyCalendar>>(`/meal-plan/my-calendar/${cycleId}`);
}

/** Without `date`: the whole month (sparse). With `date`: that day's headcount. */
export function getCycleCalendar(
  cycleId: string,
  date?: string,
  client = apiClient,
) {
  return client<ApiResponse<CycleCalendar>>(
    `/meal-plan/cycle-calendar/${cycleId}`,
    { params: { date } },
  );
}

export function setMealPlan(payload: SetMealPlanPayload) {
  return apiClient<ApiResponse<MealEntry[]>>("/meal-plan/set-my-plan", {
    method: "POST",
    body: payload,
  });
}

export function setDefaultMeals(payload: SetDefaultMealsPayload) {
  return apiClient<
    ApiResponse<{ id: string; defaultLunch: number; defaultDinner: number }>
  >("/meal-plan/set-default-meals", { method: "PATCH", body: payload });
}

export function applyPlanToRegister(payload: {
  cycleId: string;
  date: string;
}) {
  return apiClient<ApiResponse<ApplyPlanResult>>(
    "/meal-plan/apply-to-register",
    { method: "POST", body: payload },
  );
}
