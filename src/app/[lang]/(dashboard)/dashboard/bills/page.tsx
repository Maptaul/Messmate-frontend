import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMyBills } from "@/api";
import MyBillList from "@/components/modules/my-bills/my-bill-list";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { billsParams, fromSearchParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("resident.bills.metaTitle"),
    alternates: await alternates("/dashboard/bills"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/dashboard/bills">) {
  const client = await serverApi();
  const params = billsParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["my-bills", params],
    queryFn: () => getMyBills(params, client),
  });

  return (
    <section className="page-frame">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyBillList />
      </HydrationBoundary>
    </section>
  );
}
