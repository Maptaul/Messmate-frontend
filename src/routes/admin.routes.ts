import {
  Building2Icon,
  LayoutDashboardIcon,
  ScrollTextIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";
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
        icon: LayoutDashboardIcon,
      },
      {
        title: "nav.items.users",
        url: `${prefix}/users`,
        icon: UsersIcon,
      },
      {
        title: "nav.items.managerRequests",
        url: `${prefix}/manager-requests`,
        icon: UserCheckIcon,
      },
      {
        title: "nav.items.messes",
        url: `${prefix}/messes`,
        icon: Building2Icon,
      },
      {
        title: "nav.items.auditLog",
        url: `${prefix}/audit-logs`,
        icon: ScrollTextIcon,
      },
    ],
  },
  ...accountRoutes,
];
