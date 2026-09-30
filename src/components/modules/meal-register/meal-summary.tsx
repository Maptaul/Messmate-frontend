"use client";

import Panel from "@/components/ui/panel";
import { useSuspenseMealSummary } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatMonth, formatNumber } from "@/utils";

/** The month so far, member by member: lunch / dinner and a bar for the total. */
export default function MealSummary({
  cycleId,
  year,
  month,
}: {
  cycleId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);

  const { data } = useSuspenseMealSummary(cycleId);

  const members = data.data.members.filter((member) => member.totalMeals > 0);
  const peak = Math.max(...members.map((member) => member.totalMeals), 1);

  return (
    <Panel
      className="flex-[1_1_300px]"
      title={t("manager.meals.summary")}
      description={t("manager.meals.summarySub", {
        month: formatMonth(year, month, locale),
      })}
    >
      <div className="flex flex-col gap-3">
        {members.map((member) => (
          <div
            key={member.memberId}
            title={`${member.name}: ${n(member.totalMeals)}`}
            className="flex flex-col gap-1"
          >
            <div className="flex justify-between gap-2 text-[13px]">
              <span className="truncate">{member.name}</span>
              <span className="tabular-nums">
                <span className="text-muted-foreground">
                  {n(member.lunch)} / {n(member.dinner)}
                </span>{" "}
                · <b>{n(member.totalMeals)}</b>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-chart-1"
                style={{ width: `${(member.totalMeals / peak) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-between border-t pt-2.5 font-semibold">
          <span>{t("manager.meals.summaryTotal")}</span>
          <span className="tabular-nums">{n(data.data.totalMeals)}</span>
        </div>
      </div>
    </Panel>
  );
}
