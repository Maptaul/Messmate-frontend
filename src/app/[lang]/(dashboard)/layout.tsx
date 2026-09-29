import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { MessSwitcher } from "@/components/dashboard/mess-switcher";
import { UserMenu } from "@/components/dashboard/user-menu";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { keys } from "@/hooks/keys";
import { getLocale } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { getActiveMess, getMeOnServer } from "@/lib/active-mess";
import { getQueryClient } from "@/lib/query-client";
import { getSessionUser } from "@/lib/session";
import { ActiveMessProvider } from "@/providers/active-mess-provider";
import { SessionProvider } from "@/providers/session-provider";

export default async function ProtectedLayout({
  children,
}: LayoutProps<"/[lang]">) {
  // proxy.ts already guarantees a session here; this is the belt to its braces.
  const user = await getSessionUser();
  if (!user) redirect(localePath(await getLocale(), "/login"));

  const [me, { choices, activeMessId }] = await Promise.all([
    getMeOnServer(),
    getActiveMess(),
  ]);

  // Seed the client's useMe() with the copy we already have.
  const queryClient = getQueryClient();
  if (me) queryClient.setQueryData(keys.me, me);

  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <SessionProvider user={user}>
      <ActiveMessProvider value={{ messId: activeMessId, messes: choices }}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SidebarProvider defaultOpen={sidebarOpen}>
            <AppSidebar
              header={<MessSwitcher />}
              footer={<UserMenu avatarUrl={me?.data.avatarUrl} />}
            />
            <SidebarInset>
              <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex-1" />
                <LanguageSwitcher />
                <ThemeToggle />
              </header>
              <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </HydrationBoundary>
      </ActiveMessProvider>
    </SessionProvider>
  );
}
