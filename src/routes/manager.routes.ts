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
      },
      {
        title: "nav.items.headcount",
        url: `${prefix}/headcount`,
      },
      {
        title: "nav.items.mealRegister",
        url: `${prefix}/meals`,
      },
      {
        title: "nav.items.expenses",
        url: `${prefix}/expenses`,
      },
      {
        title: "nav.items.deposits",
        url: `${prefix}/deposits`,
      },
      {
        title: "nav.items.groceryDuty",
        url: `${prefix}/grocery-duty`,
      },
      {
        title: "nav.items.cycles",
        url: `${prefix}/cycles`,
      },
      {
        title: "nav.items.bills",
        url: `${prefix}/bills`,
      },
      {
        title: "nav.items.members",
        url: `${prefix}/members`,
      },
      {
        title: "nav.items.activityLog",
        url: `${prefix}/activity`,
      },
      {
        title: "nav.items.messSettings",
        url: `${prefix}/settings`,
      },
      {
        title: "nav.items.myMesses",
        url: `${prefix}/messes`,
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
      },
      {
        title: "nav.items.mealPlan",
        url: "/dashboard/meal-plan",
      },
      {
        title: "nav.items.myBills",
        url: "/dashboard/bills",
      },
      {
        title: "nav.items.payments",
        url: "/dashboard/payments",
      },
    ],
  },
  ...accountRoutes,
];
