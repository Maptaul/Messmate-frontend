import type { ListParams, Money } from "./api.type";
import type { MyManagerRequest } from "./manager-request.type";

export type UserRole = "ADMIN" | "MESS_MANAGER" | "MEMBER";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type MembershipStatus = "ACTIVE" | "LEFT";

/** What the access token carries - enough to route and label the UI. */
export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  authProvider: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface MeMembership {
  id: string;
  status: MembershipStatus;
  joinedAt: string;
  leftAt: string | null;
  mess: { id: string; name: string; address: string };
}

export interface Me extends User {
  memberships: MeMembership[];
  managedMesses: {
    id: string;
    name: string;
    address: string;
    monthlyRent: Money;
  }[];
  /** The latest request to run a mess; absent from an API older than the feature. */
  managerApplications?: MyManagerRequest[];
}

export interface AdminUserDetail extends User {
  managedMesses: { id: string; name: string }[];
  memberships: {
    id: string;
    status: MembershipStatus;
    joinedAt: string;
    mess: { id: string; name: string };
  }[];
}

export interface UserListParams extends ListParams {
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}
