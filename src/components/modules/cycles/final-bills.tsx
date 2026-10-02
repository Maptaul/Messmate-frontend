"use client";

import { useSuspenseCycle, useSuspenseCycleBills } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { ALL_BILLS_PARAMS, formatDate, toNumber } from "@/utils";
import SettlementTable from "./settlement-table";

/** A closed month's stored bills, read-only. */
export default function FinalBills({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data: cycle } = useSuspenseCycle(cycleId);
  const { data } = useSuspenseCycleBills(cycleId, ALL_BILLS_PARAMS);
  const { closedAt, closedBy } = cycle.data;

  return (
    <SettlementTable
      title={t("manager.cycle.finalTitle")}
      caption={t("manager.cycle.finalCaption", {
        date: closedAt ? formatDate(closedAt, locale) : "—",
        name: closedBy?.name ?? "—",
      })}
      rows={[...data.data]
        .sort((a, b) => toNumber(b.dueAmount) - toNumber(a.dueAmount))
        .map((bill) => ({
          id: bill.id,
          name: bill.member.user.name,
          meals: bill.mealCount,
          mealCost: toNumber(bill.mealCost),
          shared: toNumber(bill.sharedCost),
          rent: toNumber(bill.rentShare),
          total: toNumber(bill.totalPayable),
          credit: toNumber(bill.creditAmount),
          paid: toNumber(bill.paidAmount),
          due: toNumber(bill.dueAmount),
          carried: bill.status === "CARRIED",
        }))}
    />
  );
}
