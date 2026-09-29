"use client";

import {
  ReceiptTextIcon,
  ShoppingBasketIcon,
  UtensilsIcon,
  WalletIcon,
} from "lucide-react";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseExpenseSummary } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatBDT } from "@/utils";

export default function ExpenseSummary({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseExpenseSummary(cycleId);

  const summary = data.data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("manager.expenses.total")}
        value={formatBDT(summary.grandTotal, locale)}
        icon={ReceiptTextIcon}
      />
      <StatCard
        label={t("manager.expenses.grocery")}
        value={formatBDT(summary.grocery, locale)}
        icon={ShoppingBasketIcon}
      />
      <StatCard
        label={t("manager.expenses.shared")}
        value={formatBDT(summary.sharedTotal, locale)}
        icon={WalletIcon}
      />
      <StatCard
        label={t("manager.expenses.rate")}
        value={formatBDT(summary.runningMealRate, locale)}
        icon={UtensilsIcon}
      />
    </div>
  );
}
