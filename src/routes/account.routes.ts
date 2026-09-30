import { CircleUserRoundIcon, WalletIcon } from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";

export const accountRoutes: SidebarItems = [
  {
    title: "nav.groups.account",
    items: [
      {
        title: "nav.items.finance",
        url: "/finance",
        icon: WalletIcon,
      },
      {
        title: "nav.items.profile",
        url: "/profile",
        icon: CircleUserRoundIcon,
      },
    ],
  },
];
