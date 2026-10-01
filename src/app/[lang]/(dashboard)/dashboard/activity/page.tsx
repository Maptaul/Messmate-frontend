import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getActivityUnread, getMessAuditLogs } from "@/api";
import ActivityList from "@/components/modules/activity/activity-list";
import ResidentEmpty from "@/components/modules/today/resident-empty";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { fromSearchParams, messAuditParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("activity.metaTitle"),
    alternates: await alternates("/dashboard/activity"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/dashboard/activity">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const { activeMessId } = await getActiveMess();

  if (!activeMessId) {
    return (
      <section className="p-5">
        <ResidentEmpty kind="no-mess" />
      </section>
    );
  }

  const params = messAuditParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["mess-audit", activeMessId, params],
      queryFn: () => getMessAuditLogs(activeMessId, params, client),
    }),
    // What was new when the page opened, before it marks everything seen.
    queryClient.prefetchQuery({
      queryKey: ["activity-unread", activeMessId],
      queryFn: () => getActivityUnread(activeMessId, client),
    }),
  ]);

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("activity.title")}</h1>
          <p className="text-muted-foreground">
            {t("activity.descriptionMember")}
          </p>
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ActivityList messId={activeMessId} />
      </HydrationBoundary>
    </section>
  );
}
