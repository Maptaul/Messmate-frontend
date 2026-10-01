import type { ListParams } from "./api.type";
import type { UserRole } from "./user.type";

export const MANAGER_REQUEST_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;

export type ManagerRequestStatus = (typeof MANAGER_REQUEST_STATUSES)[number];

/** A member's own request, as /auth/me returns it. */
export interface MyManagerRequest {
  id: string;
  messName: string;
  messAddress: string;
  status: ManagerRequestStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

/** A request on the admin's list, with who sent it. */
export interface ManagerRequest extends MyManagerRequest {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: UserRole;
    avatarUrl: string | null;
    createdAt: string;
  };
}

export interface ManagerRequestParams extends ListParams {
  status?: ManagerRequestStatus;
}

export interface ApplyForManagerPayload {
  messName: string;
  messAddress: string;
}

export interface ReviewManagerRequestPayload {
  requestId: string;
  status: Exclude<ManagerRequestStatus, "PENDING">;
  rejectionReason?: string;
}
