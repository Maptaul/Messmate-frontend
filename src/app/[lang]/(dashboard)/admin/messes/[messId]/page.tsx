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
import { getMess, getMessAuditLogs, getMessMembers } from "@/api";
import MessDetail from "@/components/modules/mess-management/mess-detail";
import MessDetailLoading from "@/components/modules/mess-management/mess-detail-loading";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import serverApi from "@/lib/serverApi";
import { ALL_MEMBERS_PARAMS, MESS_ACTIVITY_PARAMS } from "@/utils";

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
      queryKey: ["members", messId, ALL_MEMBERS_PARAMS],
      queryFn: () => getMessMembers(messId, ALL_MEMBERS_PARAMS, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["mess-audit", messId, MESS_ACTIVITY_PARAMS],
      queryFn: () => getMessAuditLogs(messId, MESS_ACTIVITY_PARAMS, client),
    }),
  ]);

  const mess = queryClient.getQueryData<Awaited<ReturnType<typeof getMess>>>([
    "mess",
    messId,
  ])?.data;
  if (!mess) notFound();

  return (
    <section className="page-frame">
      <Link
        href={localePath(locale, "/admin/messes")}
        className="flex w-fit items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("admin.messDetail.back")}
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="page-title">{mess.name}</h1>
        <p className="text-muted-foreground">{mess.address}</p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MessDetailLoading />}>
          <MessDetail messId={messId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
