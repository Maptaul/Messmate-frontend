import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getAuditLogs } from "@/api";
import AuditLogExport from "@/components/modules/audit-logs/audit-log-export";
import AuditLogList from "@/components/modules/audit-logs/audit-log-list";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { auditParams, fromSearchParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("admin.auditPage.metaTitle"),
    alternates: await alternates("/admin/audit-logs"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/admin/audit-logs">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const params = auditParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params, client),
  });

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("admin.auditPage.title")}</h1>
          <p className="text-muted-foreground">
            {t("admin.auditPage.description")}
          </p>
        </div>
        <AuditLogExport />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AuditLogList />
      </HydrationBoundary>
    </section>
  );
}
