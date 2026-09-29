import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getMyMesses } from "@/api";
import MyMessList from "@/components/modules/my-messes/my-mess-list";
import MyMessListLoading from "@/components/modules/my-messes/my-mess-list-loading";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { alternates } from "@/i18n/metadata";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { MY_MESSES_PARAMS } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.messes.metaTitle"),
    alternates: await alternates("/manager/messes"),
  };
}

export default async function page() {
  const [t, locale, client, { activeMessId }] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    getActiveMess(),
  ]);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["my-messes", MY_MESSES_PARAMS],
    queryFn: () => getMyMesses(MY_MESSES_PARAMS, client),
  });

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("manager.messes.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("manager.messes.description")}
          </p>
        </div>
        <Button
          render={<Link href={localePath(locale, "/manager/messes/new")} />}
          nativeButton={false}
        >
          <PlusIcon />
          {t("manager.messes.create")}
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MyMessListLoading />}>
          <MyMessList activeMessId={activeMessId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
