"use client";

import StatCard from "@/components/ui/stat-card";
import StatStrip from "@/components/ui/stat-strip";
import { useSuspenseCycleTrends, useSuspenseSettlementPreview } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { cumulative, formatBDT, formatNumber, lastPoints } from "@/utils";

export default function TodayStats({
  cycleId,
  memberId,
}: {
  cycleId: string;
  memberId: string;
}) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data: preview } = useSuspenseSettlementPreview(cycleId);
  const { data: trends } = useSuspenseCycleTrends(cycleId);

  const mine = preview.data.bills.find((bill) => bill.memberId === memberId);
  const mealsSoFar = cumulative(trends.data.meals);
  const grocerySoFar = cumulative(trends.data.grocery);
  const rateTrend = mealsSoFar.map((total, index) =>
    total > 0 ? grocerySoFar[index] / total : 0,
  );

  return (
    <StatStrip>
      <StatCard
        label={t("resident.today.kMeals")}
        value={formatNumber(mine?.mealCount ?? 0, locale)}
        hint={t("resident.today.kMealsHint")}
        href={href("/dashboard/meal-plan")}
        trend={
          trends.data.myMeals
            ? lastPoints(cumulative(trends.data.myMeals))
            : undefined
        }
      />
      <StatCard
        label={t("resident.today.kRate")}
        value={formatBDT(preview.data.mealRate, locale)}
        hint={t("resident.today.kRateHint", {
          grocery: formatBDT(preview.data.totalGrocery, locale),
          meals: formatNumber(preview.data.totalMeals, locale),
        })}
        href={href("/dashboard/mess")}
        trend={lastPoints(rateTrend)}
      />
      <StatCard
        label={t("resident.today.kBill")}
        value={formatBDT(mine?.totalPayable ?? 0, locale)}
        hint={t("resident.today.kBillHint")}
        href={href("/dashboard/bills")}
      />
      <StatCard
        label={t("resident.today.kDeposited")}
        value={formatBDT(mine?.depositTotal ?? 0, locale)}
        hint={t("resident.today.kDepositedHint")}
        href={href("/dashboard/mess")}
      />
    </StatStrip>
  );
}
