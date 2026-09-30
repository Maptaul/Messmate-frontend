import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMessMembers } from "@/api";
import AddMemberDialog from "@/components/modules/members/add-member-dialog";
import MemberExport from "@/components/modules/members/member-export";
import MemberList from "@/components/modules/members/member-list";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
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
  const { activeMessId, choices } = await getActiveMess();

  if (!activeMessId) {
    return (
      <section className="page-frame">
        <NoMess />
      </section>
    );
  }

  const params = membersParams(fromSearchParams(await searchParams));
  const mess = choices.find((choice) => choice.id === activeMessId);
  const cycle = await getActiveCycle(activeMessId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["members", activeMessId, params],
    queryFn: () => getMessMembers(activeMessId, params, client),
  });

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("manager.members.title")}</h1>
          <p className="text-muted-foreground">
            {t("manager.members.description", { mess: mess?.name ?? "" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MemberExport messId={activeMessId} />
          <AddMemberDialog messId={activeMessId} />
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MemberList messId={activeMessId} cycle={cycle} />
      </HydrationBoundary>
    </section>
  );
}
