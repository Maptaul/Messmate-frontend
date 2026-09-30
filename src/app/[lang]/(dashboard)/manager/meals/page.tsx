import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getCycleMeals, getMealSummary } from "@/api";
import CyclePicker from "@/components/modules/cycles/cycle-picker";
import NoCycle from "@/components/modules/cycles/no-cycle";
import MealExport from "@/components/modules/meal-register/meal-export";
import MealRegister from "@/components/modules/meal-register/meal-register";
import NoMess from "@/components/modules/my-messes/no-mess";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";
import { getActiveCycle } from "@/lib/activeCycle";
import { getActiveMess } from "@/lib/activeMess";
import serverApi from "@/lib/serverApi";
import {
  formatMonth,
  fromSearchParams,
  MEAL_PAGE_PARAMS,
  registerDate,
  todayInDhaka,
} from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.meals.metaTitle"),
    alternates: await alternates("/manager/meals"),
  };
}

export default async function page({
  searchParams,
}: PageProps<"/[lang]/manager/meals">) {
  const [t, locale, client, sp] = await Promise.all([
    getT(),
    getLocale(),
    serverApi(),
    searchParams,
  ]);

  const { activeMessId } = await getActiveMess();
  if (!activeMessId) {
    return (
      <section className="page-frame">
        <NoMess />
      </section>
    );
  }

  const cycle = await getActiveCycle(
    activeMessId,
    typeof sp.cycle === "string" ? sp.cycle : undefined,
  );
  if (!cycle) {
    return (
      <section className="page-frame">
        <NoCycle />
      </section>
    );
  }

  const date = registerDate(
    fromSearchParams(sp)("date"),
    cycle.year,
    cycle.month,
    todayInDhaka(),
  );
  const mealParams = { ...MEAL_PAGE_PARAMS, date };

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["meal-summary", cycle.id],
      queryFn: () => getMealSummary(cycle.id, client),
    }),
    queryClient.prefetchQuery({
      queryKey: ["meals", cycle.id, mealParams],
      queryFn: () => getCycleMeals(cycle.id, mealParams, client),
    }),
  ]);

  return (
    <section className="page-frame">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("manager.meals.title")}</h1>
          <p className="text-muted-foreground">
            {t("manager.meals.description")} ·{" "}
            {formatMonth(cycle.year, cycle.month, locale)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MealExport cycleId={cycle.id} />
          <CyclePicker messId={activeMessId} cycleId={cycle.id} />
        </div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MealRegister
          cycleId={cycle.id}
          year={cycle.year}
          month={cycle.month}
          locked={cycle.status === "CLOSED"}
        />
      </HydrationBoundary>
    </section>
  );
}
