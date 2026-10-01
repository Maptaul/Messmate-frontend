import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getFinanceEntries, getFinanceSummary } from "@/api";
import FinanceTabs from "@/components/modules/finance/finance-tabs";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import {
  financeEntriesParams,
  financeSummaryParams,
  fromSearchParams,
} from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("finance.metaTitle"),
    alternates: await alternates("/finance"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/finance">) {
  const client = await serverApi();
  const get = fromSearchParams(await searchParams);
  const summaryParams = financeSummaryParams(get);
  const entryParams = financeEntriesParams(get);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["finance-summary", summaryParams],
      queryFn: () => getFinanceSummary(summaryParams, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["finance-entries", entryParams],
      queryFn: () => getFinanceEntries(entryParams, client),
    }),
  ]);

  return (
    <section className="page-frame">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FinanceTabs />
      </HydrationBoundary>
    </section>
  );
}
