import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getCycleDeposits, getMessMembers } from "@/api";
import CyclePicker from "@/components/modules/cycles/cycle-picker";
import NoCycle from "@/components/modules/cycles/no-cycle";
import DepositCreateDialog from "@/components/modules/deposits/deposit-create-dialog";
import DepositExport from "@/components/modules/deposits/deposit-export";
import DepositList from "@/components/modules/deposits/deposit-list";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import {
  ACTIVE_MEMBERS_PARAMS,
  ALL_DEPOSITS_PARAMS,
  depositsParams,
  formatMonth,
  fromSearchParams,
} from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.deposits.metaTitle"),
    alternates: await alternates("/manager/deposits"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/deposits">) {
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

  const params = depositsParams(fromSearchParams(sp));

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["deposits", cycle.id, params],
      queryFn: () => getCycleDeposits(cycle.id, params, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["deposits", cycle.id, ALL_DEPOSITS_PARAMS],
      queryFn: () => getCycleDeposits(cycle.id, ALL_DEPOSITS_PARAMS, client),
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
          <h1 className="page-title">{t("manager.deposits.title")}</h1>
          <p className="text-muted-foreground">
            {t("manager.deposits.description", {
              month: formatMonth(cycle.year, cycle.month, locale),
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CyclePicker messId={activeMessId} cycleId={cycle.id} />
          <DepositExport cycleId={cycle.id} />
          {cycle.status !== "CLOSED" && (
            <DepositCreateDialog cycleId={cycle.id} messId={activeMessId} />
          )}
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DepositList
          cycleId={cycle.id}
          messId={activeMessId}
          locked={cycle.status === "CLOSED"}
        />
      </HydrationBoundary>
    </section>
  );
}
