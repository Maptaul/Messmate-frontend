"use client";

import { getFinanceEntries } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { FinanceEntry } from "@/types";
import { EXPORT_PAGE_SIZE, financeEntriesParams } from "@/utils";

export default function FinanceExport() {
  const t = useT();
  const { get } = useQueryParams();
  const params = financeEntriesParams(get);

  return (
    <ExportCsvButton<FinanceEntry>
      name="finance"
      fetchPage={(page) =>
        getFinanceEntries({ ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("finance.date"), (entry) => entry.date.slice(0, 10)],
        [t("finance.type"), (entry) => t(`status.${entry.type}`)],
        [
          t("finance.category"),
          (entry) => t.dynamic(`finance.categories.${entry.category}`),
        ],
        [t("finance.note"), (entry) => entry.note ?? ""],
        [t("finance.amount"), (entry) => entry.amount],
      ]}
    />
  );
}
