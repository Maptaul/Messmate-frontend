"use client";

import StatCard from "@/components/ui/stat-card";
import StatStrip from "@/components/ui/stat-strip";
import {
  useSuspenseCycle,
  useSuspenseCycleBills,
  useSuspenseSettlementPreview,
} from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import {
  ALL_BILLS_PARAMS,
  formatBDT,
  formatNumber,
  todayInDhaka,
  toNumber,
} from "@/utils";

export default function CycleSummary({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycle(cycleId);
  const cycle = data.data;
  const { summary } = cycle;

  const meals = (
    <StatCard
      label={t("manager.cycle.kMeals")}
      value={formatNumber(summary.totalMeals, locale)}
      hint={
        cycle.status === "OPEN"
          ? t("manager.cycle.kMealsHint", {
              count: formatNumber(daysSoFar(cycle.year, cycle.month), locale),
            })
          : undefined
      }
    />
  );
  const grocery = (
    <StatCard
      label={t("manager.cycle.kGrocery")}
      value={formatBDT(summary.totalGrocery, locale)}
      hint={t("manager.cycle.kGroceryHint", {
        count: formatNumber(cycle._count.expenses, locale),
      })}
    />
  );

  return cycle.status === "OPEN" ? (
    <StatStrip>
      {meals}
      {grocery}
      <StatCard
        label={t("manager.cycle.kRate")}
        value={formatBDT(summary.runningMealRate, locale)}
        hint={t("manager.cycle.kRateHint", {
          grocery: formatBDT(summary.totalGrocery, locale),
          meals: formatNumber(summary.totalMeals, locale),
        })}
      />
      <SharedCard cycleId={cycleId} />
    </StatStrip>
  ) : (
    <StatStrip>
      {meals}
      {grocery}
      <StatCard
        label={t("manager.cycle.kRateFinal")}
        value={formatBDT(cycle.mealRate ?? summary.runningMealRate, locale)}
        hint={t("manager.cycle.kRateFinalHint")}
      />
      <OutstandingCard cycleId={cycleId} />
    </StatStrip>
  );
}

function daysSoFar(year: number, month: number) {
  const today = todayInDhaka();
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  if (today.startsWith(prefix)) return Number(today.slice(8, 10));
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function SharedCard({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const { data } = useSuspenseSettlementPreview(cycleId);
  const bills = data.data.bills;
  const total = bills.reduce(
    (sum, bill) => sum + bill.sharedCost + bill.rentShare,
    0,
  );

  return (
    <StatCard
      label={t("manager.cycle.kShared")}
      value={formatBDT(total, locale)}
      hint={
        bills.length > 0
          ? t("manager.cycle.kSharedHint", {
              amount: formatBDT(total / bills.length, locale),
            })
          : undefined
      }
    />
  );
}

function OutstandingCard({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const { data } = useSuspenseCycleBills(cycleId, ALL_BILLS_PARAMS);
  const owing = data.data.filter((bill) => toNumber(bill.dueAmount) > 0);
  const total = owing.reduce((sum, bill) => sum + toNumber(bill.dueAmount), 0);
  const carried = data.data.filter((bill) => bill.status === "CARRIED").length;

  return (
    <StatCard
      label={t("manager.cycle.kOutstanding")}
      value={formatBDT(total, locale)}
      valueClassName={total > 0 ? "text-(--tone-a-fg)" : undefined}
      hint={
        owing.length > 0
          ? t("manager.cycle.kOutstandingHint", {
              count: formatNumber(owing.length, locale),
            })
          : carried > 0
            ? t("manager.cycle.kOutstandingCarried", {
                count: formatNumber(carried, locale),
              })
            : t("manager.cycle.kOutstandingNone")
      }
    />
  );
}
