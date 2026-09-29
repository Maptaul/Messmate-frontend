import {
  BanknoteIcon,
  BookOpenIcon,
  Building2Icon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  ChefHatIcon,
  CircleUserRoundIcon,
  ContactIcon,
  HandCoinsIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  ReceiptTextIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShoppingBasketIcon,
  ShoppingCartIcon,
  SunIcon,
  UsersIcon,
  UtensilsIcon,
  WalletIcon,
} from "lucide-react";
import type { MessageKey } from "@/i18n/translate";
import type { Role } from "@/types";

export interface NavItem {
  titleKey: MessageKey;
  /** Locale-free; the sidebar prefixes it for the current language. */
  url: string;
  icon: LucideIcon;
  /** Only active on this exact path (dashboard roots). */
  exact?: boolean;
}

export interface NavGroup {
  titleKey: MessageKey;
  items: NavItem[];
}

const adminNav: NavGroup = {
  titleKey: "nav.groups.platform",
  items: [
    {
      titleKey: "nav.items.overview",
      url: "/admin",
      icon: LayoutDashboardIcon,
      exact: true,
    },
    { titleKey: "nav.items.users", url: "/admin/users", icon: UsersIcon },
    { titleKey: "nav.items.messes", url: "/admin/messes", icon: Building2Icon },
    {
      titleKey: "nav.items.auditLog",
      url: "/admin/audit-logs",
      icon: ScrollTextIcon,
    },
  ],
};

const managerNav: NavGroup = {
  titleKey: "nav.groups.runMess",
  items: [
    {
      titleKey: "nav.items.overview",
      url: "/manager",
      icon: LayoutDashboardIcon,
      exact: true,
    },
    {
      titleKey: "nav.items.headcount",
      url: "/manager/headcount",
      icon: ChefHatIcon,
    },
    {
      titleKey: "nav.items.mealRegister",
      url: "/manager/meals",
      icon: UtensilsIcon,
    },
    {
      titleKey: "nav.items.expenses",
      url: "/manager/expenses",
      icon: ShoppingBasketIcon,
    },
    {
      titleKey: "nav.items.deposits",
      url: "/manager/deposits",
      icon: HandCoinsIcon,
    },
    {
      titleKey: "nav.items.groceryDuty",
      url: "/manager/grocery-duty",
      icon: ShoppingCartIcon,
    },
    {
      titleKey: "nav.items.cycles",
      url: "/manager/cycles",
      icon: CalendarRangeIcon,
    },
    {
      titleKey: "nav.items.bills",
      url: "/manager/bills",
      icon: ReceiptTextIcon,
    },
    {
      titleKey: "nav.items.members",
      url: "/manager/members",
      icon: ContactIcon,
    },
    {
      titleKey: "nav.items.activityLog",
      url: "/manager/activity",
      icon: HistoryIcon,
    },
    {
      titleKey: "nav.items.messSettings",
      url: "/manager/settings",
      icon: SettingsIcon,
    },
    {
      titleKey: "nav.items.myMesses",
      url: "/manager/messes",
      icon: Building2Icon,
    },
  ],
};

const residentItems: NavItem[] = [
  {
    titleKey: "nav.items.today",
    url: "/dashboard",
    icon: SunIcon,
    exact: true,
  },
  {
    titleKey: "nav.items.mealPlan",
    url: "/dashboard/meal-plan",
    icon: CalendarDaysIcon,
  },
  {
    titleKey: "nav.items.myBills",
    url: "/dashboard/bills",
    icon: BanknoteIcon,
  },
  {
    titleKey: "nav.items.payments",
    url: "/dashboard/payments",
    icon: WalletIcon,
  },
];

// A manager already sees the whole ledger and the activity log in their own group.
const managerResidentNav: NavGroup = {
  titleKey: "nav.groups.myMealsBills",
  items: residentItems,
};

const memberNav: NavGroup = {
  titleKey: "nav.groups.myMess",
  items: [
    ...residentItems.slice(0, 2),
    {
      titleKey: "nav.items.ledger",
      url: "/dashboard/mess",
      icon: BookOpenIcon,
    },
    ...residentItems.slice(2),
    {
      titleKey: "nav.items.activity",
      url: "/dashboard/activity",
      icon: HistoryIcon,
    },
  ],
};

const accountNav: NavGroup = {
  titleKey: "nav.groups.account",
  items: [
    { titleKey: "nav.items.finance", url: "/finance", icon: WalletIcon },
    {
      titleKey: "nav.items.profile",
      url: "/profile",
      icon: CircleUserRoundIcon,
    },
  ],
};

/** What each role sees in the sidebar — the proxy enforces the same split. */
export const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  ADMIN: [adminNav, accountNav],
  MESS_MANAGER: [managerNav, managerResidentNav, accountNav],
  MEMBER: [memberNav, accountNav],
};

/** `pathname` must be locale-free (see splitLocale). */
export const isNavItemActive = (item: NavItem, pathname: string) =>
  pathname === item.url || (!item.exact && pathname.startsWith(`${item.url}/`));
