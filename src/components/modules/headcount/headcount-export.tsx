"use client";

import { getCycleCalendar } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { CycleCalendarDay } from "@/types";
import { registerDate, todayInDhaka } from "@/utils";

type Row = CycleCalendarDay["members"][number];

export default function HeadcountExport({
  cycleId,
  year,
  month,
}: {
  cycleId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const { get } = useQueryParams();
  const date = registerDate(get("date"), year, month, todayInDhaka());

  return (
    <ExportCsvButton<Row>
      name={`headcount-${date}`}
      fetchPage={async () => {
        const { data } = await getCycleCalendar(cycleId, date);
        const day = data.days.find((entry) => entry.date.startsWith(date));
        return { data: day?.members ?? [] };
      }}
      columns={[
        [t("manager.headcount.member"), (row) => row.name],
        [t("manager.headcount.lunch"), (row) => row.lunch],
        [t("manager.headcount.dinner"), (row) => row.dinner],
        [
          t("manager.headcount.source"),
          (row) => t(row.isDefault ? "status.DEFAULT" : "status.PLANNED"),
        ],
      ]}
    />
  );
}
