import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMessCycles } from "@/api";
import CycleList from "@/components/modules/cycles/cycle-list";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { cyclesParams, fromSearchParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.cycles.metaTitle"),
    alternates: await alternates("/manager/cycles"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/cycles">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const { activeMessId } = await getActiveMess();

  if (!activeMessId) {
    return (
      <section className="p-5">
        <NoMess />
      </section>
    );
  }

  const params = cyclesParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["cycles", activeMessId, params],
    queryFn: () => getMessCycles(activeMessId, params, client),
  });

  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">{t("manager.cycles.title")}</h1>
        <p className="text-muted-foreground">
          {t("manager.cycles.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CycleList messId={activeMessId} />
      </HydrationBoundary>
    </section>
  );
}
