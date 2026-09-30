"use client";

import { ArrowDownLeftIcon, ArrowUpRightIcon, ScaleIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseFinanceSummary } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { SummaryPeriod } from "@/types";
import { formatBDT, formatDate } from "@/utils";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

/** Totals for the chosen period, income vs spending over time, and where the spending went. */
export default function FinanceSummary({ period }: { period: SummaryPeriod }) {
  const t = useT();
  const locale = useLocale();
  const { data } = useSuspenseFinanceSummary({ period });

  const summary = data.data;

  const trendConfig = {
    income: { label: t("finance.income"), color: "var(--chart-1)" },
    expense: { label: t("finance.expense"), color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const spending = summary.byCategory.expense
    .filter((row) => row.total > 0)
    .map((row, index) => ({
      category: row.category,
      total: row.total,
      fill: `var(--color-${row.category})`,
      color: PALETTE[index % PALETTE.length],
    }));
  const categoryConfig = Object.fromEntries(
    spending.map((row) => [
      row.category,
      { label: t(`finance.categories.${row.category}`), color: row.color },
    ]),
  ) satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {t("finance.range", {
          from: formatDate(summary.from, locale),
          to: formatDate(summary.to, locale),
        })}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("finance.income")}
          value={formatBDT(summary.income, locale)}
        />
        <StatCard
          label={t("finance.expense")}
          value={formatBDT(summary.expense, locale)}
          valueClassName="text-(--tone-a-fg)"
        />
        <StatCard
          label={t("finance.balance")}
          value={formatBDT(summary.balance, locale)}
          valueClassName={summary.balance < 0 ? "text-destructive" : undefined}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("finance.trend")}</CardTitle>
            <CardDescription>
              {t("finance.trendCaption", {
                unit: t(`finance.units.${period}`),
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={trendConfig}
              className="aspect-[2/1] max-h-72 w-full"
            >
              <BarChart data={summary.breakdown} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <span className="flex w-full justify-between gap-4">
                          <span className="text-muted-foreground">
                            {trendConfig[name as keyof typeof trendConfig]
                              ?.label ?? name}
                          </span>
                          <span className="font-medium tabular-nums">
                            {formatBDT(Number(value), locale)}
                          </span>
                        </span>
                      )}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("finance.byCategory")}</CardTitle>
            <CardDescription>{t("finance.byCategoryCaption")}</CardDescription>
          </CardHeader>
          <CardContent>
            {spending.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("finance.noSpending")}
              </p>
            ) : (
              <>
                <ChartContainer
                  config={categoryConfig}
                  className="mx-auto aspect-square max-h-56"
                >
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          nameKey="category"
                          hideLabel
                          formatter={(value, name) => (
                            <span className="flex w-full justify-between gap-4">
                              <span className="text-muted-foreground">
                                {t.dynamic(`finance.categories.${name}`)}
                              </span>
                              <span className="font-medium tabular-nums">
                                {formatBDT(Number(value), locale)}
                              </span>
                            </span>
                          )}
                        />
                      }
                    />
                    <Pie
                      data={spending}
                      dataKey="total"
                      nameKey="category"
                      innerRadius={50}
                      strokeWidth={2}
                    />
                  </PieChart>
                </ChartContainer>
                <ul className="mt-3 space-y-1 text-sm">
                  {spending.map((row) => (
                    <li
                      key={row.category}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="size-2.5 rounded-full"
                          style={{ background: row.color }}
                        />
                        {t(`finance.categories.${row.category}`)}
                      </span>
                      <span className="tabular-nums">
                        {formatBDT(row.total, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
