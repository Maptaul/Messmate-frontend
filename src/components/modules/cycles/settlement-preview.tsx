"use client";

import { TriangleAlertIcon } from "lucide-react";
import { useSuspenseSettlementPreview } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatBDT, formatDateTime } from "@/utils";
import SettlementTable from "./settlement-table";

export default function SettlementPreview({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const money = (value: number) => formatBDT(value, locale);

  const { data } = useSuspenseSettlementPreview(cycleId);
  const preview = data.data;

  return (
    <>
      {preview.warnings.length > 0 && (
        <div
          role="alert"
          className="tone-a flex gap-2.5 rounded-xl border px-4 py-3"
        >
          <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">{t("manager.cycle.warnings")}</span>
            {preview.warnings.map((warning) => (
              <span key={warning}>{t.dynamic(warning)}</span>
            ))}
          </div>
        </div>
      )}

      <SettlementTable
        title={t("manager.cycle.previewTitle")}
        caption={t("manager.cycle.previewCaption", {
          date: formatDateTime(preview.asOf, locale),
        })}
        rows={[...preview.bills]
          .sort((a, b) => b.dueAmount - a.dueAmount)
          .map((bill) => ({
            id: bill.memberId,
            name: bill.name ?? bill.memberId,
            meals: bill.mealCount,
            mealCost: bill.mealCost,
            shared: bill.sharedCost,
            rent: bill.rentShare,
            advance: bill.advanceCharged,
            opening: bill.openingBalance,
            total: bill.totalPayable,
            credit: bill.creditAmount,
            due: bill.dueAmount,
            detail: (
              <>
                {bill.sharedBreakdown.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {bill.sharedBreakdown.map((row) => (
                      <span key={row.type}>
                        <span className="text-muted-foreground">
                          {t.dynamic(`expenseTypes.${row.type}`)}
                        </span>{" "}
                        <b className="tabular-nums">{money(row.amount)}</b>
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1.5 text-muted-foreground">
                  {t("manager.cycle.creditText", {
                    deposits: money(bill.depositTotal),
                    bazar: money(bill.paidExpenseTotal),
                  })}
                </p>
              </>
            ),
          }))}
      />
    </>
  );
}
