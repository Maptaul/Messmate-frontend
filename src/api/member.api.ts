import apiClient from "@/lib/apiClient";
import type {
  AddMemberPayload,
  ApiResponse,
  MemberListParams,
  MessMember,
  MyMembership,
} from "@/types";

export function getMessMembers(
  messId: string,
  params: MemberListParams,
  client = apiClient,
) {
  return client<ApiResponse<MessMember[]>>(`/member/mess-members/${messId}`, {
    params,
  });
}

export function getMyMemberships(params: MemberListParams, client = apiClient) {
  return client<ApiResponse<MyMembership[]>>("/member/my-memberships", {
    params,
  });
}

export function addMember(payload: AddMemberPayload) {
  return apiClient<ApiResponse<MessMember>>("/member/add-member", {
    method: "POST",
    body: payload,
  });
}

export function removeMember(memberId: string) {
  return apiClient<ApiResponse<MessMember>>(
    `/member/remove-member/${memberId}`,
    { method: "PATCH" },
  );
}
