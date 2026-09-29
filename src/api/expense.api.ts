import apiClient from "@/lib/apiClient";
import type {
  AddExpensePayload,
  ApiResponse,
  Expense,
  ExpenseListParams,
  ExpenseSummary,
  UpdateExpensePayload,
} from "@/types";
import { toFormData, uploadWithProgress } from "@/utils/upload.util";

export function getCycleExpenses(
  cycleId: string,
  params: ExpenseListParams,
  client = apiClient,
) {
  return client<ApiResponse<Expense[]>>(`/expense/cycle-expenses/${cycleId}`, {
    params,
  });
}

export function getExpenseSummary(cycleId: string, client = apiClient) {
  return client<ApiResponse<ExpenseSummary>>(
    `/expense/expense-summary/${cycleId}`,
  );
}

type Progress = { onProgress?: (percent: number) => void };

/** Multipart so the optional receipt (image/PDF, ≤ 4 MB) goes in the same call. */
export function addExpense({
  onProgress,
  ...payload
}: AddExpensePayload & Progress) {
  return uploadWithProgress<ApiResponse<Expense>>(
    "/expense/add-expense",
    toFormData({ ...payload }),
    { onProgress },
  );
}

export function updateExpense({
  expenseId,
  onProgress,
  ...payload
}: UpdateExpensePayload & Progress) {
  return uploadWithProgress<ApiResponse<Expense>>(
    `/expense/update-expense/${expenseId}`,
    toFormData({ ...payload }),
    { method: "PATCH", onProgress },
  );
}

export function deleteExpense(expenseId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/expense/delete-expense/${expenseId}`,
    { method: "DELETE" },
  );
}
