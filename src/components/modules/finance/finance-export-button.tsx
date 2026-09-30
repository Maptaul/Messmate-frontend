"use client";

import { FileSpreadsheetIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExportFinanceEntries } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { FinanceEntryParams } from "@/types";
import {
  downloadCsv,
  getErrorMessage,
  toCsv,
  todayInDhaka,
  toNumber,
} from "@/utils";

/** Downloads every entry matching the current filters, not just this page. */
export default function FinanceExportButton({
  params,
}: {
  params: FinanceEntryParams;
}) {
  const t = useT();

  const { mutate: exportEntries, isPending } = useExportFinanceEntries();

  const handleExport = () => {
    exportEntries(params, {
      onSuccess: (entries) => {
        const rows = [
          [
            t("finance.date"),
            t("finance.type"),
            t("finance.category"),
            t("finance.amount"),
            t("finance.note"),
          ],
          // Numbers stay plain so a spreadsheet can add them up.
          ...entries.map((entry) => [
            entry.date.slice(0, 10),
            t(`status.${entry.type}`),
            t(`finance.categories.${entry.category}`),
            toNumber(entry.amount),
            entry.note,
          ]),
        ];
        downloadCsv(toCsv(rows), `messmate-finance-${todayInDhaka()}.csv`);
        toast.success(t("toast.exported", { count: entries.length }));
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={isPending}>
      {isPending ? <Spinner /> : <FileSpreadsheetIcon />}
      {isPending ? t("finance.exporting") : t("finance.export")}
    </Button>
  );
}
