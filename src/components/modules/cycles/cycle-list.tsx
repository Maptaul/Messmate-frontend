"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { CycleStatus } from "@/types";
import { cyclesParams, formatYear, todayInDhaka } from "@/utils";
import CycleTable from "./cycle-table";
import CycleTableLoading from "./cycle-table-loading";

const statuses: CycleStatus[] = ["OPEN", "CLOSED"];
// The last three years; widen when a mess has older months.
const YEARS_BACK = 3;

export default function CycleList({ messId }: { messId: string }) {
  const t = useT();
  const locale = useLocale();
  const { get, set } = useQueryParams();

  const queryParams = cyclesParams(get);
  const thisYear = Number(todayInDhaka().slice(0, 4));
  const years = Array.from({ length: YEARS_BACK }, (_, i) => thisYear - i);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        <FilterSelect
          label={t("manager.cycles.statusFilter")}
          allLabel={t("manager.cycles.allStatuses")}
          value={queryParams.status}
          options={statuses.map((status) => ({
            value: status,
            label: t(`status.${status}`),
          }))}
          onChange={(status) => set({ status })}
        />
        <FilterSelect
          label={t("manager.cycles.yearFilter")}
          allLabel={t("manager.cycles.allYears")}
          value={queryParams.year ? String(queryParams.year) : undefined}
          options={years.map((year) => ({
            value: String(year),
            label: formatYear(year, locale),
          }))}
          onChange={(year) => set({ year })}
        />
      </div>

      <Suspense fallback={<CycleTableLoading />}>
        <CycleTable
          messId={messId}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
