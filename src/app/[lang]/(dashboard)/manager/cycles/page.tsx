import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getExpenseSummary, getMessCycles } from "@/api";
import CycleExport from "@/components/modules/cycles/cycle-export";
import CycleList from "@/components/modules/cycles/cycle-list";
import OpenCycleDialog from "@/components/modules/cycles/open-cycle-dialog";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { cyclesParams, formatMonth, fromSearchParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.cycles.metaTitle"),
    alternates: await alternates("/manager/cycles"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/cycles">) {
  const [t, locale, client] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
  ]);
  const { activeMessId } = await getActiveMess();

  if (!activeMessId) {
    return (
      <section className="p-5">
        <NoMess />
      </section>
    );
  }

  const open = await getActiveCycle(activeMessId);
  const params = cyclesParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["cycles", activeMessId, params],
      queryFn: () => getMessCycles(activeMessId, params, client),
    }),
    // The open month's card shows running totals.
    open &&
      queryClient.prefetchQuery({
        queryKey: ["expense-summary", open.id],
        queryFn: () => getExpenseSummary(open.id, client),
      }),
  ]);

  return (
    <section className="page-frame">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="page-title">{t("manager.cycles.title")}</h1>
            <p className="text-muted-foreground">
              {t("manager.cycles.description")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CycleExport messId={activeMessId} />
            <OpenCycleDialog
              messId={activeMessId}
              openMonth={
                open ? formatMonth(open.year, open.month, locale) : undefined
              }
            />
          </div>
        </div>
        <CycleList messId={activeMessId} />
      </HydrationBoundary>
    </section>
  );
}
