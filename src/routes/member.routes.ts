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
      },
      {
        title: "nav.items.mealPlan",
        url: `${prefix}/meal-plan`,
      },
      {
        title: "nav.items.ledger",
        url: `${prefix}/mess`,
      },
      {
        title: "nav.items.myBills",
        url: `${prefix}/bills`,
      },
      {
        title: "nav.items.payments",
        url: `${prefix}/payments`,
      },
      {
        title: "nav.items.activity",
        url: `${prefix}/activity`,
      },
    ],
  },
  ...accountRoutes,
];
