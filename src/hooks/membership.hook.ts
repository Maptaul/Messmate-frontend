import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptMembership,
  cancelMembership,
  declineMembership,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-membership-requests"] });
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mess-membership-requests"] });
    },
  });
}

export function useAcceptMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-membership-requests"] });
      queryClient.invalidateQueries({ queryKey: ["mess-membership-requests"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["my-memberships"] });
      queryClient.invalidateQueries({ queryKey: ["my-messes"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useDeclineMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-membership-requests"] });
      queryClient.invalidateQueries({ queryKey: ["mess-membership-requests"] });
    },
  });
}

export function useCancelMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-membership-requests"] });
      queryClient.invalidateQueries({ queryKey: ["mess-membership-requests"] });
    },
  });
}

export function useLeaveMess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveMess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-memberships"] });
      queryClient.invalidateQueries({ queryKey: ["my-messes"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRegenerateJoinCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateJoinCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-messes"] });
    },
  });
}
