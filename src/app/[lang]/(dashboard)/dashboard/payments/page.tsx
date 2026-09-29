import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMyPayments } from "@/api";
import MyPaymentList from "@/components/modules/my-payments/my-payment-list";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { fromSearchParams, paymentsParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("resident.payments.metaTitle"),
    alternates: await alternates("/dashboard/payments"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/dashboard/payments">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const params = paymentsParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params, client),
  });

  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("resident.payments.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("resident.payments.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyPaymentList />
      </HydrationBoundary>
    </section>
  );
}
