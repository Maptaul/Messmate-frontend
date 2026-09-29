import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getMyBills, getMyCalendar, getMyDutyDays } from "@/api";
import ResidentEmpty from "@/components/modules/today/resident-empty";
import Today from "@/components/modules/today/today";
import TodayLoading from "@/components/modules/today/today-loading";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { LATEST_BILL_PARAMS } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("resident.today.metaTitle"),
    alternates: await alternates("/dashboard"),
  };
}

export default async function page() {
  const [t, client] = await Promise.all([getT(), serverApi()]);

  const { activeMessId } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="p-5">
        <ResidentEmpty kind="no-mess" />
      </section>
    );
  }

  const cycle = await getActiveCycle(activeMessId);
  if (!cycle) {
    return (
      <section className="p-5">
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
  ]);

  return (
    <section className="space-y-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold">{t("resident.today.title")}</h1>
        <p className="text-muted-foreground">
          {t("resident.today.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<TodayLoading />}>
          <Today cycleId={cycle.id} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
