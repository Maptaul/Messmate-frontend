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
import { getUser } from "@/api";
import UserDetail from "@/components/modules/users/user-detail";
import UserDetailLoading from "@/components/modules/users/user-detail-loading";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import serverApi from "@/lib/serverApi";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("admin.userDetail.metaTitle") };
}

export default async function page({
  params,
}: PageProps<"/[lang]/admin/users/[userId]">) {
  const [t, locale, client, { userId }] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    params,
  ]);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user-detail", userId],
    queryFn: () => getUser(userId, client),
  });

  const user = queryClient.getQueryData<Awaited<ReturnType<typeof getUser>>>([
    "user-detail",
    userId,
  ])?.data;
  if (!user) notFound();

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Button
          variant="outline"
          render={<Link href={localePath(locale, "/admin/users")} />}
          nativeButton={false}
        >
          <ArrowLeftIcon />
          {t("admin.userDetail.back")}
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<UserDetailLoading />}>
          <UserDetail userId={userId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
