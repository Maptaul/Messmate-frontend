import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CalendarPlusIcon, ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCycle } from "@/api";
import CycleSummary from "@/components/modules/cycles/cycle-summary";
import CycleSummaryLoading from "@/components/modules/cycles/cycle-summary-loading";
import OpenCycleDialog from "@/components/modules/cycles/open-cycle-dialog";
import NoMess from "@/components/modules/my-messes/no-mess";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { formatMonth } from "@/utils";

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
      <section className="p-5">
        <NoMess />
      </section>
    );
  }

  const mess = choices.find((choice) => choice.id === activeMessId);
  const cycle = await getActiveCycle(activeMessId);

  const queryClient = new QueryClient();
  if (cycle) {
    await queryClient.prefetchQuery({
      queryKey: ["cycle", cycle.id],
      queryFn: () => getCycle(cycle.id, client),
    });
  }

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {mess?.name ?? t("manager.overview.metaTitle")}
          </h1>
          <p className="text-muted-foreground">
            {cycle
              ? `${t("manager.overview.month")}: ${formatMonth(cycle.year, cycle.month, locale)}`
              : t("manager.overview.description")}
          </p>
        </div>
        {cycle && (
          <Button
            variant="outline"
            render={
              <Link href={localePath(locale, `/manager/cycles/${cycle.id}`)} />
            }
            nativeButton={false}
          >
            <ExternalLinkIcon />
            {t("manager.overview.openMonth")}
          </Button>
        )}
      </div>

      {cycle ? (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<CycleSummaryLoading />}>
            <CycleSummary cycleId={cycle.id} />
          </Suspense>
        </HydrationBoundary>
      ) : (
        <div className="rounded-xl border">
          <EmptyState
            icon={CalendarPlusIcon}
            title={t("manager.noCycle.title")}
            description={t("manager.noCycle.body")}
            action={<OpenCycleDialog messId={activeMessId} />}
          />
        </div>
      )}
    </section>
  );
}
