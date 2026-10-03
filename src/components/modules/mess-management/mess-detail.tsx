"use client";

import { CalendarRangeIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import PageCrumb from "@/components/dashboard/page-crumb";
import AuditChangeDialog from "@/components/modules/audit-logs/audit-change-dialog";
import DataTable, { type Column } from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/ui/user-avatar";
import {
  useSuspenseMess,
  useSuspenseMessAudit,
  useSuspenseMessMembers,
} from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { MessDetail as Mess } from "@/types";
import {
  ALL_MEMBERS_PARAMS,
  auditTone,
  formatBDT,
  formatDate,
  formatDateTime,
  formatMonth,
  formatNumber,
  MESS_ACTIVITY_PARAMS,
} from "@/utils";
import CycleReopenActions from "./cycle-reopen-actions";

type RecentCycle = Mess["cycles"][number];

export default function MessDetail({ messId }: { messId: string }) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseMess(messId);
  const { data: members } = useSuspenseMessMembers(messId, ALL_MEMBERS_PARAMS);
  const { data: activity } = useSuspenseMessAudit(messId, MESS_ACTIVITY_PARAMS);

  const mess = data.data;
  const active = members.data.filter((member) => member.status === "ACTIVE");

  const facts = [
    {
      label: t("admin.messDetail.manager"),
      value: (
        <Link
          href={href(`/admin/users/${mess.manager.id}`)}
          className="text-foreground hover:underline"
        >
          {mess.manager.name}
        </Link>
      ),
    },
    {
      label: t("admin.messDetail.rent"),
      value: formatBDT(mess.monthlyRent, locale),
    },
    {
      label: t("admin.messes.advance"),
      value: t("admin.messDetail.perMember", {
        amount: formatBDT(mess.monthlyDeposit, locale),
      }),
    },
    {
      label: t("admin.messes.members"),
      value: t("admin.messDetail.activeCount", {
        count: formatNumber(active.length, locale),
      }),
    },
  ];

  const columns: Column<RecentCycle>[] = [
    {
      key: "month",
      header: t("admin.messDetail.month"),
      cell: (cycle) => (
        <span className="font-medium">
          {formatMonth(cycle.year, cycle.month, locale)}
        </span>
      ),
    },
    {
      key: "status",
      header: t("admin.messDetail.status"),
      cell: (cycle) => <StatusBadge status={cycle.status} />,
    },
    {
      key: "meals",
      header: t("admin.messDetail.meals"),
      className: "text-right tabular-nums",
      cell: (cycle) =>
        cycle.totalMeals === null
          ? "-"
          : formatNumber(cycle.totalMeals, locale),
    },
    {
      key: "grocery",
      header: t("admin.messDetail.grocery"),
      className: "text-right tabular-nums",
      cell: (cycle) =>
        cycle.totalGrocery === null
          ? "-"
          : formatBDT(cycle.totalGrocery, locale),
    },
    {
      key: "rate",
      header: t("admin.messDetail.rate"),
      className: "text-right tabular-nums",
      cell: (cycle) =>
        cycle.mealRate === null ? "-" : formatBDT(cycle.mealRate, locale),
    },
    {
      key: "closed",
      header: t("admin.messDetail.closed"),
      className: "text-muted-foreground",
      cell: (cycle) =>
        cycle.closedAt
          ? t("admin.messDetail.closedBy", {
              date: formatDate(cycle.closedAt, locale),
              name: cycle.closedBy?.name ?? "-",
            })
          : "-",
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("admin.messDetail.reopen")}</span>,
      className: "text-right",
      cell: (cycle) =>
        cycle.status === "CLOSED" ? (
          <CycleReopenActions
            cycleId={cycle.id}
            year={cycle.year}
            month={cycle.month}
          />
        ) : null,
    },
  ];

  return (
    <>
      <PageCrumb label={mess.name} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-xl border bg-card px-4 py-3.5 shadow-1"
          >
            <p className="text-xs font-medium text-muted-foreground">
              {fact.label}
            </p>
            <p className="mt-0.5 font-semibold">{fact.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="cycles" className="gap-4">
        <TabsList>
          <TabsTrigger value="cycles">
            {t("admin.messDetail.tabCycles")}
          </TabsTrigger>
          <TabsTrigger value="members">
            {t("admin.messDetail.tabMembers")}
          </TabsTrigger>
          <TabsTrigger value="activity">
            {t("admin.messDetail.tabActivity")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cycles" className="flex flex-col gap-3">
          <DataTable
            columns={columns}
            rows={mess.cycles}
            rowKey={(cycle) => cycle.id}
            caption={t("admin.messDetail.monthsTitle")}
            empty={{
              icon: CalendarRangeIcon,
              title: t("admin.messDetail.monthsEmpty"),
            }}
          />
          <p className="text-xs text-muted-foreground">
            {t("admin.messDetail.reopenNote")}
          </p>
        </TabsContent>

        <TabsContent value="members">
          {members.data.length === 0 ? (
            <EmptyState
              icon={CalendarRangeIcon}
              title={t("admin.messDetail.membersEmpty")}
            />
          ) : (
            <ul className="overflow-hidden rounded-xl border bg-card shadow-1">
              {members.data.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center gap-3 border-b px-4 py-2.5 last:border-0"
                >
                  <UserAvatar
                    name={member.user.name}
                    src={member.user.avatarUrl}
                  />
                  <Link
                    href={href(`/admin/users/${member.user.id}`)}
                    className="grid min-w-0 flex-1 leading-tight text-foreground"
                  >
                    <span className="truncate font-medium">
                      {member.user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {member.user.email}
                    </span>
                  </Link>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {member.leftAt
                      ? t("admin.messDetail.leftOn", {
                          date: formatDate(member.leftAt, locale),
                        })
                      : t("admin.userDetail.joinedOn", {
                          date: formatDate(member.joinedAt, locale),
                        })}
                  </span>
                  <StatusBadge status={member.status} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="activity">
          {activity.data.length === 0 ? (
            <EmptyState
              icon={HistoryIcon}
              title={t("admin.messDetail.activityEmpty")}
            />
          ) : (
            <ul className="overflow-hidden rounded-xl border bg-card shadow-1">
              {activity.data.map((log) => (
                <li
                  key={log.id}
                  className="flex flex-wrap items-center gap-3 border-b px-4 py-2.5 last:border-0"
                >
                  <span className="w-30 text-xs whitespace-nowrap text-muted-foreground">
                    {formatDateTime(log.createdAt, locale)}
                  </span>
                  <span className="font-medium">{log.actor.name}</span>
                  <StatusBadge
                    status={log.action}
                    label={t(`audit.actions.${log.action}`)}
                    tone={auditTone(log.action)}
                  />
                  <span className="flex-1 text-muted-foreground">
                    {log.subjectMember?.user.name ?? log.entity}
                  </span>
                  <AuditChangeDialog log={log} variant="link" />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
