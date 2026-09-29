import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMess, getMessMembers } from "@/api";
import MessDetail from "@/components/modules/mess-management/mess-detail";
import MessDetailLoading from "@/components/modules/mess-management/mess-detail-loading";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import serverApi from "@/lib/serverApi";
import { ACTIVE_MEMBERS_PARAMS } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("admin.messDetail.metaTitle") };
}

export default async function page({
  params,
}: PageProps<"/[lang]/admin/messes/[messId]">) {
  const [t, locale, client, { messId }] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    params,
  ]);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["mess", messId],
      queryFn: () => getMess(messId, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["members", messId, ACTIVE_MEMBERS_PARAMS],
      queryFn: () => getMessMembers(messId, ACTIVE_MEMBERS_PARAMS, client),
    }),
  ]);

  const mess = queryClient.getQueryData<Awaited<ReturnType<typeof getMess>>>([
    "mess",
    messId,
  ])?.data;
  if (!mess) notFound();

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{mess.name}</h1>
          <p className="text-muted-foreground">{mess.address}</p>
        </div>
        <Button
          variant="outline"
          render={<Link href={localePath(locale, "/admin/messes")} />}
          nativeButton={false}
        >
          <ArrowLeftIcon />
          {t("admin.messDetail.back")}
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MessDetailLoading />}>
          <MessDetail messId={messId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
