import type { UserRole } from "@/types";
import type { SidebarItems } from "@/types/sidebar.type";
import { adminRoutes } from "./admin.routes";
import { managerRoutes } from "./manager.routes";
import { memberRoutes } from "./member.routes";

export * from "./account.routes";
export * from "./admin.routes";
export * from "./manager.routes";
export * from "./member.routes";

/** The sidebar, breadcrumb and command menu all read the same list. */
export const ROLE_ROUTES: Record<UserRole, SidebarItems> = {
  ADMIN: adminRoutes,
  MESS_MANAGER: managerRoutes,
  MEMBER: memberRoutes,
};
