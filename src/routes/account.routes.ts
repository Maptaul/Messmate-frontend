import type { SidebarItems } from "@/types/sidebar.type";

export const accountRoutes: SidebarItems = [
  {
    title: "nav.groups.account",
    items: [
      {
        title: "nav.items.finance",
        url: "/finance",
      },
      {
        title: "nav.items.profile",
        url: "/profile",
      },
    ],
  },
];
