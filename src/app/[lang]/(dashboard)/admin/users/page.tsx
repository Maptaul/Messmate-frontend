import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getUsers } from "@/api";
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
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">{t("admin.users.title")}</h1>
        <p className="text-muted-foreground">{t("admin.users.description")}</p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserList />
      </HydrationBoundary>
    </section>
  );
}
