import type { MessageKey } from "@/i18n/translate";
import type { Role } from "@/types";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

/** Locale-free home per role; wrap with localePath() before navigating. */
export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  MESS_MANAGER: "/manager",
  MEMBER: "/dashboard",
};

export const ROLE_LABEL_KEY: Record<Role, MessageKey> = {
  ADMIN: "roles.ADMIN",
  MESS_MANAGER: "roles.MESS_MANAGER",
  MEMBER: "roles.MEMBER",
};

/**
 * Seeded demo accounts for evaluators. Public on purpose: the assignment
 * requires one-click demo login, and these hold no real data.
 */
export const DEMO_ACCOUNTS: {
  role: Role;
  email: string;
  password: string;
  blurbKey: MessageKey;
}[] = [
  {
    role: "ADMIN",
    email: "admin@messmate.app",
    password: "Admin@messmate12345",
    blurbKey: "auth.login.demoAdmin",
  },
  {
    role: "MESS_MANAGER",
    email: "manager@messmate.app",
    password: "Manager@messmate12345",
    blurbKey: "auth.login.demoManager",
  },
  {
    role: "MEMBER",
    email: "member@messmate.app",
    password: "Member@messmate12345",
    blurbKey: "auth.login.demoMember",
  },
];
