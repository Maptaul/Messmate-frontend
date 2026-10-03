"use client";

import StatCard from "@/components/ui/stat-card";
import StatStrip from "@/components/ui/stat-strip";
import { useSuspenseCycleBills } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { ALL_BILLS_PARAMS, formatBDT, formatNumber, toNumber } from "@/utils";

export default function BillSummary({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);

  const { data } = useSuspenseCycleBills(cycleId, ALL_BILLS_PARAMS);

  const bills = data.data;
  const billed = bills.reduce(
    (sum, bill) => sum + toNumber(bill.totalPayable),
    0,
  );
  const outstanding = bills.reduce(
    (sum, bill) => sum + Math.max(toNumber(bill.dueAmount), 0),
    0,
  );
  const fullyPaid = bills.filter(
    (bill) => toNumber(bill.dueAmount) <= 0,
  ).length;
  const percent = bills.length > 0 ? (fullyPaid / bills.length) * 100 : 0;

  return (
    <StatStrip>
      <StatCard
        label={t("manager.bills.totalBilled")}
        value={formatBDT(billed, locale)}
      />
      <StatCard
        label={t("manager.bills.collected")}
        value={formatBDT(billed - outstanding, locale)}
      />
      <StatCard
        label={t("manager.bills.outstanding")}
        value={formatBDT(outstanding, locale)}
        valueClassName={outstanding > 0 ? "text-(--tone-a-fg)" : undefined}
      />
      <StatCard
        label={t("manager.bills.fullyPaid")}
        value={`${n(fullyPaid)} / ${n(bills.length)}`}
      >
        <div className="h-1.5 rounded-full bg-muted" aria-hidden>
          <div
            className="h-full rounded-full bg-chart-1"
            style={{ width: `${percent}%` }}
          />
        </div>
      </StatCard>
    </StatStrip>
  );
}
