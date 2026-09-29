import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { getLocale } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { getSessionUser } from "@/lib/session";

// Shared by managers and members (and, for account pages, admins), so the
// sidebar follows whoever is signed in.
export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect(localePath(await getLocale(), "/login"));

  return <DashboardShell role={user.role}>{children}</DashboardShell>;
}
