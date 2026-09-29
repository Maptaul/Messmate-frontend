"use client";

import { LockIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable, { type Column } from "@/components/ui/data-table";
import { useSuspenseSettlementPreview } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { SettlementBill } from "@/types";
import { formatBDT, formatDate, formatMonth } from "@/utils";
import CloseCycleDialog from "./close-cycle-dialog";

/** What closing the month would produce, and the button that does it. */
export default function SettlementPreview({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const [closeOpen, setCloseOpen] = useState(false);

  const { data } = useSuspenseSettlementPreview(cycleId);

  const preview = data.data;
  const month = formatMonth(preview.cycle.year, preview.cycle.month, locale);
  const warnings = preview.warnings;

  const columns: Column<SettlementBill>[] = [
    {
      key: "member",
      header: t("manager.cycle.member"),
      cell: (bill) => (
        <span className="font-medium">{bill.name ?? bill.memberId}</span>
      ),
    },
    {
      key: "meals",
      header: t("manager.cycle.mealsCol"),
      className: "hidden tabular-nums sm:table-cell",
      cell: (bill) => bill.mealCount,
    },
    {
      key: "mealCost",
      header: t("manager.cycle.mealCost"),
      className: "hidden tabular-nums lg:table-cell",
      cell: (bill) => formatBDT(bill.mealCost, locale),
    },
    {
      key: "shared",
      header: t("manager.cycle.shared"),
      className: "hidden tabular-nums lg:table-cell",
      cell: (bill) => formatBDT(bill.sharedCost, locale),
    },
    {
      key: "rent",
      header: t("manager.cycle.rent"),
      className: "hidden tabular-nums md:table-cell",
      cell: (bill) => formatBDT(bill.rentShare, locale),
    },
    {
      key: "payable",
      header: t("manager.cycle.payable"),
      className: "tabular-nums",
      cell: (bill) => formatBDT(bill.totalPayable, locale),
    },
    {
      key: "deposits",
      header: t("manager.cycle.deposits"),
      className: "hidden tabular-nums md:table-cell",
      cell: (bill) => formatBDT(bill.depositTotal, locale),
    },
    {
      key: "balance",
      header: t("manager.cycle.balance"),
      className: "tabular-nums",
      cell: (bill) =>
        bill.dueAmount > 0 ? (
          <span className="text-destructive">
            {t("manager.cycle.due")} {formatBDT(bill.dueAmount, locale)}
          </span>
        ) : bill.creditAmount > 0 ? (
          <span className="text-emerald-600 dark:text-emerald-400">
            {t("manager.cycle.credit")} {formatBDT(bill.creditAmount, locale)}
          </span>
        ) : (
          t("manager.cycle.settled")
        ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("manager.cycle.previewTitle")}</CardTitle>
        <CardDescription>
          {t("manager.cycle.previewCaption", {
            date: formatDate(preview.asOf, locale),
          })}
        </CardDescription>
        <CardAction>
          <Button onClick={() => setCloseOpen(true)}>
            <LockIcon />
            {t("manager.cycle.close")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {warnings.length > 0 && (
          <Alert>
            <TriangleAlertIcon />
            <AlertTitle>{t("manager.cycle.warnings")}</AlertTitle>
            <AlertDescription>
              <ul className="list-inside list-disc">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <DataTable
          columns={columns}
          rows={preview.bills}
          rowKey={(bill) => bill.memberId}
          caption={t("manager.cycle.previewTitle")}
          empty={{ title: t("manager.members.empty") }}
        />
      </CardContent>

      <CloseCycleDialog
        cycleId={cycleId}
        month={month}
        hasWarnings={warnings.length > 0}
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
      />
    </Card>
  );
}
