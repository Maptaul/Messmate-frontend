import type { ReactNode } from "react";
import LanguageSwitcher from "@/components/ui/language-switcher";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";
import { getActiveMess } from "@/lib/activeMess";
import type { UserRole } from "@/types";
import { DashboardSidebar } from "./dashboard-sidebar";
import MessSwitcher from "./mess-switcher";
import UserMenu from "./user-menu";

export default async function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  const { choices, activeMessId } = await getActiveMess();

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset className="min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <MessSwitcher
            role={role}
            messes={choices}
            activeMessId={activeMessId}
          />
          <div className="ml-auto flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
