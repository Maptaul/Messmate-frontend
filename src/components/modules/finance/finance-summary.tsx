"use client";

import dynamic from "next/dynamic";
import BarList from "@/components/ui/bar-list";
import type { ChartConfig } from "@/components/ui/chart";
import Panel from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseFinanceSummary } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { SummaryPeriod } from "@/types";
import { formatBDT, formatDate } from "@/utils";

// Recharts is the heaviest part of the page; it loads after the totals.
const FinanceTrendChart = dynamic(() => import("./finance-trend-chart"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[2/1] max-h-72 w-full" />,
});

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
          <FinanceTrendChart data={summary.breakdown} config={trendConfig} />
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
