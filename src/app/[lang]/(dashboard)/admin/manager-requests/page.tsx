import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getManagerRequests } from "@/api";
import ManagerRequestTabs from "@/components/modules/manager-requests/manager-request-tabs";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { fromSearchParams, managerRequestsParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("admin.managerRequests.metaTitle"),
    alternates: await alternates("/admin/manager-requests"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/admin/manager-requests">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const params = managerRequestsParams(fromSearchParams(await searchParams));

  // Same key as useSuspenseManagerRequests(params), so the table renders with data.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["manager-requests", params],
    queryFn: () => getManagerRequests(params, client),
  });

  return (
    <section className="page-frame">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">{t("admin.managerRequests.title")}</h1>
        <p className="text-muted-foreground">
          {t("admin.managerRequests.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ManagerRequestTabs />
      </HydrationBoundary>
    </section>
  );
}
