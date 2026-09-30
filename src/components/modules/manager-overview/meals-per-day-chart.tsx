"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Panel from "@/components/ui/panel";
import { INTL_LOCALE } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatMonthName, formatNumber } from "@/utils";

/** One line, one colour: meals recorded each day of the month so far. */
export default function MealsPerDayChart({
  days,
  meals,
}: {
  days: string[];
  meals: number[];
}) {
  const t = useT();
  const locale = useLocale();

  const config = {
    meals: { label: t("manager.overview.meals"), color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const short = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const data = days.map((day, index) => ({
    label: short.format(new Date(`${day}T00:00:00Z`)),
    meals: meals[index],
  }));
  const month = Number((days[0] ?? "").split("-")[1]);
  const range = days.length
    ? `${formatNumber(1, locale)}–${formatNumber(days.length, locale)} ${formatMonthName(month, locale)}`
    : "";

  return (
    <Panel
      flush
      title={t("manager.overview.daily")}
      description={t("manager.overview.dailySub", { range })}
      action={
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-[2px] bg-chart-1" />
          {t("manager.overview.meals")}
        </span>
      }
    >
      <div className="px-4.5 pt-3.5 pb-2.5">
        <ChartContainer config={config} className="aspect-auto h-44 w-full">
          <AreaChart data={data} margin={{ top: 8, left: 8, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="meals"
              type="monotone"
              stroke="var(--color-meals)"
              strokeWidth={2}
              fill="var(--color-meals)"
              fillOpacity={0.1}
              dot={{ r: 3, fill: "var(--card)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Panel>
  );
}
