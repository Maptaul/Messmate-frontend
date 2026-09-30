import {
  BanknoteIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  HistoryIcon,
  ReceiptTextIcon,
  SunIcon,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";
import { accountRoutes } from "./account.routes";

const prefix = "/dashboard";

export const memberRoutes: SidebarItems = [
  {
    title: "nav.groups.myMess",
    items: [
      {
        title: "nav.items.today",
        url: `${prefix}`,
        icon: SunIcon,
      },
      {
        title: "nav.items.mealPlan",
        url: `${prefix}/meal-plan`,
        icon: CalendarDaysIcon,
      },
      {
        title: "nav.items.ledger",
        url: `${prefix}/mess`,
        icon: BookOpenIcon,
      },
      {
        title: "nav.items.myBills",
        url: `${prefix}/bills`,
        icon: ReceiptTextIcon,
      },
      {
        title: "nav.items.payments",
        url: `${prefix}/payments`,
        icon: BanknoteIcon,
      },
      {
        title: "nav.items.activity",
        url: `${prefix}/activity`,
        icon: HistoryIcon,
      },
    ],
  },
  ...accountRoutes,
];
