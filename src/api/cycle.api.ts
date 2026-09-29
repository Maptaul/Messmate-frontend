import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CloseCycleResult,
  Cycle,
  CycleDetail,
  CycleListParams,
  OpenCyclePayload,
  SettlementPreview,
} from "@/types";

export function getMessCycles(
  messId: string,
  params: CycleListParams,
  client = apiClient,
) {
  return client<ApiResponse<Cycle[]>>(`/cycle/mess-cycles/${messId}`, {
    params,
  });
}

export function getCycle(cycleId: string, client = apiClient) {
  return client<ApiResponse<CycleDetail>>(`/cycle/${cycleId}`);
}

export function getSettlementPreview(cycleId: string, client = apiClient) {
  return client<ApiResponse<SettlementPreview>>(
    `/cycle/settlement-preview/${cycleId}`,
  );
}

export function openCycle(payload: OpenCyclePayload) {
  return apiClient<ApiResponse<Cycle>>("/cycle/open-cycle", {
    method: "POST",
    body: payload,
  });
}

export function closeCycle(cycleId: string) {
  return apiClient<ApiResponse<CloseCycleResult>>(
    `/cycle/close-cycle/${cycleId}`,
    { method: "POST" },
  );
}

/** Admin only, and only before anyone has paid. Deletes the month's bills. */
export function reopenCycle(cycleId: string) {
  return apiClient<ApiResponse<Cycle>>(`/cycle/reopen-cycle/${cycleId}`, {
    method: "POST",
  });
}
