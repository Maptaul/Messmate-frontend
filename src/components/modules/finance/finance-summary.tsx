"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import BarList from "@/components/ui/bar-list";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Panel from "@/components/ui/panel";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseFinanceSummary } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { SummaryPeriod } from "@/types";
import { formatBDT, formatDate, formatMonthName, formatNumber } from "@/utils";

const INCOME = "var(--chart-1)";
const EXPENSE = "var(--chart-5)";

export default function FinanceSummary({
  period,
  date,
}: {
  period: SummaryPeriod;
  date?: string;
}) {
  const t = useT();
  const locale = useLocale();
  const { data } = useSuspenseFinanceSummary({ period, date });

  const summary = data.data;
  const range = t("finance.range", {
    from: formatDate(summary.from, locale),
    to: formatDate(summary.to, locale),
  });

  const trendConfig = {
    income: { label: t("finance.income"), color: INCOME },
    expense: { label: t("finance.expense"), color: EXPENSE },
  } satisfies ChartConfig;

  // "2026-09-14" → "14", "2026-09" → "Sep": the axis only needs the step.
  const tick = (label: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(label)
      ? formatNumber(Number(label.slice(8)), locale)
      : /^\d{4}-\d{2}$/.test(label)
        ? formatMonthName(Number(label.slice(5)), locale).slice(
            0,
            locale === "en" ? 3 : undefined,
          )
        : label;

  const bars = (rows: { category: string; total: number }[], color: string) =>
    [...rows]
      .filter((row) => row.total > 0)
      .sort((a, b) => b.total - a.total)
      .map((row) => ({
        key: row.category,
        label: t.dynamic(`finance.categories.${row.category}`),
        value: row.total,
        display: formatBDT(row.total, locale),
        color,
      }));
  const spending = bars(summary.byCategory.expense, EXPENSE);
  const sources = bars(summary.byCategory.income, INCOME);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("finance.income")}
          value={formatBDT(summary.income, locale)}
          hint={range}
        />
        <StatCard
          label={t("finance.expense")}
          value={formatBDT(summary.expense, locale)}
          hint={range}
        />
        <StatCard
          label={t("finance.balance")}
          value={formatBDT(summary.balance, locale)}
          valueClassName={
            summary.balance < 0 ? "text-destructive" : "text-(--tone-g-fg)"
          }
          hint={
            summary.balance < 0
              ? t("finance.balanceOver")
              : t("finance.balanceUnder")
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel
          title={t("finance.trend")}
          description={t("finance.trendBy", {
            unit: t(`finance.units.${period}`),
          })}
          action={
            <div className="flex gap-3.5 text-xs text-muted-foreground">
              {(["income", "expense"] as const).map((key) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-[3px]"
                    style={{ background: trendConfig[key].color }}
                  />
                  {trendConfig[key].label}
                </span>
              ))}
            </div>
          }
        >
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
                tickFormatter={tick}
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
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title={t("finance.whereWent")}>
            {spending.length > 0 ? (
              <BarList items={spending} />
            ) : (
              <p className="text-muted-foreground">{t("finance.noSpending")}</p>
            )}
          </Panel>
          <Panel title={t("finance.incomeSources")}>
            {sources.length > 0 ? (
              <BarList items={sources} />
            ) : (
              <p className="text-muted-foreground">{t("finance.noIncome")}</p>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
