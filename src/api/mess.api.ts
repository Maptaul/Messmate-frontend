import { type ApiClient, apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  CreateMessPayload,
  Mess,
  MessDetail,
  MessListParams,
} from "@/types";

export function getAllMesses(
  params: MessListParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<Mess[]>>("/mess/all-messes", { query: params });
}

export function getMyMesses(
  params: MessListParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<Mess[]>>("/mess/my-messes", { query: params });
}

export function getMess(messId: string, client: ApiClient = apiClient) {
  return client<ApiResponse<MessDetail>>(`/mess/${messId}`);
}

export function createMess(payload: CreateMessPayload) {
  return apiClient<ApiResponse<Mess>>("/mess/create-mess", {
    method: "POST",
    body: payload,
  });
}

export function updateMess({
  messId,
  ...payload
}: Partial<CreateMessPayload> & { messId: string }) {
  return apiClient<ApiResponse<Mess>>(`/mess/update-mess/${messId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteMess(messId: string) {
  return apiClient<ApiResponse<{ id: string; name: string }>>(
    `/mess/delete-mess/${messId}`,
    { method: "DELETE" },
  );
}
