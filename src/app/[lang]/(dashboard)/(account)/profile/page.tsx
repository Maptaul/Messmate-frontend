import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getMe, getMyMemberships } from "@/api";
import Profile from "@/components/modules/profile/profile";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import serverApi from "@/lib/serverApi";
import { getSessionUser } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("profile.metaTitle"),
    alternates: await alternates("/profile"),
  };
}

export default async function page() {
  const [t, client, user] = await Promise.all([
    getT(),
    serverApi(),
    getSessionUser(),
  ]);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["user"],
      queryFn: () => getMe(client),
    }),
    // An admin belongs to no mess.
    user?.role !== "ADMIN" &&
      queryClient.prefetchQuery({
        queryKey: ["my-memberships"],
        queryFn: () => getMyMemberships({ limit: 100 }, client),
      }),
  ]);

  return (
    <section className="page-frame">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">{t("profile.title")}</h1>
        <p className="text-muted-foreground">{t("profile.description")}</p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Profile />
      </HydrationBoundary>
    </section>
  );
}
