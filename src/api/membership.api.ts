import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  InviteMemberPayload,
  MessMembershipParams,
  MessMembershipRequest,
  MessPreview,
  MyMembershipRequest,
  RequestToJoinPayload,
} from "@/types";

export function previewJoinCode(code: string) {
  return apiClient<ApiResponse<MessPreview>>(
    `/membership/join-code/${encodeURIComponent(code)}`,
  );
}

export function requestToJoin(payload: RequestToJoinPayload) {
  return apiClient<ApiResponse<MyMembershipRequest>>("/membership/request", {
    method: "POST",
    body: payload,
  });
}

export function inviteMember(payload: InviteMemberPayload) {
  return apiClient<ApiResponse<{ id: string; email: string }>>(
    "/membership/invite",
    { method: "POST", body: payload },
  );
}

export function getMyMembershipRequests(client = apiClient) {
  return client<ApiResponse<MyMembershipRequest[]>>("/membership/my");
}

export function getMessMembershipRequests(
  messId: string,
  params: MessMembershipParams,
  client = apiClient,
) {
  return client<ApiResponse<MessMembershipRequest[]>>(
    `/membership/mess/${messId}`,
    { params },
  );
}

export function acceptMembership(id: string) {
  return apiClient<ApiResponse<MessMembershipRequest>>(
    `/membership/${id}/accept`,
    { method: "PATCH" },
  );
}

export function declineMembership(id: string) {
  return apiClient<ApiResponse<MessMembershipRequest>>(
    `/membership/${id}/decline`,
    { method: "PATCH" },
  );
}

export function cancelMembership(id: string) {
  return apiClient<ApiResponse<{ id: string }>>(`/membership/${id}/cancel`, {
    method: "PATCH",
  });
}

export function regenerateJoinCode(messId: string) {
  return apiClient<ApiResponse<{ id: string; joinCode: string }>>(
    `/membership/mess/${messId}/join-code`,
    { method: "POST" },
  );
}
