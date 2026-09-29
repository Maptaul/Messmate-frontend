import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  deleteMess,
  getAllMesses,
  getAuditLogs,
  getDashboardStats,
  getUser,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "@/api";
import type {
  ApiResponse,
  AuditLogParams,
  MessListParams,
  User,
  UserListParams,
} from "@/types";

export function useSuspenseDashboardStats() {
  return useSuspenseQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getDashboardStats(),
  });
}

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function useSuspenseUsers(params: UserListParams) {
  return useSuspenseQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function useSuspenseUser(userId: string) {
  return useSuspenseQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => getUser(userId),
  });
}

export function useSuspenseAuditLogs(params: AuditLogParams) {
  return useSuspenseQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
}

export function useSuspenseAllMesses(params: MessListParams) {
  return useSuspenseQuery({
    queryKey: ["messes", params],
    queryFn: () => getAllMesses(params),
  });
}

/**
 * Optimistic (B7A7): the status badge flips at once and flips back if the
 * API refuses (e.g. blocking a manager with an open month).
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserStatus,
    onMutate: async ({ userId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueriesData<ApiResponse<User[]>>({
        queryKey: ["users"],
      });

      queryClient.setQueriesData<ApiResponse<User[]>>(
        { queryKey: ["users"] },
        (old) =>
          old && {
            ...old,
            data: old.data.map((user) =>
              user.id === userId ? { ...user, status } : user,
            ),
          },
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      for (const [key, data] of context?.previous ?? []) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-detail"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-detail"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useDeleteMess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messes"] });
      queryClient.invalidateQueries({ queryKey: ["my-messes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
