import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createMess,
  getMess,
  getMessMembers,
  getMyMemberships,
  getMyMesses,
  removeMember,
  updateMess,
} from "@/api";
import type { MemberListParams, MessListParams } from "@/types";

export function useActiveMembers(messId: string) {
  return useQuery({
    queryKey: ["members", messId, { status: "ACTIVE", limit: 100 }],
    queryFn: () => getMessMembers(messId, { status: "ACTIVE", limit: 100 }),
    enabled: !!messId,
  });
}

export function useSuspenseMyMesses(params: MessListParams) {
  return useSuspenseQuery({
    queryKey: ["my-messes", params],
    queryFn: () => getMyMesses(params),
  });
}

export function useSuspenseMess(messId: string) {
  return useSuspenseQuery({
    queryKey: ["mess", messId],
    queryFn: () => getMess(messId),
  });
}

export function useSuspenseMessMembers(
  messId: string,
  params: MemberListParams,
) {
  return useSuspenseQuery({
    queryKey: ["members", messId, params],
    queryFn: () => getMessMembers(messId, params),
  });
}

export function useSuspenseMyMemberships() {
  return useSuspenseQuery({
    queryKey: ["my-memberships"],
    queryFn: () => getMyMemberships({ limit: 100 }),
  });
}

export function useCreateMess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-messes"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUpdateMess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mess"] });
      queryClient.invalidateQueries({ queryKey: ["my-messes"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["mess"] });
    },
  });
}
