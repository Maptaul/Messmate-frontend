import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMessMembers } from "@/api";
import MemberList from "@/components/modules/members/member-list";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import { fromSearchParams, membersParams } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.members.metaTitle"),
    alternates: await alternates("/manager/members"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/members">) {
  const [t, client] = await Promise.all([getT(), serverApi()]);
  const { activeMessId } = await getActiveMess();

  if (!activeMessId) {
    return (
      <section className="p-5">
        <NoMess />
      </section>
    );
  }

  const params = membersParams(fromSearchParams(await searchParams));

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["members", activeMessId, params],
    queryFn: () => getMessMembers(activeMessId, params, client),
  });

  return (
    <section className="p-5">
      <div>
        <h1 className="text-2xl font-semibold">{t("manager.members.title")}</h1>
        <p className="text-muted-foreground">
          {t("manager.members.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MemberList messId={activeMessId} />
      </HydrationBoundary>
    </section>
  );
}
