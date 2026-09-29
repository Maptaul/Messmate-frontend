"use client";

import { CalendarRangeIcon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { useSuspenseMess, useSuspenseMessMembers } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { MessDetail as Mess } from "@/types";
import {
  ACTIVE_MEMBERS_PARAMS,
  formatBDT,
  formatDate,
  formatMonth,
  formatNumber,
} from "@/utils";
import CycleReopenActions from "./cycle-reopen-actions";

type RecentCycle = Mess["cycles"][number];

export default function MessDetail({ messId }: { messId: string }) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseMess(messId);
  const { data: members } = useSuspenseMessMembers(
    messId,
    ACTIVE_MEMBERS_PARAMS,
  );

  const mess = data.data;

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
      className: "hidden tabular-nums sm:table-cell",
      cell: (cycle) =>
        cycle.totalMeals === null
          ? "—"
          : formatNumber(cycle.totalMeals, locale),
    },
    {
      key: "rate",
      header: t("admin.messDetail.rate"),
      className: "hidden tabular-nums sm:table-cell",
      cell: (cycle) =>
        cycle.mealRate === null ? "—" : formatBDT(cycle.mealRate, locale),
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.messDetail.infoTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">
                  {t("admin.messDetail.manager")}
                </dt>
                <dd className="text-right">
                  <Link
                    href={href(`/admin/users/${mess.manager.id}`)}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {mess.manager.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {mess.manager.email}
                  </p>
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">
                  {t("admin.messDetail.address")}
                </dt>
                <dd className="text-right">{mess.address}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">
                  {t("admin.messDetail.rent")}
                </dt>
                <dd className="tabular-nums">
                  {formatBDT(mess.monthlyRent, locale)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">
                  {t("admin.messDetail.deposit")}
                </dt>
                <dd className="tabular-nums">
                  {formatBDT(mess.monthlyDeposit, locale)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">
                  {t("admin.messDetail.created")}
                </dt>
                <dd>{formatDate(mess.createdAt, locale)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("admin.messDetail.membersTitle")}</CardTitle>
            <CardDescription>
              {t("admin.messDetail.membersCount", {
                count: formatNumber(members.data.length, locale),
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("admin.messDetail.membersEmpty")}
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {members.data.map((member) => (
                  <li
                    key={member.id}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <UserAvatar
                      name={member.user.name}
                      src={member.user.avatarUrl}
                    />
                    <div className="min-w-0">
                      <Link
                        href={href(`/admin/users/${member.user.id}`)}
                        className="block truncate font-medium underline-offset-4 hover:underline"
                      >
                        {member.user.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">
            {t("admin.messDetail.monthsTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("admin.messDetail.monthsCaption")}
          </p>
        </div>
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
      </div>
    </div>
  );
}
