import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getUsers } from "@/api";
import UserExport from "@/components/modules/users/user-export";
import UserList from "@/components/modules/users/user-list";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { fromSearchParams, usersParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("admin.users.metaTitle"),
    alternates: await alternates("/admin/users"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/admin/users">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const params = usersParams(fromSearchParams(await searchParams));

  // Same key as useSuspenseUsers(params), so the table renders with data.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params, client),
  });

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("admin.users.title")}</h1>
          <p className="text-muted-foreground">
            {t("admin.users.description")}
          </p>
        </div>
        <UserExport />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserList />
      </HydrationBoundary>
    </section>
  );
}
