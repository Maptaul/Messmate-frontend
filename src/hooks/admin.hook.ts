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
  getDashboardTrends,
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

/**
 * Every account, for the sidebar badge. Not the overview's stats query: a
 * query the shell creates first only takes the page's server data in an
 * effect, after the server render already needed it.
 */
export function useUserCount(enabled = true) {
  const params = { limit: 1 };
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    enabled,
  });
}

export function useSuspenseDashboardTrends() {
  return useSuspenseQuery({
    queryKey: ["admin-trends"],
    queryFn: () => getDashboardTrends(),
  });
}

export function useSuspenseDashboardStats() {
  return useSuspenseQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getDashboardStats(),
  });
}

export function useManagers() {
  const params = { role: "MESS_MANAGER" as const, limit: 100 };
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

/** The role dialog's guard needs the messes a user manages. */
export function useUserDetail(userId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => getUser(userId),
    enabled,
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
 * Optimistic: the status badge flips at once and flips back if the
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
