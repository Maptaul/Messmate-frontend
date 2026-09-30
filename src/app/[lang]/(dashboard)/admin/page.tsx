import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getAuditLogs, getDashboardStats, getDashboardTrends } from "@/api";
import AdminOverview from "@/components/modules/admin-overview/admin-overview";
import AdminOverviewLoading from "@/components/modules/admin-overview/admin-overview-loading";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { RECENT_ACTIVITY_PARAMS } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("admin.overview.metaTitle"),
    alternates: await alternates("/admin"),
  };
}

export default async function page() {
  const [t, client] = await Promise.all([getT(), serverApi()]);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["admin-stats"],
      queryFn: () => getDashboardStats(client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["admin-trends"],
      queryFn: () => getDashboardTrends(client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["audit-logs", RECENT_ACTIVITY_PARAMS],
      queryFn: () => getAuditLogs(RECENT_ACTIVITY_PARAMS, client),
    }),
  ]);

  return (
    <section className="page-frame">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">{t("admin.overview.title")}</h1>
        <p className="text-muted-foreground">
          {t("admin.overview.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AdminOverviewLoading />}>
          <AdminOverview />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
