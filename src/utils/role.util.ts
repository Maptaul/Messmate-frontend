import type { MessageKey } from "@/i18n/translate";
import type { UserRole } from "@/types";

/** Locale-free home per role; wrap with localePath() before navigating. */
export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  MESS_MANAGER: "/manager",
  MEMBER: "/dashboard",
};

export const ROLE_LABEL_KEY: Record<UserRole, MessageKey> = {
  ADMIN: "roles.ADMIN",
  MESS_MANAGER: "roles.MESS_MANAGER",
  MEMBER: "roles.MEMBER",
};
