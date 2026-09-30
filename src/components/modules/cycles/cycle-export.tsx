"use client";

import { getMessCycles } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { Cycle } from "@/types";
import { cyclesParams, EXPORT_PAGE_SIZE } from "@/utils";

/** Every month matching the status and year filters. */
export default function CycleExport({ messId }: { messId: string }) {
  const t = useT();
  const { get } = useQueryParams();
  const params = cyclesParams(get);

  return (
    <ExportCsvButton<Cycle>
      name="cycles"
      fetchPage={(page) =>
        getMessCycles(messId, { ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("manager.cycles.year"), (cycle) => cycle.year],
        [t("manager.cycles.month"), (cycle) => cycle.month],
        [t("manager.cycles.status"), (cycle) => t(`status.${cycle.status}`)],
        [t("manager.cycles.meals"), (cycle) => cycle.totalMeals],
        [t("manager.cycles.grocery"), (cycle) => cycle.totalGrocery],
        [t("manager.cycles.rate"), (cycle) => cycle.mealRate],
        [t("manager.cycles.closedAt"), (cycle) => cycle.closedAt?.slice(0, 10)],
        [t("manager.cycles.closedByCol"), (cycle) => cycle.closedBy?.name],
      ]}
    />
  );
}
