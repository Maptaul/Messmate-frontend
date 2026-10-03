"use client";

import { CalendarRangeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseExpenseSummary, useSuspenseMessCycles } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { Cycle, CycleListParams } from "@/types";
import { formatBDT, formatDate, formatMonth, formatNumber } from "@/utils";

interface Props extends CycleListParams {
  messId: string;
  handlePageChange: (page: number) => void;
}

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

  const closedLine = (cycle: Cycle) => {
    if (!cycle.closedAt) return t("manager.cycles.running");
    const date = formatDate(cycle.closedAt, locale);
    return cycle.closedBy
      ? t("manager.cycles.closedBy", { date, name: cycle.closedBy.name })
      : t("manager.cycles.closedOn", { date });
  };

  if (cycles.length === 0) {
    return (
      <EmptyState
        icon={CalendarRangeIcon}
        title={t("manager.cycles.empty")}
        description={t("manager.cycles.emptyHint")}
      />
    );
  }

  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(16.25rem,1fr))] gap-4">
        {cycles.map((cycle) => (
          <li key={cycle.id}>
            <Link
              href={href(`/manager/cycles/${cycle.id}`)}
              className="flex h-full flex-col gap-3 rounded-xl border bg-card px-5 py-4.5 shadow-1 transition-colors hover:border-ring"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-semibold">
                  {formatMonth(cycle.year, cycle.month, locale)}
                </span>
                <StatusBadge status={cycle.status} />
              </span>
              {cycle.status === "OPEN" ? (
                <Suspense fallback={<Figures />}>
                  <RunningFigures cycleId={cycle.id} />
                </Suspense>
              ) : (
                <Figures
                  meals={cycle.totalMeals}
                  grocery={cycle.totalGrocery}
                  rate={cycle.mealRate}
                />
              )}
              <span className="text-xs text-muted-foreground">
                {closedLine(cycle)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <TablePagination
        page={params.page ?? 1}
        totalPages={data?.meta?.totalPages ?? 0}
        total={data?.meta?.total}
        limit={data?.meta?.limit}
        handlePageChange={handlePageChange}
      />
    </>
  );
}

/** An open month has no stored totals yet; show the running ones. */
function RunningFigures({ cycleId }: { cycleId: string }) {
  const { data } = useSuspenseExpenseSummary(cycleId);
  const summary = data.data;

  return (
    <Figures
      meals={summary.totalMeals}
      grocery={summary.grocery}
      rate={summary.runningMealRate}
    />
  );
}

function Figures({
  meals,
  grocery,
  rate,
}: {
  meals?: number | null;
  grocery?: number | string | null;
  rate?: number | string | null;
}) {
  const t = useT();
  const locale = useLocale();
  const dash = "-";

  return (
    <span className="grid grid-cols-3 gap-2 text-[13px]">
      {[
        [
          t("manager.cycles.meals"),
          meals == null ? dash : formatNumber(meals, locale),
        ],
        [
          t("manager.cycles.grocery"),
          grocery == null ? dash : formatBDT(grocery, locale),
        ],
        [
          t("manager.cycles.rate"),
          rate == null ? dash : formatBDT(rate, locale),
        ],
      ].map(([label, value]) => (
        <span key={label} className="flex flex-col">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold tabular-nums">{value}</span>
        </span>
      ))}
    </span>
  );
}
