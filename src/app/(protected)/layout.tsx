import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { meQuery } from "@/hooks/auth.hook";
import { getQueryClient } from "@/lib/query-client";
import { serverApi } from "@/lib/server-api";
import { getSessionUser } from "@/lib/session";
import { SessionProvider } from "@/providers/session-provider";

export default async function ProtectedLayout({ children }: LayoutProps<"/">) {
  // proxy.ts already guarantees a session here; this is the belt to its braces.
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const queryClient = getQueryClient();
  const me = await queryClient
    .fetchQuery(meQuery(await serverApi()))
    .catch(() => null);

  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <SessionProvider user={user}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarProvider defaultOpen={sidebarOpen}>
          <AppSidebar footer={<UserMenu avatarUrl={me?.data.avatarUrl} />} />
          <SidebarInset>
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex-1" />
              <ThemeToggle />
            </header>
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </HydrationBoundary>
    </SessionProvider>
  );
}
