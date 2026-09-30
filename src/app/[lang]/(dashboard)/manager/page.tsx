import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CalendarXIcon, PlusIcon, UtensilsIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  getCycle,
  getCycleCalendar,
  getCycleDuties,
  getCycleTrends,
  getExpenseSummary,
  getMealSummary,
  getMessAuditLogs,
} from "@/api";
import OpenCycleDialog from "@/components/modules/cycles/open-cycle-dialog";
import ManagerOverview from "@/components/modules/manager-overview/manager-overview";
import ManagerOverviewLoading from "@/components/modules/manager-overview/manager-overview-loading";
import NoMess from "@/components/modules/my-messes/no-mess";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import {
  dayInDhaka,
  formatDate,
  formatMonth,
  RECENT_ACTIVITY_PARAMS,
} from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.overview.metaTitle"),
    alternates: await alternates("/manager"),
  };
}

export default async function page() {
  const [t, locale, client] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
  ]);

  const { activeMessId, choices } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="page-frame">
        <NoMess />
      </section>
    );
  }

  const mess = choices.find((choice) => choice.id === activeMessId);
  const cycle = await getActiveCycle(activeMessId);

  if (!cycle) {
    const next = dayInDhaka(0).split("-").map(Number);
    return (
      <section className="page-frame">
        <div className="tone-a flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3">
          <CalendarXIcon className="size-5" />
          <span className="min-w-50 flex-1 font-medium">
            {t("manager.overview.noCycle", {
              month: formatMonth(next[0], next[1], locale),
            })}
          </span>
          <OpenCycleDialog messId={activeMessId} />
        </div>
        <h1 className="page-title">{mess?.name}</h1>
      </section>
    );
  }

  const tomorrow = dayInDhaka(1);
  const tomorrowInCycle = tomorrow.startsWith(
    `${cycle.year}-${String(cycle.month).padStart(2, "0")}-`,
  );

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["cycle", cycle.id],
      queryFn: () => getCycle(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["cycle-trends", cycle.id],
      queryFn: () => getCycleTrends(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["expense-summary", cycle.id],
      queryFn: () => getExpenseSummary(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["meal-summary", cycle.id],
      queryFn: () => getMealSummary(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["duties", cycle.id],
      queryFn: () => getCycleDuties(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["mess-audit", activeMessId, RECENT_ACTIVITY_PARAMS],
      queryFn: () =>
        getMessAuditLogs(activeMessId, RECENT_ACTIVITY_PARAMS, client),
    }),
    tomorrowInCycle &&
      queryClient.prefetchQuery({
        queryKey: ["headcount", cycle.id, tomorrow],
        queryFn: () => getCycleCalendar(cycle.id, tomorrow, client),
      }),
  ]);

  const detail = queryClient.getQueryData<Awaited<ReturnType<typeof getCycle>>>(
    ["cycle", cycle.id],
  )?.data;

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{mess?.name}</h1>
          <p className="text-muted-foreground">
            {t("manager.overview.description", {
              month: formatMonth(cycle.year, cycle.month, locale),
              date: detail ? formatDate(detail.createdAt, locale) : "",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            render={<Link href={localePath(locale, "/manager/meals")} />}
            nativeButton={false}
          >
            <UtensilsIcon />
            {t("manager.overview.recordToday")}
          </Button>
          <Button
            render={
              <Link href={localePath(locale, "/manager/expenses?new=1")} />
            }
            nativeButton={false}
          >
            <PlusIcon />
            {t("manager.overview.addExpense")}
          </Button>
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ManagerOverviewLoading />}>
          <ManagerOverview messId={activeMessId} cycleId={cycle.id} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
