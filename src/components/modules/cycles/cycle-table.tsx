"use client";

import { CalendarRangeIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseMessCycles } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { Cycle, CycleListParams } from "@/types";
import { formatBDT, formatDate, formatMonth, formatNumber } from "@/utils";

interface Props extends CycleListParams {
  messId: string;
  handlePageChange: (page: number) => void;
}

const dash = "—";

export default function CycleTable({
  messId,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseMessCycles(messId, params);

  const cycles = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<Cycle>[] = [
    {
      key: "month",
      header: t("manager.cycles.monthCol"),
      cell: (cycle) => (
        <span className="font-medium">
          {formatMonth(cycle.year, cycle.month, locale)}
        </span>
      ),
    },
    {
      key: "status",
      header: t("manager.cycles.status"),
      cell: (cycle) => <StatusBadge status={cycle.status} />,
    },
    {
      key: "meals",
      header: t("manager.cycles.meals"),
      className: "hidden tabular-nums sm:table-cell",
      cell: (cycle) =>
        cycle.totalMeals === null
          ? dash
          : formatNumber(cycle.totalMeals, locale),
    },
    {
      key: "grocery",
      header: t("manager.cycles.grocery"),
      className: "hidden tabular-nums md:table-cell",
      cell: (cycle) =>
        cycle.totalGrocery === null
          ? dash
          : formatBDT(cycle.totalGrocery, locale),
    },
    {
      key: "rate",
      header: t("manager.cycles.rate"),
      className: "hidden tabular-nums md:table-cell",
      cell: (cycle) =>
        cycle.mealRate === null ? dash : formatBDT(cycle.mealRate, locale),
    },
    {
      key: "closed",
      header: t("manager.cycles.closedOn"),
      className: "hidden lg:table-cell",
      cell: (cycle) =>
        cycle.closedAt ? formatDate(cycle.closedAt, locale) : dash,
    },
    {
      key: "view",
      header: <span className="sr-only">{t("manager.cycles.view")}</span>,
      className: "text-right",
      cell: (cycle) => (
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={href(`/manager/cycles/${cycle.id}`)} />}
          nativeButton={false}
        >
          {t("manager.cycles.view")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={cycles}
        rowKey={(cycle) => cycle.id}
        caption={t("manager.cycles.caption")}
        empty={{
          icon: CalendarRangeIcon,
          title: t("manager.cycles.empty"),
          description: t("manager.cycles.emptyHint"),
        }}
      />
      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
