"use client";

import { ChefHatIcon, LockIcon, UsersIcon, UtensilsIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseCycleCalendar } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { CycleCalendarDay } from "@/types";
import { formatDeadline, formatNumber } from "@/utils";

type Row = CycleCalendarDay["members"][number];

export default function HeadcountTable({
  cycleId,
  date,
}: {
  cycleId: string;
  date: string;
}) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycleCalendar(cycleId, date);

  // The API leaves out days nobody eats, so "no day" simply means zero.
  const day = data.data.days.find((entry) => entry.date === date);

  const columns: Column<Row>[] = [
    {
      key: "member",
      header: t("manager.headcount.member"),
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "lunch",
      header: t("manager.headcount.lunch"),
      className: "tabular-nums",
      cell: (row) => formatNumber(row.lunch, locale),
    },
    {
      key: "dinner",
      header: t("manager.headcount.dinner"),
      className: "tabular-nums",
      cell: (row) => formatNumber(row.dinner, locale),
    },
    {
      key: "source",
      header: t("manager.headcount.source"),
      className: "hidden sm:table-cell",
      cell: (row) => (
        <Badge variant="outline">
          {t(
            row.isDefault
              ? "manager.headcount.fromDefault"
              : "manager.headcount.planned",
          )}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t("manager.headcount.lunch")}
          value={formatNumber(day?.lunch ?? 0, locale)}
          icon={UtensilsIcon}
        />
        <StatCard
          label={t("manager.headcount.dinner")}
          value={formatNumber(day?.dinner ?? 0, locale)}
          icon={ChefHatIcon}
        />
        <StatCard
          label={t("manager.headcount.total")}
          value={formatNumber((day?.lunch ?? 0) + (day?.dinner ?? 0), locale)}
          icon={UsersIcon}
        />
      </div>

      {day && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {day.isLocked && <LockIcon className="size-4" aria-hidden />}
          {day.isLocked
            ? t("manager.headcount.locked")
            : t("manager.headcount.open", {
                time: formatDeadline(day.deadline, locale),
              })}
        </p>
      )}

      <DataTable
        columns={columns}
        rows={day?.members ?? []}
        rowKey={(row) => row.memberId}
        caption={t("manager.headcount.caption")}
        empty={{
          icon: UsersIcon,
          title: t("manager.headcount.empty"),
          description: t("manager.headcount.emptyHint"),
        }}
      />
    </div>
  );
}
