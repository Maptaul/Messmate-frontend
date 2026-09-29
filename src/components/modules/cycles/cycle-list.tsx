"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { CycleStatus } from "@/types";
import { cyclesParams } from "@/utils";
import CycleTable from "./cycle-table";
import CycleTableLoading from "./cycle-table-loading";
import OpenCycleDialog from "./open-cycle-dialog";

const statuses: CycleStatus[] = ["OPEN", "CLOSED"];

export default function CycleList({ messId }: { messId: string }) {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = cyclesParams(get);

  return (
    <>
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        <OpenCycleDialog messId={messId} />
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
