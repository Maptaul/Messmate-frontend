import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getCycleDuties, getDutyCalendar, getMessMembers } from "@/api";
import CyclePicker from "@/components/modules/cycles/cycle-picker";
import NoCycle from "@/components/modules/cycles/no-cycle";
import DutyCreateDialog from "@/components/modules/grocery-duty/duty-create-dialog";
import DutyExport from "@/components/modules/grocery-duty/duty-export";
import DutyList from "@/components/modules/grocery-duty/duty-list";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { ACTIVE_MEMBERS_PARAMS, formatMonth } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.duty.metaTitle"),
    alternates: await alternates("/manager/grocery-duty"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/grocery-duty">) {
  const [t, locale, client, sp] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    searchParams,
  ]);

  const { activeMessId } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="page-frame">
        <NoMess />
      </section>
    );
  }

  const cycle = await getActiveCycle(
    activeMessId,
    typeof sp.cycle === "string" ? sp.cycle : undefined,
  );
  if (!cycle) {
    return (
      <section className="page-frame">
        <NoCycle />
      </section>
    );
  }

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["duties", cycle.id],
      queryFn: () => getCycleDuties(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["duty-calendar", cycle.id],
      queryFn: () => getDutyCalendar(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["members", activeMessId, ACTIVE_MEMBERS_PARAMS],
      queryFn: () =>
        getMessMembers(activeMessId, ACTIVE_MEMBERS_PARAMS, client),
    }),
  ]);

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("manager.duty.title")}</h1>
          <p className="text-muted-foreground">
            {t("manager.duty.description", {
              month: formatMonth(cycle.year, cycle.month, locale),
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CyclePicker messId={activeMessId} cycleId={cycle.id} />
          <DutyExport cycleId={cycle.id} />
          {cycle.status !== "CLOSED" && (
            <DutyCreateDialog
              cycleId={cycle.id}
              messId={activeMessId}
              year={cycle.year}
              month={cycle.month}
            />
          )}
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DutyList
          cycleId={cycle.id}
          messId={activeMessId}
          year={cycle.year}
          month={cycle.month}
          locked={cycle.status === "CLOSED"}
        />
      </HydrationBoundary>
    </section>
  );
}
