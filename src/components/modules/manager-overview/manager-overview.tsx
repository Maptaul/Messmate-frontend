"use client";

import { ShoppingCartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import BarList from "@/components/ui/bar-list";
import Panel from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/ui/stat-card";
import StatStrip from "@/components/ui/stat-strip";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import {
  useCycleBills,
  useSuspenseCycle,
  useSuspenseCycleDuties,
  useSuspenseCycleTrends,
  useSuspenseExpenseSummary,
  useSuspenseMealSummary,
  useSuspenseMessAudit,
} from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import {
  cumulative,
  formatBDT,
  formatDate,
  formatMonth,
  formatNumber,
  formatRelative,
  lastPoints,
  RECENT_ACTIVITY_PARAMS,
  todayInDhaka,
  toNumber,
} from "@/utils";
import TomorrowHeadcount from "./tomorrow-headcount";

// Recharts is the heaviest part of the page; it loads after the rest.
const MealsPerDayChart = dynamic(() => import("./meals-per-day-chart"), {
  ssr: false,
  loading: () => <Skeleton className="h-65 rounded-xl" />,
});

const OWED = { limit: 100 };

export default function ManagerOverview({
  messId,
  cycleId,
}: {
  messId: string;
  cycleId: string;
}) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const n = (value: number) => formatNumber(value, locale);

  const { data: cycle } = useSuspenseCycle(cycleId);
  const { data: trends } = useSuspenseCycleTrends(cycleId);
  const { data: expenses } = useSuspenseExpenseSummary(cycleId);
  const { data: meals } = useSuspenseMealSummary(cycleId);
  const { data: duties } = useSuspenseCycleDuties(cycleId);
  const { data: activity } = useSuspenseMessAudit(
    messId,
    RECENT_ACTIVITY_PARAMS,
  );

  const previous = trends.data.previousCycle;
  const { data: previousBills } = useCycleBills(previous?.id ?? "", OWED);

  const month = formatMonth(cycle.data.year, cycle.data.month, locale);
  const summary = expenses.data;
  const mealsSoFar = cumulative(trends.data.meals);
  const grocerySoFar = cumulative(trends.data.grocery);
  const rateTrend = mealsSoFar.map((total, index) =>
    total > 0 ? grocerySoFar[index] / total : 0,
  );
  const groceryCount =
    summary.byType.find((row) => row.type === "GROCERY")?.count ?? 0;
  const owedPrevious = trends.data.previousDue;
  const unpaid =
    previousBills?.data.filter((bill) => toNumber(bill.dueAmount) > 0).length ??
    0;
  const previousMonth = previous
    ? formatMonth(previous.year, previous.month, locale)
    : "";

  const today = todayInDhaka();
  const onDuty = duties.data.find(
    (duty) =>
      duty.startDate.slice(0, 10) <= today &&
      duty.endDate.slice(0, 10) >= today,
  );
  const nextDuty = duties.data
    .filter((duty) => duty.startDate.slice(0, 10) > today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

  return (
    <div className="flex flex-col gap-5">
      <StatStrip>
        <StatCard
          label={t("manager.overview.rate")}
          value={formatBDT(summary.runningMealRate, locale)}
          hint={t("manager.overview.rateHint", {
            count: n(summary.totalMeals),
          })}
          href={href(`/manager/cycles/${cycleId}`)}
          trend={lastPoints(rateTrend)}
        />
        <StatCard
          label={t("manager.overview.bazar")}
          value={formatBDT(summary.grocery, locale)}
          hint={t("manager.overview.bazarHint", { count: n(groceryCount) })}
          href={href("/manager/expenses")}
          trend={lastPoints(grocerySoFar)}
        />
        <StatCard
          label={t("manager.overview.shared")}
          value={formatBDT(summary.sharedTotal, locale)}
          hint={t("manager.overview.sharedHint")}
          href={href("/manager/expenses")}
          trend={lastPoints(cumulative(trends.data.shared))}
          trendColor="var(--chart-3)"
        />
        <StatCard
          label={t("manager.overview.outstanding")}
          value={formatBDT(owedPrevious?.at(-1) ?? 0, locale)}
          hint={
            !previous
              ? t("manager.overview.outstandingNone")
              : unpaid > 0
                ? t("manager.overview.outstandingHint", {
                    count: n(unpaid),
                    month: previousMonth,
                  })
                : t("manager.overview.outstandingClear", {
                    month: previousMonth,
                  })
          }
          hintClassName={unpaid > 0 ? "text-(--tone-a-fg)" : undefined}
          href={href("/manager/bills")}
          trend={owedPrevious ? lastPoints(owedPrevious) : undefined}
          trendColor="var(--chart-2)"
        />
      </StatStrip>

      <div className="grid gap-4 md:grid-cols-2">
        <TomorrowHeadcount
          cycleId={cycleId}
          year={cycle.data.year}
          month={cycle.data.month}
        />
        <Panel
          title={t("manager.overview.byType")}
          description={t("manager.overview.byTypeSub", { month })}
        >
          {summary.byType.some((row) => row.total > 0) ? (
            <BarList
              items={[...summary.byType]
                .filter((row) => row.total > 0)
                .sort((a, b) => b.total - a.total)
                .map((row) => ({
                  key: row.type,
                  label: t(`expenseTypes.${row.type}`),
                  value: row.total,
                  display: formatBDT(row.total, locale),
                }))}
            />
          ) : (
            <p className="text-muted-foreground">
              {t("manager.cycle.noSpending")}
            </p>
          )}
        </Panel>
      </div>

      <MealsPerDayChart days={trends.data.days} meals={trends.data.meals} />

      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          title={t("manager.overview.perMember")}
          description={t("manager.overview.perMemberSub", { month })}
          action={
            <div className="flex gap-3.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-chart-1" />
                {t("manager.overview.lunch")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-chart-2" />
                {t("manager.overview.dinner")}
              </span>
            </div>
          }
        >
          <BarList
            items={meals.data.members
              .filter((member) => member.totalMeals > 0)
              .map((member) => ({
                key: member.memberId,
                label: member.name.split(" ")[0],
                value: member.totalMeals,
                display: n(member.totalMeals),
                tip: `${member.name}: ${t("manager.overview.mealsOf", {
                  lunch: n(member.lunch),
                  dinner: n(member.dinner),
                })}`,
                segments: [
                  { value: member.lunch, color: "var(--chart-1)" },
                  { value: member.dinner, color: "var(--chart-2)" },
                ],
              }))}
          />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel
            title={t("manager.overview.duty")}
            icon={<ShoppingCartIcon className="size-4 text-primary" />}
          >
            {onDuty || nextDuty ? (
              <ul className="flex flex-col gap-3">
                {[
                  onDuty && { duty: onDuty, tag: "onDuty" as const },
                  nextDuty && { duty: nextDuty, tag: "next" as const },
                ]
                  .filter((row) => !!row)
                  .map(({ duty, tag }) => (
                    <li key={duty.id} className="flex items-center gap-2.5">
                      <UserAvatar name={duty.member.user.name} />
                      <span className="grid flex-1 leading-tight">
                        <span className="font-medium">
                          {duty.member.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(duty.startDate, locale)} –{" "}
                          {formatDate(duty.endDate, locale)}
                        </span>
                      </span>
                      <StatusBadge
                        status={tag}
                        label={t(`manager.overview.${tag}`)}
                        tone={tag === "onDuty" ? "tone-g" : "tone-n"}
                      />
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                {t("manager.overview.noDuty")}
              </p>
            )}
          </Panel>

          <Panel
            flush
            title={t("manager.overview.recent")}
            action={
              <Link
                href={href("/manager/activity")}
                className="text-[13px] font-medium text-primary hover:underline"
              >
                {t("shell.seeAll")}
              </Link>
            }
          >
            {activity.data.length === 0 ? (
              <p className="px-5 py-6 text-muted-foreground">
                {t("manager.overview.noActivity")}
              </p>
            ) : (
              <ul>
                {activity.data.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-start gap-2.5 border-b px-5 py-2.5 last:border-0"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="flex-1 leading-snug">
                      {log.actor.name} · {t(`audit.actions.${log.action}`)}
                      {log.subjectMember && ` - ${log.subjectMember.user.name}`}
                    </span>
                    <span className="text-xs whitespace-nowrap text-muted-foreground">
                      {formatRelative(log.createdAt, locale)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
