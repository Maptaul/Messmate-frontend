"use client";

import BarList from "@/components/ui/bar-list";
import Panel from "@/components/ui/panel";
import StatCard from "@/components/ui/stat-card";
import StatStrip from "@/components/ui/stat-strip";
import { useSuspenseExpenseSummary, useSuspenseMessMembers } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { ACTIVE_MEMBERS_PARAMS, formatBDT, formatNumber } from "@/utils";

export default function ExpenseSummary({
  cycleId,
  messId,
}: {
  cycleId: string;
  messId: string;
}) {
  const t = useT();
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);

  const { data } = useSuspenseExpenseSummary(cycleId);
  const { data: members } = useSuspenseMessMembers(
    messId,
    ACTIVE_MEMBERS_PARAMS,
  );

  const summary = data.data;
  const count = (type?: string) =>
    summary.byType
      .filter((row) => !type || row.type === type)
      .reduce((sum, row) => sum + row.count, 0);
  const headcount = members.meta.total;
  const byType = summary.byType
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);
  const payers = [...summary.paidByMembers].sort((a, b) => b.total - a.total);

  return (
    <>
      <StatStrip>
        <StatCard
          label={t("manager.expenses.kGrand")}
          value={formatBDT(summary.grandTotal, locale)}
          hint={t("manager.expenses.kGrandHint", { count: n(count()) })}
        />
        <StatCard
          label={t("manager.expenses.kBazar")}
          value={formatBDT(summary.grocery, locale)}
          hint={t("manager.expenses.kBazarHint", {
            count: n(count("GROCERY")),
          })}
        />
        <StatCard
          label={t("manager.expenses.kRent")}
          value={formatBDT(summary.rent, locale)}
          hint={
            summary.rent > 0 && headcount > 0
              ? t("manager.expenses.kRentHint", {
                  amount: formatBDT(summary.rent / headcount, locale),
                })
              : t("manager.expenses.kRentNone")
          }
        />
        <StatCard
          label={t("manager.expenses.kShared")}
          value={formatBDT(summary.sharedTotal, locale)}
          hint={t("manager.expenses.kSharedHint")}
        />
      </StatStrip>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title={t("manager.expenses.byType")}>
          {byType.length > 0 ? (
            <BarList
              items={byType.map((row) => ({
                key: row.type,
                label: t(`expenseTypes.${row.type}`),
                value: row.total,
                display: formatBDT(row.total, locale),
              }))}
            />
          ) : (
            <p className="text-muted-foreground">
              {t("manager.cycle.noSpending")}
            </p>
          )}
        </Panel>
        <Panel
          title={t("manager.expenses.paidByMembers")}
          description={t("manager.expenses.paidByMembersSub")}
        >
          {payers.length > 0 ? (
            <BarList
              items={payers.map((row) => ({
                key: row.memberId,
                label: row.name.split(" ")[0],
                tip: `${row.name}: ${formatBDT(row.total, locale)}`,
                value: row.total,
                display: formatBDT(row.total, locale),
              }))}
            />
          ) : (
            <p className="text-muted-foreground">
              {t("manager.expenses.paidByNone")}
            </p>
          )}
        </Panel>
      </div>
    </>
  );
}
