import apiClient from "@/lib/apiClient";
import type {
  AdminUserDetail,
  ApiResponse,
  AuditLog,
  AuditLogParams,
  DashboardStats,
  UserRole,
  User,
  UserListParams,
  UserStatus,
} from "@/types";

export function getDashboardStats(client = apiClient) {
  return client<ApiResponse<DashboardStats>>("/admin/dashboard-stats");
}

export function getUsers(
  params: UserListParams,
  client = apiClient,
) {
  return client<ApiResponse<User[]>>("/admin/users", { params });
}

export function getUser(userId: string, client = apiClient) {
  return client<ApiResponse<AdminUserDetail>>(`/admin/users/${userId}`);
}

export function updateUserRole({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
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
  client = apiClient,
) {
  return client<ApiResponse<AuditLog[]>>("/admin/audit-logs", {
    params,
  });
}
