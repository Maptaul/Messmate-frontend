"use client";

import { getCycleDuties } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import { useT } from "@/i18n/i18n-provider";
import type { GroceryDuty } from "@/types";

export default function DutyExport({ cycleId }: { cycleId: string }) {
  const t = useT();

  return (
    <ExportCsvButton<GroceryDuty>
      name="bazar-duty"
      fetchPage={() => getCycleDuties(cycleId)}
      columns={[
        [t("manager.duty.member"), (duty) => duty.member.user.name],
        [t("manager.duty.from"), (duty) => duty.startDate.slice(0, 10)],
        [t("manager.duty.to"), (duty) => duty.endDate.slice(0, 10)],
        [t("manager.duty.note"), (duty) => duty.note ?? ""],
      ]}
    />
  );
}
