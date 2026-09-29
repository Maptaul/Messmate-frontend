import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getCycleExpenses, getExpenseSummary, getMessMembers } from "@/api";
import CyclePicker from "@/components/modules/cycles/cycle-picker";
import NoCycle from "@/components/modules/cycles/no-cycle";
import ExpenseList from "@/components/modules/expenses/expense-list";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import {
  ACTIVE_MEMBERS_PARAMS,
  expensesParams,
  formatMonth,
  fromSearchParams,
} from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.expenses.metaTitle"),
    alternates: await alternates("/manager/expenses"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/expenses">) {
  const [t, locale, client, sp] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    searchParams,
  ]);

  const { activeMessId } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="p-5">
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
      <section className="p-5">
        <NoCycle />
      </section>
    );
  }

  const params = expensesParams(fromSearchParams(sp));

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["expense-summary", cycle.id],
      queryFn: () => getExpenseSummary(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["expenses", cycle.id, params],
      queryFn: () => getCycleExpenses(cycle.id, params, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["members", activeMessId, ACTIVE_MEMBERS_PARAMS],
      queryFn: () =>
        getMessMembers(activeMessId, ACTIVE_MEMBERS_PARAMS, client),
    }),
  ]);

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("manager.expenses.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("manager.expenses.description")} ·{" "}
            {formatMonth(cycle.year, cycle.month, locale)}
          </p>
        </div>
        <CyclePicker messId={activeMessId} cycleId={cycle.id} />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ExpenseList
          cycleId={cycle.id}
          messId={activeMessId}
          locked={cycle.status === "CLOSED"}
        />
      </HydrationBoundary>
    </section>
  );
}
