import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ArrowLeftIcon, CircleCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCycle, getCycleBills, getSettlementPreview } from "@/api";
import PageCrumb from "@/components/dashboard/page-crumb";
import CloseCycleDialog from "@/components/modules/cycles/close-cycle-dialog";
import CycleSummary from "@/components/modules/cycles/cycle-summary";
import CycleSummaryLoading from "@/components/modules/cycles/cycle-summary-loading";
import FinalBills from "@/components/modules/cycles/final-bills";
import SettlementPreview from "@/components/modules/cycles/settlement-preview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/ui/status-badge";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import {
  ALL_BILLS_PARAMS,
  formatDate,
  formatMonth,
  formatNumber,
} from "@/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/manager/cycles/[cycleId]">): Promise<Metadata> {
  const [t, { cycleId }] = await Promise.all([getT(), params]);
  return {
    title: t("manager.cycle.metaTitle"),
    alternates: await alternates(`/manager/cycles/${cycleId}`),
  };
}

export default async function page({
  params,
  searchParams,
}: PageProps<"/[lang]/manager/cycles/[cycleId]">) {
  const [t, locale, client, { cycleId }, sp] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    params,
    searchParams,
  ]);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["cycle", cycleId],
    queryFn: () => getCycle(cycleId, client),
  });

  const cycle = queryClient.getQueryData<Awaited<ReturnType<typeof getCycle>>>([
    "cycle",
    cycleId,
  ])?.data;
  if (!cycle) notFound();

  const isOpen = cycle.status === "OPEN";
  await (isOpen
    ? queryClient.prefetchQuery({
        queryKey: ["settlement", cycleId],
        queryFn: () => getSettlementPreview(cycleId, client),
      })
    : queryClient.prefetchQuery({
        queryKey: ["cycle-bills", cycleId, ALL_BILLS_PARAMS],
        queryFn: () => getCycleBills(cycleId, ALL_BILLS_PARAMS, client),
      }));

  const month = formatMonth(cycle.year, cycle.month, locale);
  const n = (value: number) => formatNumber(value, locale);
  const justClosed = !isOpen && typeof sp.closed === "string";

  return (
    <section className="page-frame">
      <PageCrumb label={month} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="page-title">{month}</h1>
              <StatusBadge status={cycle.status} />
            </div>
            <p className="text-muted-foreground">
              {t("manager.cycle.counts", {
                meals: n(cycle._count.meals),
                expenses: n(cycle._count.expenses),
                deposits: n(cycle._count.deposits),
                bills: n(cycle._count.bills),
              })}
              {cycle.closedAt &&
                ` · ${
                  cycle.closedBy
                    ? t("manager.cycles.closedBy", {
                        date: formatDate(cycle.closedAt, locale),
                        name: cycle.closedBy.name,
                      })
                    : t("manager.cycles.closedOn", {
                        date: formatDate(cycle.closedAt, locale),
                      })
                }`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              render={<Link href={localePath(locale, "/manager/cycles")} />}
              nativeButton={false}
            >
              <ArrowLeftIcon />
              {t("manager.cycle.back")}
            </Button>
            {isOpen && <CloseCycleDialog cycleId={cycleId} month={month} />}
          </div>
        </div>

        {justClosed && (
          <output className="tone-g flex flex-wrap items-center gap-2.5 rounded-xl border px-4 py-3">
            <CircleCheckIcon className="size-5" />
            <span className="flex-1 font-medium">
              {t("manager.cycle.closedOk", {
                month,
                count: n(Number(sp.closed) || cycle._count.bills),
              })}
            </span>
            <Link
              href={localePath(locale, `/manager/bills?cycle=${cycleId}`)}
              className="font-semibold hover:underline"
            >
              {t("manager.cycle.goBills")}
            </Link>
          </output>
        )}

        <Suspense fallback={<CycleSummaryLoading />}>
          <CycleSummary cycleId={cycleId} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          {isOpen ? (
            <SettlementPreview cycleId={cycleId} />
          ) : (
            <FinalBills cycleId={cycleId} />
          )}
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
