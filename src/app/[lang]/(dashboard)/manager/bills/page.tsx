import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getCycleBills } from "@/api";
import BillExport from "@/components/modules/bills/bill-export";
import BillList from "@/components/modules/bills/bill-list";
import NoCycle from "@/components/modules/cycles/no-cycle";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import {
  ALL_BILLS_PARAMS,
  billsParams,
  formatMonth,
  fromSearchParams,
} from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.bills.metaTitle"),
    alternates: await alternates("/manager/bills"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/bills">) {
  const [t, locale, client, sp] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    searchParams,
  ]);

  const { activeMessId, choices } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="page-frame">
        <NoMess />
      </section>
    );
  }

  // Bills only exist once a month is closed, so default to the newest closed one.
  const cycle = await getActiveCycle(
    activeMessId,
    typeof sp.cycle === "string" ? sp.cycle : undefined,
    "CLOSED",
  );
  if (!cycle) {
    return (
      <section className="page-frame">
        <NoCycle />
      </section>
    );
  }

  const params = billsParams(fromSearchParams(sp));

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["cycle-bills", cycle.id, params],
      queryFn: () => getCycleBills(cycle.id, params, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["cycle-bills", cycle.id, ALL_BILLS_PARAMS],
      queryFn: () => getCycleBills(cycle.id, ALL_BILLS_PARAMS, client),
    }),
  ]);
  const month = formatMonth(cycle.year, cycle.month, locale);

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("manager.bills.title")}</h1>
          <p className="text-muted-foreground">
            {t("manager.bills.description", { month })}
          </p>
        </div>
        <BillExport cycleId={cycle.id} />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BillList
          messId={activeMessId}
          cycleId={cycle.id}
          messName={
            choices.find((choice) => choice.id === activeMessId)?.name ?? ""
          }
          period={month}
          periodKey={`${cycle.year}-${String(cycle.month).padStart(2, "0")}`}
        />
      </HydrationBoundary>
    </section>
  );
}
