"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  useActivityUnread,
  useCycleBills,
  useDashboardStats,
  useManagerRequests,
  useMessCycles,
  useMessMembershipRequests,
  useMyBills,
} from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { MessChoice } from "@/lib/activeMess";
import { ROLE_ROUTES } from "@/routes";
import type { Money, UserRole } from "@/types";
import type { SidebarItems } from "@/types/sidebar.type";
import {
  formatNumber,
  PENDING_REQUESTS_PARAMS,
  ROLE_HOME,
  toNumber,
} from "@/utils";
import MessSwitcher from "./mess-switcher";
import UserMenu from "./user-menu";

const OWED = { limit: 100 };
/** Requests to join waiting for this manager; their own invitations don't count. */
const ASKING_TO_JOIN = {
  status: "PENDING",
  kind: "REQUEST",
  limit: 1,
} as const;

function useNavCounts(role: UserRole, messId: string | null) {
  const isAdmin = role === "ADMIN";
  const isManager = role === "MESS_MANAGER";

  const unread = useActivityUnread(isAdmin || !messId ? "" : messId);
  const myBills = useMyBills(OWED, !isAdmin);
  const lastClosed = useMessCycles(isManager && messId ? messId : "", {
    status: "CLOSED",
    limit: 1,
  });
  const cycleBills = useCycleBills(lastClosed.data?.data[0]?.id ?? "", OWED);
  const stats = useDashboardStats(isAdmin);
  const pendingRequests = useManagerRequests(PENDING_REQUESTS_PARAMS, isAdmin);
  const askingToJoin = useMessMembershipRequests(
    isManager && messId ? messId : "",
    ASKING_TO_JOIN,
  );

  const owed = (bills?: { dueAmount: Money }[]) =>
    bills?.filter((bill) => toNumber(bill.dueAmount) > 0).length ?? 0;

  const counts: Record<string, number> = {};
  if (isAdmin) {
    counts["/admin/users"] = stats.data?.data.users.total ?? 0;
    counts["/admin/manager-requests"] = pendingRequests.data?.meta?.total ?? 0;
    return counts;
  }
  counts["/dashboard/bills"] = owed(myBills.data?.data);
  counts["/manager/bills"] = owed(cycleBills.data?.data);
  counts["/manager/members"] = askingToJoin.data?.meta?.total ?? 0;
  const seen = unread.data?.data.unread ?? 0;
  counts[isManager ? "/manager/activity" : "/dashboard/activity"] = seen;
  return counts;
}

export function DashboardSidebar({
  role,
  messes,
  activeMessId,
}: {
  role: UserRole;
  messes: MessChoice[];
  activeMessId: string | null;
}) {
  const pathname = usePathname();
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const { setOpenMobile } = useSidebar();
  const routes: SidebarItems = ROLE_ROUTES[role] || [];
  const counts = useNavCounts(role, activeMessId);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 flex-row items-center border-b px-3 group-data-[collapsible=icon]:px-2">
        <Link
          href={href(ROLE_HOME[role])}
          className="flex items-center gap-2 text-foreground"
        >
          <Logo className="h-[30px] w-[34px] shrink-0" />
          <span className="text-[15px] font-semibold tracking-[-0.01em] group-data-[collapsible=icon]:hidden">
            MessMate
          </span>
        </Link>
      </SidebarHeader>
      <div className="px-3 pt-3 pb-1 empty:hidden group-data-[collapsible=icon]:hidden">
        <MessSwitcher role={role} messes={messes} activeMessId={activeMessId} />
      </div>
      <SidebarContent className="gap-0 px-1">
        {routes.map((group) => (
          <SidebarGroup key={group.title} className="py-0">
            <SidebarGroupLabel className="micro h-auto px-2.5 pt-3.5 pb-1.5 text-[10px] tracking-[0.08em]">
              {t(group.title)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const count = counts[item.url] ?? 0;
                  const isActive = pathname === href(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        render={<Link href={href(item.url)} />}
                        isActive={isActive}
                        tooltip={t(item.title)}
                        className="h-8 gap-2.5 px-2.5 text-[13.5px] text-foreground-2 data-active:bg-primary-tint data-active:text-primary"
                        // The mobile sidebar is a sheet; close it on navigation.
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon className="opacity-90" />
                        <span>{t(item.title)}</span>
                      </SidebarMenuButton>
                      {count > 0 && (
                        <SidebarMenuBadge
                          className={
                            isActive
                              ? "rounded-full bg-card font-mono text-[11px] text-primary"
                              : "rounded-full bg-accent font-mono text-[11px] text-muted-foreground"
                          }
                        >
                          {count > 99 ? "99+" : formatNumber(count, locale)}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t px-2.5 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu inSidebar />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
