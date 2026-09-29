import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getMess } from "@/api";
import MessSettings from "@/components/modules/mess-settings/mess-settings";
import NoMess from "@/components/modules/my-messes/no-mess";
import { Skeleton } from "@/components/ui/skeleton";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.settings.metaTitle"),
    alternates: await alternates("/manager/settings"),
  };
}

export default async function page() {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const { activeMessId } = await getActiveMess();

  if (!activeMessId) {
    return (
      <section className="p-5">
        <NoMess />
      </section>
    );
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["mess", activeMessId],
    queryFn: () => getMess(activeMessId, client),
  });

  return (
    <section className="space-y-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("manager.settings.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("manager.settings.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Skeleton className="h-96 max-w-2xl rounded-xl" />}>
          <MessSettings messId={activeMessId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
