import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getCycleDeposits, getCycleExpenses, getExpenseSummary } from "@/api";
import CyclePicker from "@/components/modules/cycles/cycle-picker";
import NoCycle from "@/components/modules/cycles/no-cycle";
import DepositList from "@/components/modules/deposits/deposit-list";
import ExpenseList from "@/components/modules/expenses/expense-list";
import ResidentEmpty from "@/components/modules/today/resident-empty";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import {
  depositsParams,
  expensesParams,
  formatMonth,
  fromSearchParams,
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
  const expenseParams = expensesParams(get);
  const depositParams = depositsParams(get);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["expense-summary", cycle.id],
      queryFn: () => getExpenseSummary(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["expenses", cycle.id, expenseParams],
      queryFn: () => getCycleExpenses(cycle.id, expenseParams, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["deposits", cycle.id, depositParams],
      queryFn: () => getCycleDeposits(cycle.id, depositParams, client),
    }),
  ]);

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("resident.ledger.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("resident.ledger.description")} ·{" "}
            {formatMonth(cycle.year, cycle.month, locale)}
          </p>
        </div>
        <CyclePicker messId={activeMessId} cycleId={cycle.id} />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("resident.ledger.expensesTitle")}
            </h2>
            <ExpenseList
              cycleId={cycle.id}
              messId={activeMessId}
              locked={false}
              readOnly
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("resident.ledger.depositsTitle")}
            </h2>
            <DepositList
              cycleId={cycle.id}
              messId={activeMessId}
              locked={false}
              readOnly
            />
          </div>
        </div>
      </HydrationBoundary>
    </section>
  );
}
