import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getAllMesses } from "@/api";
import MessExport from "@/components/modules/mess-management/mess-export";
import MessList from "@/components/modules/mess-management/mess-list";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { fromSearchParams, messesParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("admin.messes.metaTitle"),
    alternates: await alternates("/admin/messes"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/admin/messes">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const params = messesParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["messes", params],
    queryFn: () => getAllMesses(params, client),
  });

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("admin.messes.title")}</h1>
          <p className="text-muted-foreground">
            {t("admin.messes.description")}
          </p>
        </div>
        <MessExport />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MessList />
      </HydrationBoundary>
    </section>
  );
}
