"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { splitLocale } from "@/i18n/locale-path";
import { ROLE_HOME } from "@/lib/constants";
import { useSession } from "@/providers/session-provider";
import { isNavItemActive, NAV_BY_ROLE } from "@/routes";

export function AppSidebar({
  header,
  footer,
}: {
  header?: ReactNode;
  footer: ReactNode;
}) {
  const { role } = useSession();
  const t = useT();
  const href = useLocalePath();
  const { path } = splitLocale(usePathname());
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 p-3">
        <Logo
          href={href(ROLE_HOME[role])}
          className="group-data-[collapsible=icon]:hidden"
        />
        {header}
      </SidebarHeader>
      <SidebarContent>
        {NAV_BY_ROLE[role].map((group) => (
          <SidebarGroup key={group.titleKey}>
            <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={href(item.url)} />}
                      isActive={isNavItemActive(item, path)}
                      tooltip={t(item.titleKey)}
                      onClick={() => setOpenMobile(false)}
                    >
                      <item.icon />
                      <span>{t(item.titleKey)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>{footer}</SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
