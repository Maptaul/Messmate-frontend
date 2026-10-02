import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getCycleTrends,
  getMe,
  getMessAuditLogs,
  getMyBills,
  getMyCalendar,
  getMyDutyDays,
  getSettlementPreview,
} from "@/api";
import ResidentEmpty from "@/components/modules/today/resident-empty";
import Today from "@/components/modules/today/today";
import TodayLoading from "@/components/modules/today/today-loading";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { LATEST_BILL_PARAMS, RECENT_ACTIVITY_PARAMS } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("resident.today.metaTitle"),
    alternates: await alternates("/dashboard"),
  };
}

export default async function page() {
  const client = await serverApi();

  const { activeMessId } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="page-frame">
        <ResidentEmpty kind="no-mess" />
      </section>
    );
  }

  const cycle = await getActiveCycle(activeMessId);
  if (!cycle) {
    return (
      <section className="page-frame">
        <ResidentEmpty kind="no-cycle" />
      </section>
    );
  }

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["my-calendar", cycle.id],
      queryFn: () => getMyCalendar(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["my-duty", cycle.id],
      queryFn: () => getMyDutyDays(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["my-bills", LATEST_BILL_PARAMS],
      queryFn: () => getMyBills(LATEST_BILL_PARAMS, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["settlement", cycle.id],
      queryFn: () => getSettlementPreview(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["cycle-trends", cycle.id],
      queryFn: () => getCycleTrends(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["mess-audit", activeMessId, RECENT_ACTIVITY_PARAMS],
      queryFn: () =>
        getMessAuditLogs(activeMessId, RECENT_ACTIVITY_PARAMS, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: () => getMe(client),
    }),
  ]);

  return (
    <section className="page-frame">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<TodayLoading />}>
          <Today cycleId={cycle.id} messId={activeMessId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
