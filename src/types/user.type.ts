import type { ListParams, Money } from "./api.type";

export type Role = "ADMIN" | "MESS_MANAGER" | "MEMBER";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type MembershipStatus = "ACTIVE" | "LEFT";

/** What the access token carries — enough to route and label the UI. */
export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
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
  role?: Role;
  status?: UserStatus;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}
