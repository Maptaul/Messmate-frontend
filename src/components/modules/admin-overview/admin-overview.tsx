"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import BarList from "@/components/ui/bar-list";
import { Button } from "@/components/ui/button";
import Panel from "@/components/ui/panel";
import StatCard from "@/components/ui/stat-card";
import StatStrip from "@/components/ui/stat-strip";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import {
  useSuspenseAuditLogs,
  useSuspenseDashboardStats,
  useSuspenseDashboardTrends,
} from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import {
  auditTone,
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
  const { data: trends } = useSuspenseDashboardTrends();
  const { data: activity } = useSuspenseAuditLogs(RECENT_ACTIVITY_PARAMS);

  const { users, messes, cycles, money } = stats.data;
  const n = (value: number) => formatNumber(value, locale);

  // Everything billed is either settled or still owed.
  const settled = toNumber(money.settledPayments);
  const due = toNumber(money.outstandingDue);
  const billed = settled + due;
  const collectedPct =
    billed > 0 ? Math.round((settled / billed) * 1000) / 10 : 0;
  const totalCycles = cycles.open + cycles.closed;
  const openShare = totalCycles > 0 ? (cycles.open / totalCycles) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <StatStrip>
        <StatCard
          label={t("admin.overview.users")}
          value={n(users.total)}
          hint={t("admin.overview.usersHint", { count: n(users.blocked) })}
          hintClassName="text-(--tone-r-fg)"
          href={href("/admin/users")}
          trend={trends.data.users}
          trendColor="var(--chart-3)"
        />
        <StatCard
          label={t("admin.overview.messes")}
          value={n(messes.total)}
          hint={t("admin.overview.messesHint", {
            count: n(messes.activeMemberships),
          })}
          href={href("/admin/messes")}
          trend={trends.data.messes}
        />
        <StatCard
          label={t("admin.overview.openCycles")}
          value={n(cycles.open)}
          hint={t("admin.overview.openCyclesHint", { count: n(cycles.closed) })}
          href={href("/admin/messes")}
          trend={trends.data.openCycles}
        />
        <StatCard
          label={t("admin.overview.outstanding")}
          value={formatBDT(due, locale)}
          hint={t("admin.overview.outstandingHint")}
          hintClassName="text-(--tone-a-fg)"
          href={href("/admin/messes")}
          trend={trends.data.outstandingDue}
          trendColor="var(--chart-2)"
        />
      </StatStrip>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          title={t("admin.overview.usersByRole")}
          description={t("admin.overview.usersByRoleCaption", {
            total: n(users.total),
          })}
        >
          <BarList
            barClassName="h-5.5"
            items={[
              ["members", t("admin.overview.roleMembers"), users.members],
              ["managers", t("admin.overview.roleManagers"), users.managers],
              ["admins", t("admin.overview.roleAdmins"), users.admins],
            ].map(([key, label, value]) => ({
              key: key as string,
              label: label as string,
              value: value as number,
              display: n(value as number),
            }))}
          />
        </Panel>

        <Panel
          title={t("admin.overview.collection")}
          description={t("admin.overview.collectionSub")}
        >
          <div className="flex flex-col gap-4">
            <p className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">
                {n(collectedPct)}%
              </span>
              <span className="text-muted-foreground">
                {t("admin.overview.collectedWord")}
              </span>
            </p>
            <div
              aria-hidden
              title={`${t("admin.overview.settled")} ${formatBDT(settled, locale)} / ${formatBDT(billed, locale)}`}
              className="h-3 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-chart-1"
                style={{ width: `${collectedPct}%` }}
              />
            </div>
            <div className="flex flex-wrap justify-between gap-3 text-[13px]">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-chart-1" />
                <span className="text-muted-foreground">
                  {t("admin.overview.settled")}
                </span>
                <b className="tabular-nums">{formatBDT(settled, locale)}</b>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] border bg-muted" />
                <span className="text-muted-foreground">
                  {t("admin.overview.outstandingLegend")}
                </span>
                <b className="tabular-nums">{formatBDT(due, locale)}</b>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("admin.overview.billedSoFar", {
                amount: formatBDT(billed, locale),
              })}
            </p>
          </div>
        </Panel>

        <Panel
          title={t("admin.overview.moneyFlow")}
          description={t("admin.overview.moneyFlowCaption")}
        >
          <BarList
            barClassName="h-5.5"
            items={[
              {
                key: "deposits",
                label: t("admin.overview.deposits"),
                value: toNumber(money.deposits),
                display: formatBDT(money.deposits, locale),
              },
              {
                key: "expenses",
                label: t("admin.overview.expenses"),
                value: toNumber(money.expenses),
                display: formatBDT(money.expenses, locale),
                color: "var(--muted-foreground)",
              },
            ]}
          />
        </Panel>

        <Panel
          title={t("admin.overview.cycles")}
          description={t("admin.overview.cyclesCaption", {
            count: n(totalCycles),
            messes: n(messes.total),
          })}
        >
          <div className="flex flex-col gap-4">
            <div
              className="flex h-5.5 gap-0.5"
              title={`${t("status.OPEN")} ${n(cycles.open)} · ${t("status.CLOSED")} ${n(cycles.closed)}`}
            >
              <div
                className="rounded-l-sm bg-chart-1"
                style={{ width: `${openShare}%` }}
              />
              <div className="flex-1 rounded-r-sm border bg-muted" />
            </div>
            <div className="flex flex-wrap gap-5 text-[13px]">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-chart-1" />
                <span className="text-muted-foreground">
                  {t("status.OPEN")}
                </span>
                <b>{n(cycles.open)}</b>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] border bg-muted" />
                <span className="text-muted-foreground">
                  {t("status.CLOSED")}
                </span>
                <b>{n(cycles.closed)}</b>
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        flush
        title={t("admin.overview.recentActivity")}
        description={t("admin.overview.recentSub")}
        action={
          <Button
            variant="outline"
            size="sm"
            render={<Link href={href("/admin/audit-logs")} />}
            nativeButton={false}
          >
            {t("admin.overview.openAuditLog")}
            <ArrowRightIcon />
          </Button>
        }
      >
        {activity.data.length ? (
          <ul>
            {activity.data.map((log) => (
              <li
                key={log.id}
                className="flex flex-wrap items-center gap-3 border-b px-5 py-2.5 last:border-0"
              >
                <UserAvatar name={log.actor.name} className="size-7" />
                <span className="font-medium">{log.actor.name}</span>
                <StatusBadge
                  status={log.action}
                  label={t(`audit.actions.${log.action}`)}
                  tone={auditTone(log.action)}
                />
                <span className="min-w-30 flex-1 truncate text-muted-foreground">
                  {log.subjectMember?.user.name ?? log.entity}
                </span>
                <time
                  dateTime={log.createdAt}
                  className="text-xs whitespace-nowrap text-muted-foreground"
                >
                  {formatDateTime(log.createdAt, locale)}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-muted-foreground">
            {t("admin.overview.noActivity")}
          </p>
        )}
      </Panel>
    </div>
  );
}
