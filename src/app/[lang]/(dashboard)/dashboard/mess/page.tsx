import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getCycleDeposits,
  getCycleDuties,
  getCycleExpenses,
  getCycleMeals,
  getDutyCalendar,
  getMealSummary,
  getMess,
  getMessMembers,
} from "@/api";
import NoCycle from "@/components/modules/cycles/no-cycle";
import Ledger from "@/components/modules/ledger/ledger";
import ResidentEmpty from "@/components/modules/today/resident-empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import {
  ALL_MEMBERS_PARAMS,
  depositsParams,
  expensesParams,
  fromSearchParams,
  ledgerMealsParams,
  ledgerTab,
} from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("resident.ledger.metaTitle"),
    alternates: await alternates("/dashboard/mess"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/dashboard/mess">) {
  const [client, sp] = await Promise.all([serverApi(), searchParams]);

  const { activeMessId } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="p-5">
        <ResidentEmpty kind="no-mess" />
      </section>
    );
  }

  const cycle = await getActiveCycle(
    activeMessId,
    typeof sp.cycle === "string" ? sp.cycle : undefined,
  );
  if (!cycle) {
    return (
      <section className="p-5">
        <NoCycle />
      </section>
    );
  }

  const get = fromSearchParams(sp);
  const tab = ledgerTab(get);
  const queryClient = new QueryClient();
  const prefetch = {
    meals: () =>
      queryClient.prefetchQuery({
        queryKey: ["meals", cycle.id, ledgerMealsParams(get)],
        queryFn: () => getCycleMeals(cycle.id, ledgerMealsParams(get), client),
      }),
    expenses: () =>
      queryClient.prefetchQuery({
        queryKey: ["expenses", cycle.id, expensesParams(get)],
        queryFn: () => getCycleExpenses(cycle.id, expensesParams(get), client),
      }),
    deposits: () =>
      queryClient.prefetchQuery({
        queryKey: ["deposits", cycle.id, depositsParams(get)],
        queryFn: () => getCycleDeposits(cycle.id, depositsParams(get), client),
      }),
    duty: () =>
      Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["duties", cycle.id],
          queryFn: () => getCycleDuties(cycle.id, client),
        }),
        queryClient.prefetchQuery({
          queryKey: ["duty-calendar", cycle.id],
          queryFn: () => getDutyCalendar(cycle.id, client),
        }),
      ]),
    members: () =>
      queryClient.prefetchQuery({
        queryKey: ["members", activeMessId, ALL_MEMBERS_PARAMS],
        queryFn: () => getMessMembers(activeMessId, ALL_MEMBERS_PARAMS, client),
      }),
    // The mess itself carries its months.
    cycles: () => Promise.resolve(),
    summary: () =>
      queryClient.prefetchQuery({
        queryKey: ["meal-summary", cycle.id],
        queryFn: () => getMealSummary(cycle.id, client),
      }),
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["mess", activeMessId],
      queryFn: () => getMess(activeMessId, client),
    }),
    prefetch[tab](),
  ]);

  return (
    <section className="page-frame">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <Ledger messId={activeMessId} cycle={cycle} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
