import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getMyCalendar } from "@/api";
import MealPlan from "@/components/modules/meal-plan/meal-plan";
import MealPlanLoading from "@/components/modules/meal-plan/meal-plan-loading";
import ResidentEmpty from "@/components/modules/today/resident-empty";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("resident.mealPlan.metaTitle"),
    alternates: await alternates("/dashboard/meal-plan"),
  };
}

export default async function page() {
  const [t, client] = await Promise.all([getT(), serverApi()]);

  const { activeMessId } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="p-5">
        <ResidentEmpty kind="no-mess" />
      </section>
    );
  }

  const cycle = await getActiveCycle(activeMessId);
  if (!cycle) {
    return (
      <section className="p-5">
        <ResidentEmpty kind="no-cycle" />
      </section>
    );
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["my-calendar", cycle.id],
    queryFn: () => getMyCalendar(cycle.id, client),
  });

  return (
    <section className="space-y-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("resident.mealPlan.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("resident.mealPlan.description")}
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MealPlanLoading />}>
          <MealPlan cycleId={cycle.id} messId={activeMessId} />
        </Suspense>
      </HydrationBoundary>
    </section>
  );
}
