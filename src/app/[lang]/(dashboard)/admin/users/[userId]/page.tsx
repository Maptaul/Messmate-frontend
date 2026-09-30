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
    <section className="page-frame">
      <Link
        href={localePath(locale, "/admin/users")}
        className="flex w-fit items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("admin.users.title")}
      </Link>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<UserDetailLoading />}>
          <UserDetail userId={userId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
