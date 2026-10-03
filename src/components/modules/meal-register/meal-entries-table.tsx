"use client";

import { UtensilsIcon } from "lucide-react";
import { Suspense } from "react";
import DataTable, { type Column } from "@/components/ui/data-table";
import FilterSelect from "@/components/ui/filter-select";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseCycleMeals, useSuspenseMealSummary } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MealEntry, MealListParams } from "@/types";
import { formatDate, formatNumber, PAGE_SIZE } from "@/utils";
import MealEntryActions from "./meal-entry-actions";
import MealRegisterLoading from "./meal-register-loading";

export default function MealEntriesTable({
  cycleId,
  year,
  month,
  locked,
}: {
  cycleId: string;
  year: number;
  month: number;
  locked: boolean;
}) {
  const t = useT();
  const { get, set } = useQueryParams();
  const { data: summary } = useSuspenseMealSummary(cycleId);

  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const params: MealListParams = {
    page: Math.max(Number(get("page")) || 1, 1),
    limit: PAGE_SIZE,
    memberId: get("memberId") || undefined,
    date: get("day") || undefined,
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <FilterSelect
          label={t("manager.meals.memberFilter")}
          allLabel={t("manager.meals.allMembers")}
          value={params.memberId}
          options={summary.data.members.map((member) => ({
            value: member.memberId,
            label: member.name,
          }))}
          onChange={(memberId) => set({ memberId })}
        />
        <Input
          type="date"
          aria-label={t("manager.meals.dateFilter")}
          className="w-full sm:w-44"
          min={`${prefix}-01`}
          max={`${prefix}-${String(last).padStart(2, "0")}`}
          value={params.date ?? ""}
          onChange={(event) => set({ day: event.target.value || undefined })}
        />
      </div>
      <Suspense fallback={<MealRegisterLoading />}>
        <Entries
          cycleId={cycleId}
          params={params}
          locked={locked}
          onPage={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}

function Entries({
  cycleId,
  params,
  locked,
  onPage,
}: {
  cycleId: string;
  params: MealListParams;
  locked: boolean;
  onPage: (page: number) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);

  const { data } = useSuspenseCycleMeals(cycleId, params);

  const columns: Column<MealEntry>[] = [
    {
      key: "date",
      header: t("manager.meals.date"),
      className: "whitespace-nowrap",
      cell: (entry) => formatDate(entry.date, locale),
    },
    {
      key: "member",
      header: t("manager.meals.member"),
      cell: (entry) => entry.member.user.name,
    },
    {
      key: "lunch",
      header: t("manager.meals.lunch"),
      className: "text-right tabular-nums",
      cell: (entry) => n(entry.lunch),
    },
    {
      key: "dinner",
      header: t("manager.meals.dinner"),
      className: "text-right tabular-nums",
      cell: (entry) => n(entry.dinner),
    },
    {
      key: "total",
      header: t("manager.meals.summaryTotal"),
      className: "text-right font-semibold tabular-nums",
      cell: (entry) => n(entry.lunch + entry.dinner),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.meals.actions")}</span>,
      className: "text-right",
      cell: (entry) =>
        locked ? null : (
          <MealEntryActions entry={entry} name={entry.member.user.name} />
        ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={data.data}
        rowKey={(entry) => entry.id}
        caption={t("manager.meals.entries")}
        empty={{
          icon: UtensilsIcon,
          title: t("manager.meals.entriesEmpty"),
          description: t("manager.meals.entriesEmptyHint"),
        }}
      />
      <TablePagination
        page={params.page ?? 1}
        totalPages={data.meta?.totalPages ?? 0}
        total={data.meta?.total}
        limit={data.meta?.limit}
        handlePageChange={onPage}
      />
    </>
  );
}
