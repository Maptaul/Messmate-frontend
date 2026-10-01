import apiClient from "@/lib/apiClient";
import type {
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

/** Leaving needs every bill paid; the API says so if one isn't. */
export function leaveMess(messId: string) {
  return apiClient<ApiResponse<MessMember>>(`/member/leave/${messId}`, {
    method: "PATCH",
  });
}

export function removeMember(memberId: string) {
  return apiClient<ApiResponse<MessMember>>(
    `/member/remove-member/${memberId}`,
    { method: "PATCH" },
  );
}
