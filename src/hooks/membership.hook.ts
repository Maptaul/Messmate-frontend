import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  answerMembership,
  cancelMembership,
  getMessMembershipRequests,
  getMyMembershipRequests,
  inviteMember,
  leaveMess,
  previewJoinCode,
  regenerateJoinCode,
  requestToJoin,
} from "@/api";
import type { MessMembershipParams } from "@/types";
import { JOIN_CODE_PATTERN } from "@/validation";

/** Everything that changes when someone joins, leaves or gets an answer. */
const refreshMemberships = (queryClient: QueryClient) => {
  for (const queryKey of [
    ["my-membership-requests"],
    ["mess-membership-requests"],
    ["members"],
    ["my-memberships"],
    ["my-messes"],
    ["user"],
  ]) {
    queryClient.invalidateQueries({ queryKey });
  }
};

export function useJoinCodePreview(code: string) {
  return useQuery({
    queryKey: ["join-code", code],
    queryFn: () => previewJoinCode(code),
    enabled: JOIN_CODE_PATTERN.test(code),
    retry: false,
  });
}

export function useMyMembershipRequests(enabled = true) {
  return useQuery({
    queryKey: ["my-membership-requests"],
    queryFn: () => getMyMembershipRequests(),
    enabled,
  });
}

export function useMessMembershipRequests(
  messId: string,
  params: MessMembershipParams,
) {
  return useQuery({
    queryKey: ["mess-membership-requests", messId, params],
    queryFn: () => getMessMembershipRequests(messId, params),
    enabled: !!messId,
  });
}

export function useRequestToJoin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestToJoin,
    onSuccess: () => refreshMemberships(queryClient),
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => refreshMemberships(queryClient),
  });
}

export function useAnswerMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: answerMembership,
    onSuccess: () => refreshMemberships(queryClient),
  });
}

export function useCancelMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMembership,
    onSuccess: () => refreshMemberships(queryClient),
  });
}

export function useLeaveMess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveMess,
    onSuccess: () => refreshMemberships(queryClient),
  });
}

export function useRegenerateJoinCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateJoinCode,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-messes"] }),
  });
}
