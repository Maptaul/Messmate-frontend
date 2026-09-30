import {
  BanknoteIcon,
  Building2Icon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  ChefHatIcon,
  ContactIcon,
  HandCoinsIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  SettingsIcon,
  ShoppingBasketIcon,
  ShoppingCartIcon,
  SunIcon,
  UtensilsIcon,
} from "lucide-react";
import type { SidebarItems } from "@/types/sidebar.type";
import { accountRoutes } from "./account.routes";

const prefix = "/manager";

export const managerRoutes: SidebarItems = [
  {
    title: "nav.groups.runMess",
    items: [
      {
        title: "nav.items.overview",
        url: `${prefix}`,
        icon: LayoutDashboardIcon,
      },
      {
        title: "nav.items.headcount",
        url: `${prefix}/headcount`,
        icon: ChefHatIcon,
      },
      {
        title: "nav.items.mealRegister",
        url: `${prefix}/meals`,
        icon: UtensilsIcon,
      },
      {
        title: "nav.items.expenses",
        url: `${prefix}/expenses`,
        icon: ShoppingBasketIcon,
      },
      {
        title: "nav.items.deposits",
        url: `${prefix}/deposits`,
        icon: HandCoinsIcon,
      },
      {
        title: "nav.items.groceryDuty",
        url: `${prefix}/grocery-duty`,
        icon: ShoppingCartIcon,
      },
      {
        title: "nav.items.cycles",
        url: `${prefix}/cycles`,
        icon: CalendarRangeIcon,
      },
      {
        title: "nav.items.bills",
        url: `${prefix}/bills`,
        icon: ReceiptTextIcon,
      },
      {
        title: "nav.items.members",
        url: `${prefix}/members`,
        icon: ContactIcon,
      },
      {
        title: "nav.items.activityLog",
        url: `${prefix}/activity`,
        icon: HistoryIcon,
      },
      {
        title: "nav.items.messSettings",
        url: `${prefix}/settings`,
        icon: SettingsIcon,
      },
      {
        title: "nav.items.myMesses",
        url: `${prefix}/messes`,
        icon: Building2Icon,
      },
    ],
  },
  // A manager eats and pays like any resident.
  {
    title: "nav.groups.myMealsBills",
    items: [
      {
        title: "nav.items.today",
        url: "/dashboard",
        icon: SunIcon,
      },
      {
        title: "nav.items.mealPlan",
        url: "/dashboard/meal-plan",
        icon: CalendarDaysIcon,
      },
      {
        title: "nav.items.myBills",
        url: "/dashboard/bills",
        icon: ReceiptTextIcon,
      },
      {
        title: "nav.items.payments",
        url: "/dashboard/payments",
        icon: BanknoteIcon,
      },
    ],
  },
  ...accountRoutes,
];
