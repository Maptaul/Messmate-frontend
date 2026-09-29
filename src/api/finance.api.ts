import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  FinanceCategory,
  FinanceEntry,
  FinanceEntryParams,
  FinanceEntryPayload,
  FinanceSummary,
  SummaryPeriod,
} from "@/types";

export function getFinanceCategories(client = apiClient) {
  return client<
    ApiResponse<{ INCOME: FinanceCategory[]; EXPENSE: FinanceCategory[] }>
  >("/finance/categories");
}

export function getFinanceEntries(
  params: FinanceEntryParams,
  client = apiClient,
) {
  return client<ApiResponse<FinanceEntry[]>>("/finance/my-entries", {
    params,
  });
}

export function getFinanceSummary(
  params: { period: SummaryPeriod; date?: string },
  client = apiClient,
) {
  return client<ApiResponse<FinanceSummary>>("/finance/summary", {
    params,
  });
}

export function addFinanceEntry(payload: FinanceEntryPayload) {
  return apiClient<ApiResponse<FinanceEntry>>("/finance/add-entry", {
    method: "POST",
    body: payload,
  });
}

export function updateFinanceEntry({
  entryId,
  ...payload
}: Partial<FinanceEntryPayload> & { entryId: string }) {
  return apiClient<ApiResponse<FinanceEntry>>(
    `/finance/update-entry/${entryId}`,
    { method: "PATCH", body: payload },
  );
}

export function deleteFinanceEntry(entryId: string) {
  return apiClient<ApiResponse<{ id: string }>>(
    `/finance/delete-entry/${entryId}`,
    { method: "DELETE" },
  );
}
