"use client";

import { EyeIcon } from "lucide-react";
import { type ReactNode, Suspense } from "react";
import CyclePicker from "@/components/modules/cycles/cycle-picker";
import DepositTable from "@/components/modules/deposits/deposit-table";
import ExpenseTable from "@/components/modules/expenses/expense-table";
import DutyTable from "@/components/modules/grocery-duty/duty-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuspenseMess } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ActiveCycle } from "@/lib/activeCycle";
import {
  depositsParams,
  expensesParams,
  formatBDT,
  formatMonth,
  LEDGER_TABS,
  type LedgerTab,
  ledgerTab,
} from "@/utils";
import {
  LedgerCycles,
  LedgerMeals,
  LedgerMembers,
  LedgerSummary,
} from "./ledger-tables";

/** The mess's books for a member: the same records, nothing to change. */
export default function Ledger({
  messId,
  cycle,
}: {
  messId: string;
  cycle: ActiveCycle;
}) {
  const t = useT();
  const locale = useLocale();
  const { get, set } = useQueryParams();
  const tab = ledgerTab(get);

  const { data } = useSuspenseMess(messId);
  const mess = data.data;
  const initials = mess.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const facts = [
    [t("resident.ledger.factManager"), mess.manager.name],
    [t("resident.ledger.factRent"), formatBDT(mess.monthlyRent, locale)],
    [t("resident.ledger.factAdvance"), formatBDT(mess.monthlyDeposit, locale)],
    [
      t("resident.ledger.factCycle"),
      formatMonth(cycle.year, cycle.month, locale),
    ],
  ];

  const sections: Record<LedgerTab, ReactNode> = {
    meals: <LedgerMeals cycleId={cycle.id} />,
    expenses: (
      <ExpenseTable
        cycleId={cycle.id}
        messId={messId}
        canEdit={false}
        filtered={false}
        onClear={() => undefined}
        {...expensesParams(get)}
        handlePageChange={(page) => set({ page })}
      />
    ),
    deposits: (
      <DepositTable
        cycleId={cycle.id}
        messId={messId}
        canEdit={false}
        {...depositsParams(get)}
        handlePageChange={(page) => set({ page })}
      />
    ),
    duty: (
      <DutyTable
        cycleId={cycle.id}
        messId={messId}
        year={cycle.year}
        month={cycle.month}
        locked
      />
    ),
    members: <LedgerMembers messId={messId} />,
    cycles: <LedgerCycles messId={messId} />,
    summary: <LedgerSummary cycleId={cycle.id} />,
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5 shadow-1">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-tint text-lg font-semibold text-primary">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="page-title">{mess.name}</h1>
          <p className="text-muted-foreground">{mess.address}</p>
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <EyeIcon className="size-4" />
          {t("resident.ledger.readOnly")}
        </p>
        <CyclePicker messId={messId} cycleId={cycle.id} />
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) =>
          set({ tab: value === "meals" ? undefined : String(value) })
        }
      >
        <TabsList
          aria-label={t("resident.ledger.tabsLabel")}
          className="h-auto max-w-full flex-wrap justify-start"
        >
          {LEDGER_TABS.map((key) => (
            <TabsTrigger key={key} value={key} className="px-3">
              {t(`resident.ledger.tabs.${key}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Suspense key={tab} fallback={<Skeleton className="h-96 rounded-xl" />}>
        {sections[tab]}
      </Suspense>
    </>
  );
}
