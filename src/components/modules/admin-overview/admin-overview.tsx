"use client";

import {
  Building2Icon,
  CalendarRangeIcon,
  HandCoinsIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/ui/stat-card";
import StatusBadge from "@/components/ui/status-badge";
import { useSuspenseAuditLogs, useSuspenseDashboardStats } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import {
  formatBDT,
  formatDateTime,
  formatNumber,
  RECENT_ACTIVITY_PARAMS,
  toNumber,
} from "@/utils";

export default function AdminOverview() {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const { data: stats } = useSuspenseDashboardStats();
  const { data: activity } = useSuspenseAuditLogs(RECENT_ACTIVITY_PARAMS);

  const { users, messes, cycles, money } = stats.data;

  const collected = toNumber(money.settledPayments);
  const due = toNumber(money.outstandingDue);
  const billed = collected + due;
  const collectedPct = billed > 0 ? Math.round((collected / billed) * 100) : 0;

  const roleConfig = {
    admins: { label: t("roles.ADMIN"), color: "var(--chart-1)" },
    managers: { label: t("roles.MESS_MANAGER"), color: "var(--chart-2)" },
    members: { label: t("roles.MEMBER"), color: "var(--chart-3)" },
  } satisfies ChartConfig;
  const roleData = (["admins", "managers", "members"] as const).map((key) => ({
    key,
    value: users[key],
    fill: `var(--color-${key})`,
  }));

  const moneyConfig = {
    deposits: { label: t("admin.overview.deposits"), color: "var(--chart-1)" },
    expenses: { label: t("admin.overview.expenses"), color: "var(--chart-2)" },
  } satisfies ChartConfig;
  const moneyData = (["deposits", "expenses"] as const).map((key) => ({
    key,
    value: toNumber(money[key]),
    fill: `var(--color-${key})`,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("admin.overview.users")}
          value={formatNumber(users.total, locale)}
          hint={t("admin.overview.usersHint", {
            count: formatNumber(users.blocked, locale),
          })}
          icon={UsersIcon}
        />
        <StatCard
          label={t("admin.overview.messes")}
          value={formatNumber(messes.total, locale)}
          hint={t("admin.overview.messesHint", {
            count: formatNumber(messes.activeMemberships, locale),
          })}
          icon={Building2Icon}
        />
        <StatCard
          label={t("admin.overview.openCycles")}
          value={formatNumber(cycles.open, locale)}
          hint={t("admin.overview.openCyclesHint", {
            count: formatNumber(cycles.closed, locale),
          })}
          icon={CalendarRangeIcon}
        />
        <StatCard
          label={t("admin.overview.outstanding")}
          value={formatBDT(money.outstandingDue, locale)}
          hint={t("admin.overview.outstandingHint")}
          icon={HandCoinsIcon}
          tone={due > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.overview.usersByRole")}</CardTitle>
            <CardDescription>
              {t("admin.overview.usersByRoleCaption", {
                total: formatNumber(users.total, locale),
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={roleConfig}
              className="mx-auto aspect-square max-h-64"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="key" hideLabel />}
                />
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="key"
                  innerRadius={60}
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {roleData.map(({ key, value }) => (
                <li key={key} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-full"
                    style={{ background: roleConfig[key].color }}
                  />
                  {roleConfig[key].label}
                  <span className="font-medium tabular-nums">
                    {formatNumber(value, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.overview.moneyFlow")}</CardTitle>
            <CardDescription>
              {t("admin.overview.moneyFlowCaption")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ChartContainer
              config={moneyConfig}
              className="aspect-[2/1] w-full"
            >
              <BarChart data={moneyData} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="key"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(key: keyof typeof moneyConfig) =>
                    moneyConfig[key].label
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="key"
                      hideLabel
                      formatter={(value) => formatBDT(Number(value), locale)}
                    />
                  }
                />
                <Bar dataKey="value" radius={6} />
              </BarChart>
            </ChartContainer>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-sm">
                <p className="font-medium">{t("admin.overview.collection")}</p>
                <p className="tabular-nums">
                  {formatNumber(collectedPct, locale)}%
                </p>
              </div>
              <Progress value={collectedPct} />
              <p className="text-xs text-muted-foreground">
                {t("admin.overview.collectionCaption", {
                  collected: formatBDT(collected, locale),
                  billed: formatBDT(billed, locale),
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.overview.recentActivity")}</CardTitle>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              render={<Link href={href("/admin/audit-logs")} />}
              nativeButton={false}
            >
              {t("admin.overview.openAuditLog")}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {activity.data.length ? (
            <ul className="divide-y">
              {activity.data.map((log) => (
                <li
                  key={log.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <StatusBadge
                      status={log.action}
                      label={t(`audit.actions.${log.action}`)}
                    />
                    <span className="truncate text-sm">{log.actor.name}</span>
                  </div>
                  <time
                    dateTime={log.createdAt}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDateTime(log.createdAt, locale)}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("admin.overview.noActivity")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
