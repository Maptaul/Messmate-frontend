"use client";

import { FileSpreadsheetIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useExportRows } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import {
  downloadCsv,
  type fetchAllPages,
  getErrorMessage,
  toCsv,
  todayInDhaka,
} from "@/utils";

type Cell = string | number | null | undefined;

/** One CSV column: its header and how a row fills it. */
export type CsvColumn<T> = [header: string, cell: (row: T) => Cell];

/**
 * Exports every row that matches the table's current filters, not only the
 * visible page, as messmate-<name>-YYYY-MM-DD.csv. Numbers stay plain so a
 * spreadsheet can add them up.
 */
export default function ExportCsvButton<T>({
  name,
  fetchPage,
  columns,
}: {
  name: string;
  fetchPage: Parameters<typeof fetchAllPages<T>>[0];
  columns: CsvColumn<T>[];
}) {
  const t = useT();
  const { mutate, isPending } = useExportRows<T>();

  const handleExport = () => {
    mutate(fetchPage, {
      onSuccess: (rows) => {
        if (rows.length === 0) {
          toast.error(t("common.nothingToExport"));
          return;
        }
        const csv = toCsv([
          columns.map(([header]) => header),
          ...rows.map((row) => columns.map(([, cell]) => cell(row))),
        ]);
        downloadCsv(csv, `messmate-${name}-${todayInDhaka()}.csv`);
        toast.success(
          rows.length === 1
            ? t("common.exportedOne")
            : t("common.exportedMany", { count: rows.length }),
        );
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <Button
      variant="outline"
      className="shrink-0 bg-card"
      onClick={handleExport}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <FileSpreadsheetIcon />}
      {t("common.exportCsv")}
    </Button>
  );
}
