import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteMess,
  getAllMesses,
  getAuditLogs,
  getDashboardStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "@/api";
import type { ApiClient } from "@/lib/api-client";
import { ROLE_LABEL } from "@/lib/constants";
import type {
  ApiResponse,
  AuditLogParams,
  MessListParams,
  User,
  UserListParams,
} from "@/types";

export const adminKeys = {
  all: ["admin"] as const,
  stats: ["admin", "stats"] as const,
  users: (params?: UserListParams) =>
    params
      ? (["admin", "users", params] as const)
      : (["admin", "users"] as const),
  auditLogs: (params: AuditLogParams) =>
    ["admin", "audit-logs", params] as const,
  messes: (params?: MessListParams) =>
    params
      ? (["admin", "messes", params] as const)
      : (["admin", "messes"] as const),
};

export const dashboardStatsQuery = (client?: ApiClient) =>
  queryOptions({
    queryKey: adminKeys.stats,
    queryFn: () => getDashboardStats(client),
  });

export const usersQuery = (params: UserListParams, client?: ApiClient) =>
  queryOptions({
    queryKey: adminKeys.users(params),
    queryFn: () => getUsers(params, client),
    placeholderData: keepPreviousData,
  });

export const auditLogsQuery = (params: AuditLogParams, client?: ApiClient) =>
  queryOptions({
    queryKey: adminKeys.auditLogs(params),
    queryFn: () => getAuditLogs(params, client),
    placeholderData: keepPreviousData,
  });

export const allMessesQuery = (params: MessListParams, client?: ApiClient) =>
  queryOptions({
    queryKey: adminKeys.messes(params),
    queryFn: () => getAllMesses(params, client),
    placeholderData: keepPreviousData,
  });

export const useDashboardStats = () => useQuery(dashboardStatsQuery());
export const useUsers = (params: UserListParams) =>
  useQuery(usersQuery(params));
export const useAuditLogs = (params: AuditLogParams) =>
  useQuery(auditLogsQuery(params));
export const useAllMesses = (params: MessListParams) =>
  useQuery(allMessesQuery(params));

type UserPage = ApiResponse<User[]>;

/** Rewrites one user in every cached page of the users list. */
function useOptimisticUserPatch() {
  const queryClient = useQueryClient();

  return {
    async patch(userId: string, changes: Partial<User>) {
      await queryClient.cancelQueries({ queryKey: adminKeys.users() });
      const snapshot = queryClient.getQueriesData<UserPage>({
        queryKey: adminKeys.users(),
      });

      queryClient.setQueriesData<UserPage>(
        { queryKey: adminKeys.users() },
        (page) =>
          page && {
            ...page,
            data: page.data.map((user) =>
              user.id === userId ? { ...user, ...changes } : user,
            ),
          },
      );

      return snapshot;
    },
    rollback(
      snapshot: [readonly unknown[], UserPage | undefined][] | undefined,
    ) {
      for (const [key, page] of snapshot ?? [])
        queryClient.setQueryData(key, page);
    },
    settle() {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  };
}

/** Block/unblock flips in the table immediately and rolls back if refused. */
export const useUpdateUserStatus = () => {
  const optimistic = useOptimisticUserPatch();

  return useMutation({
    mutationFn: updateUserStatus,
    onMutate: ({ userId, status }) => optimistic.patch(userId, { status }),
    onError: (_error, _vars, snapshot) => optimistic.rollback(snapshot),
    onSuccess: ({ data }) =>
      toast.success(
        data.status === "BLOCKED"
          ? `${data.name} is blocked`
          : `${data.name} is active again`,
      ),
    onSettled: optimistic.settle,
  });
};

export const useUpdateUserRole = () => {
  const optimistic = useOptimisticUserPatch();

  return useMutation({
    mutationFn: updateUserRole,
    onMutate: ({ userId, role }) => optimistic.patch(userId, { role }),
    onError: (_error, _vars, snapshot) => optimistic.rollback(snapshot),
    onSuccess: ({ data }) =>
      toast.success(`${data.name} is now ${ROLE_LABEL[data.role]}`),
    onSettled: optimistic.settle,
  });
};

export const useDeleteMess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMess,
    onSuccess: ({ data }) => {
      toast.success(`${data.name} was deleted`);
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};
