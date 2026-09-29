import { type ApiClient, apiClient } from "@/lib/api-client";
import type {
  AdminUserDetail,
  ApiResponse,
  AuditLog,
  AuditLogParams,
  DashboardStats,
  Role,
  User,
  UserListParams,
  UserStatus,
} from "@/types";

export function getDashboardStats(client: ApiClient = apiClient) {
  return client<ApiResponse<DashboardStats>>("/admin/dashboard-stats");
}

export function getUsers(
  params: UserListParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<User[]>>("/admin/users", { query: params });
}

export function getUser(userId: string, client: ApiClient = apiClient) {
  return client<ApiResponse<AdminUserDetail>>(`/admin/users/${userId}`);
}

export function updateUserRole({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  return apiClient<ApiResponse<User>>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: { role },
  });
}

export function updateUserStatus({
  userId,
  status,
}: {
  userId: string;
  status: UserStatus;
}) {
  return apiClient<ApiResponse<User>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function getAuditLogs(
  params: AuditLogParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<AuditLog[]>>("/admin/audit-logs", {
    query: params,
  });
}
