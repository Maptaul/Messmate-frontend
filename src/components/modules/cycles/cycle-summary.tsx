"use client";

import {
  CalendarCheck2Icon,
  ChefHatIcon,
  ReceiptTextIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseCycle } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatBDT, formatNumber } from "@/utils";

const CONFIG = {
  total: { label: "৳", color: "var(--chart-1)" },
} satisfies ChartConfig;

/** Stat cards and spending-by-type for one month; used by the overview and the month page. */
export default function CycleSummary({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycle(cycleId);

  const cycle = data.data;
  const { summary } = cycle;

  // A closed month has its final rate; an open one only a running figure.
  const rate = cycle.mealRate ?? summary.runningMealRate;
  const chartData = summary.expenseByType
    .filter((row) => row.total > 0)
    .map((row) => ({
      type: t.dynamic(`expenseTypes.${row.type}`),
      total: row.total,
    }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("manager.cycle.meals")}
          value={formatNumber(summary.totalMeals, locale)}
          icon={CalendarCheck2Icon}
        />
        <StatCard
          label={t("manager.cycle.grocery")}
          value={formatBDT(summary.totalGrocery, locale)}
          icon={ShoppingBasketIcon}
        />
        <StatCard
          label={t("manager.cycle.rate")}
          value={formatBDT(rate, locale)}
          icon={ChefHatIcon}
        />
        <StatCard
          label={t("manager.cycle.records")}
          value={formatNumber(cycle._count.meals, locale)}
          hint={t("manager.cycle.recordsHint", {
            meals: formatNumber(cycle._count.meals, locale),
            expenses: formatNumber(cycle._count.expenses, locale),
            deposits: formatNumber(cycle._count.deposits, locale),
          })}
          icon={ReceiptTextIcon}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("manager.cycle.byType")}</CardTitle>
          <CardDescription>{t("manager.cycle.byTypeCaption")}</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("manager.cycle.noSpending")}
            </p>
          ) : (
            <ChartContainer
              config={CONFIG}
              className="aspect-[3/1] max-h-72 w-full"
            >
              <BarChart data={chartData} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value) => formatBDT(Number(value), locale)}
                    />
                  }
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={6} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
