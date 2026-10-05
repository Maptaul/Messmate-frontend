"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useLocale } from "@/i18n/i18n-provider";
import type { FinanceSummary } from "@/types";
import { formatBDT, formatMonthName, formatNumber } from "@/utils";

export default function FinanceTrendChart({
  data,
  config,
}: {
  data: FinanceSummary["breakdown"];
  config: ChartConfig;
}) {
  const locale = useLocale();

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

  return (
    <ChartContainer config={config} className="aspect-[2/1] max-h-72 w-full">
      <BarChart data={data} margin={{ top: 8 }}>
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
                    {config[String(name)]?.label ?? name}
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
  );
}
