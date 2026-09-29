import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getLocale } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { getMeOnServer } from "@/lib/activeMess";
import { getSessionUser } from "@/lib/session";

export default async function layout({ children }: LayoutProps<"/[lang]">) {
  // proxy.ts already sends signed-out visitors to /login; this is the backstop.
  const user = await getSessionUser();
  if (!user) redirect(localePath(await getLocale(), "/login"));

  // useGetMe() reads ["user"]; hand it the copy the server already has.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: () => getMeOnServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
