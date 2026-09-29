import { type ApiClient, apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  FinanceCategory,
  FinanceEntry,
  FinanceEntryParams,
  FinanceEntryPayload,
  FinanceSummary,
  SummaryPeriod,
} from "@/types";

export function getFinanceCategories(client: ApiClient = apiClient) {
  return client<
    ApiResponse<{ INCOME: FinanceCategory[]; EXPENSE: FinanceCategory[] }>
  >("/finance/categories");
}

export function getFinanceEntries(
  params: FinanceEntryParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<FinanceEntry[]>>("/finance/my-entries", {
    query: params,
  });
}

export function getFinanceSummary(
  params: { period: SummaryPeriod; date?: string },
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<FinanceSummary>>("/finance/summary", {
    query: params,
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
