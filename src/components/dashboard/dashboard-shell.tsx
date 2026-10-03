import type { ReactNode } from "react";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";
import { getT } from "@/i18n/get-dictionary";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import type { UserRole } from "@/types";
import ActivityBell from "./activity-bell";
import CommandMenu from "./command-menu";
import CyclePill from "./cycle-pill";
import { DashboardSidebar } from "./dashboard-sidebar";
import HeaderBreadcrumb from "./header-breadcrumb";
import LockCountdown from "./lock-countdown";
import QuickActions from "./quick-actions";
import UserMenu from "./user-menu";

export default async function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  const [{ choices, activeMessId }, t] = await Promise.all([
    getActiveMess(),
    getT(),
  ]);
  const isResident = role !== "ADMIN";
  const cycle =
    isResident && activeMessId ? await getActiveCycle(activeMessId) : null;

  return (
    <SidebarProvider>
      <DashboardSidebar
        role={role}
        messes={choices}
        activeMessId={activeMessId}
      />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur-md md:px-5">
          <SidebarTrigger
            className="text-foreground-2"
            aria-label={t("shell.toggleSidebar")}
          />
          <Separator orientation="vertical" className="h-4 self-center!" />
          <HeaderBreadcrumb role={role} />
          <div className="flex-1" />
          <CommandMenu role={role} />
          {cycle?.status === "OPEN" && <CyclePill role={role} cycle={cycle} />}
          {isResident && activeMessId && <LockCountdown />}
          <QuickActions role={role} />
          {isResident && activeMessId && (
            <ActivityBell role={role} messId={activeMessId} />
          )}
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
