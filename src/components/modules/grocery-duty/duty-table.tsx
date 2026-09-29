"use client";

import { ShoppingCartIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import { useSuspenseCycleDuties } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { GroceryDuty } from "@/types";
import { formatDate, formatNumber } from "@/utils";
import DutyActions from "./duty-actions";

const DAY_MS = 24 * 60 * 60 * 1000;
const daysBetween = (start: string, end: string) =>
  Math.round(
    (Date.parse(end.slice(0, 10)) - Date.parse(start.slice(0, 10))) / DAY_MS,
  ) + 1;

export default function DutyTable({
  cycleId,
  messId,
  year,
  month,
  locked,
}: {
  cycleId: string;
  messId: string;
  year: number;
  month: number;
  locked: boolean;
}) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycleDuties(cycleId);

  const duties = data?.data ?? [];

  const columns: Column<GroceryDuty>[] = [
    {
      key: "member",
      header: t("manager.duty.member"),
      cell: (duty) => (
        <div className="min-w-0">
          <p className="font-medium">{duty.member.user.name}</p>
          {duty.note && (
            <p className="max-w-56 truncate text-xs text-muted-foreground">
              {duty.note}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "range",
      header: `${t("manager.duty.from")} – ${t("manager.duty.to")}`,
      className: "whitespace-nowrap",
      cell: (duty) =>
        `${formatDate(duty.startDate, locale)} – ${formatDate(duty.endDate, locale)}`,
    },
    {
      key: "days",
      header: t("manager.duty.days"),
      className: "hidden tabular-nums sm:table-cell",
      cell: (duty) =>
        t("manager.duty.dayCount", {
          count: formatNumber(
            daysBetween(duty.startDate, duty.endDate),
            locale,
          ),
        }),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.duty.actions")}</span>,
      className: "text-right",
      cell: (duty) =>
        locked ? null : (
          <DutyActions
            duty={duty}
            cycleId={cycleId}
            messId={messId}
            year={year}
            month={month}
          />
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={duties}
      rowKey={(duty) => duty.id}
      caption={t("manager.duty.caption")}
      empty={{
        icon: ShoppingCartIcon,
        title: t("manager.duty.empty"),
        description: t("manager.duty.emptyHint"),
      }}
    />
  );
}
