import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ArrowLeftIcon, LockKeyholeIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCycle, getSettlementPreview } from "@/api";
import CycleSummary from "@/components/modules/cycles/cycle-summary";
import CycleSummaryLoading from "@/components/modules/cycles/cycle-summary-loading";
import SettlementPreview from "@/components/modules/cycles/settlement-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/ui/status-badge";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { formatDate, formatMonth } from "@/utils";

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
}: PageProps<"/[lang]/manager/cycles/[cycleId]">) {
  const [t, locale, client, { cycleId }] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    params,
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

  if (cycle.status === "OPEN") {
    await queryClient.prefetchQuery({
      queryKey: ["settlement", cycleId],
      queryFn: () => getSettlementPreview(cycleId, client),
    });
  }

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {formatMonth(cycle.year, cycle.month, locale)}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            {cycle.mess.name}
            <StatusBadge status={cycle.status} />
            {cycle.closedAt && (
              <span>{formatDate(cycle.closedAt, locale)}</span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          render={<Link href={localePath(locale, "/manager/cycles")} />}
          nativeButton={false}
        >
          <ArrowLeftIcon />
          {t("manager.cycle.back")}
        </Button>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<CycleSummaryLoading />}>
          <CycleSummary cycleId={cycleId} />
        </Suspense>

        {cycle.status === "OPEN" ? (
          <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
            <SettlementPreview cycleId={cycleId} />
          </Suspense>
        ) : (
          <Alert>
            <LockKeyholeIcon />
            <AlertTitle>{t("manager.cycle.closedTitle")}</AlertTitle>
            <AlertDescription>
              <p>{t("manager.cycle.closedBody")}</p>
              <Button
                size="sm"
                className="mt-3"
                render={<Link href={localePath(locale, "/manager/bills")} />}
                nativeButton={false}
              >
                {t("manager.cycle.openBills")}
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </HydrationBoundary>
    </section>
  );
}
