import type { Role } from "@/types";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  MESS_MANAGER: "/manager",
  MEMBER: "/dashboard",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  MESS_MANAGER: "Mess Manager",
  MEMBER: "Member",
};

/**
 * Seeded demo accounts for evaluators. Public on purpose: the assignment
 * requires one-click demo login, and these hold no real data.
 */
export const DEMO_ACCOUNTS: {
  role: Role;
  email: string;
  password: string;
  blurb: string;
}[] = [
  {
    role: "ADMIN",
    email: "admin@messmate.app",
    password: "Admin@messmate12345",
    blurb: "Users, messes, platform audit log",
  },
  {
    role: "MESS_MANAGER",
    email: "manager@messmate.app",
    password: "Manager@messmate12345",
    blurb: "Cycles, meals, expenses, bills",
  },
  {
    role: "MEMBER",
    email: "member@messmate.app",
    password: "Member@messmate12345",
    blurb: "Meal plan, bills, card payment",
  },
];
