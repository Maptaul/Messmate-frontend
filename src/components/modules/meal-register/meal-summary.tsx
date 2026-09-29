"use client";

import { CalendarCheck2Icon, ChefHatIcon } from "lucide-react";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseMealSummary } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatBDT, formatNumber } from "@/utils";

export default function MealSummary({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMealSummary(cycleId);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        label={t("manager.cycle.meals")}
        value={formatNumber(data.data.totalMeals, locale)}
        icon={CalendarCheck2Icon}
      />
      <StatCard
        label={t("manager.cycle.rate")}
        value={formatBDT(data.data.runningMealRate, locale)}
        icon={ChefHatIcon}
      />
    </div>
  );
}
