import type { SidebarItems } from "@/types/sidebar.type";
import { accountRoutes } from "./account.routes";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "nav.groups.platform",
    items: [
      {
        title: "nav.items.overview",
        url: `${prefix}`,
      },
      {
        title: "nav.items.users",
        url: `${prefix}/users`,
      },
      {
        title: "nav.items.messes",
        url: `${prefix}/messes`,
      },
      {
        title: "nav.items.auditLog",
        url: `${prefix}/audit-logs`,
      },
    ],
  },
  ...accountRoutes,
];
