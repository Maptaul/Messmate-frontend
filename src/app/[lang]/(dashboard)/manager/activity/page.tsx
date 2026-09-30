import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMessAuditLogs } from "@/api";
import ActivityExport from "@/components/modules/activity/activity-export";
import ActivityList from "@/components/modules/activity/activity-list";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { fromSearchParams, messAuditParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("activity.metaTitle"),
    alternates: await alternates("/manager/activity"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/activity">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const { activeMessId } = await getActiveMess();

  if (!activeMessId) {
    return (
      <section className="p-5">
        <NoMess />
      </section>
    );
  }

  const params = messAuditParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["mess-audit", activeMessId, params],
    queryFn: () => getMessAuditLogs(activeMessId, params, client),
  });

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("activity.title")}</h1>
          <p className="text-muted-foreground">
            {t("activity.descriptionManager")}
          </p>
        </div>
        <ActivityExport messId={activeMessId} />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ActivityList messId={activeMessId} isManager />
      </HydrationBoundary>
    </section>
  );
}
