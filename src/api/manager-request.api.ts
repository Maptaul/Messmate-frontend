import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ApplyForManagerPayload,
  ManagerRequest,
  ManagerRequestParams,
  ReviewManagerRequestPayload,
} from "@/types";

export function applyForManager(payload: ApplyForManagerPayload) {
  return apiClient<ApiResponse<ManagerRequest>>("/manager-request/apply", {
    method: "POST",
    body: payload,
  });
}

export function getManagerRequests(
  params: ManagerRequestParams,
  client = apiClient,
) {
  return client<ApiResponse<ManagerRequest[]>>(
    "/manager-request/all-requests",
    { params },
  );
}

export function reviewManagerRequest(payload: ReviewManagerRequestPayload) {
  return apiClient<ApiResponse<ManagerRequest>>("/manager-request/review", {
    method: "POST",
    body: payload,
  });
}
