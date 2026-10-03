"use client";

import { getCycleMeals } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { MealEntry } from "@/types";
import { EXPORT_PAGE_SIZE } from "@/utils";

export default function MealExport({ cycleId }: { cycleId: string }) {
  const t = useT();
  const { get } = useQueryParams();
  const all = get("tab") === "all";
  const memberId = all ? get("memberId") || undefined : undefined;
  const date = all ? get("day") || undefined : undefined;

  return (
    <ExportCsvButton<MealEntry>
      name="meals"
      fetchPage={(page) =>
        getCycleMeals(cycleId, {
          page,
          limit: EXPORT_PAGE_SIZE,
          memberId,
          date,
        })
      }
      columns={[
        [t("manager.meals.date"), (entry) => entry.date.slice(0, 10)],
        [t("manager.meals.member"), (entry) => entry.member.user.name],
        [t("manager.meals.lunch"), (entry) => entry.lunch],
        [t("manager.meals.dinner"), (entry) => entry.dinner],
        [
          t("manager.meals.summaryTotal"),
          (entry) => entry.lunch + entry.dinner,
        ],
      ]}
    />
  );
}
