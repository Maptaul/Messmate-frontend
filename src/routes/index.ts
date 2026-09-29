import {
  BanknoteIcon,
  Building2Icon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  CircleUserRoundIcon,
  HandCoinsIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  ReceiptTextIcon,
  ScrollTextIcon,
  ShoppingBasketIcon,
  SunIcon,
  UsersIcon,
  UtensilsIcon,
  WalletIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  /** Only active on this exact path (dashboard roots). */
  exact?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const adminNav: NavGroup = {
  title: "Platform",
  items: [
    {
      title: "Overview",
      url: "/admin",
      icon: LayoutDashboardIcon,
      exact: true,
    },
    { title: "Users", url: "/admin/users", icon: UsersIcon },
    { title: "Messes", url: "/admin/messes", icon: Building2Icon },
    { title: "Audit log", url: "/admin/audit-logs", icon: ScrollTextIcon },
  ],
};

const managerNav: NavGroup = {
  title: "Run the mess",
  items: [
    {
      title: "Overview",
      url: "/manager",
      icon: LayoutDashboardIcon,
      exact: true,
    },
    { title: "Messes", url: "/manager/messes", icon: Building2Icon },
    { title: "Members", url: "/manager/members", icon: UsersIcon },
    {
      title: "Billing cycles",
      url: "/manager/cycles",
      icon: CalendarRangeIcon,
    },
    { title: "Meal register", url: "/manager/meals", icon: UtensilsIcon },
    { title: "Expenses", url: "/manager/expenses", icon: ShoppingBasketIcon },
    { title: "Deposits", url: "/manager/deposits", icon: HandCoinsIcon },
    { title: "Bills", url: "/manager/bills", icon: ReceiptTextIcon },
  ],
};

const residentNav: NavGroup = {
  title: "My mess",
  items: [
    { title: "Today", url: "/dashboard", icon: SunIcon, exact: true },
    { title: "Meal plan", url: "/dashboard/meal-plan", icon: CalendarDaysIcon },
    { title: "My bills", url: "/dashboard/bills", icon: BanknoteIcon },
    { title: "Payments", url: "/dashboard/payments", icon: HistoryIcon },
  ],
};

const accountNav: NavGroup = {
  title: "Account",
  items: [
    { title: "Personal finance", url: "/finance", icon: WalletIcon },
    { title: "Profile", url: "/profile", icon: CircleUserRoundIcon },
  ],
};

/** What each role sees in the sidebar — the proxy enforces the same split. */
export const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  ADMIN: [adminNav, accountNav],
  MESS_MANAGER: [managerNav, residentNav, accountNav],
  MEMBER: [residentNav, accountNav],
};

export const isNavItemActive = (item: NavItem, pathname: string) =>
  pathname === item.url || (!item.exact && pathname.startsWith(`${item.url}/`));
