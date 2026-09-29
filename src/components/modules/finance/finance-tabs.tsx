"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import { FINANCE_PERIODS, financeEntriesParams, financePeriod } from "@/utils";
import FinanceEntryCreateDialog from "./finance-entry-create-dialog";
import FinanceEntryTable from "./finance-entry-table";
import FinanceEntryTableLoading from "./finance-entry-table-loading";
import FinanceSummary from "./finance-summary";
import FinanceSummaryLoading from "./finance-summary-loading";

const allCategories = [
  ...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]),
];

export default function FinanceTabs() {
  const t = useT();
  const { get, set } = useQueryParams();

  const period = financePeriod(get);
  const queryParams = financeEntriesParams(get);

  return (
    <div className="space-y-6">
      <Tabs
        value={period}
        onValueChange={(next) =>
          // A new window starts the entry list from page 1 again.
          set({ period: next === "monthly" ? null : String(next) })
        }
      >
        <TabsList aria-label={t("finance.periodLabel")}>
          {FINANCE_PERIODS.map((each) => (
            <TabsTrigger key={each} value={each}>
              {t(`finance.periods.${each}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Suspense fallback={<FinanceSummaryLoading />}>
        <FinanceSummary period={period} />
      </Suspense>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <FilterSelect
            label={t("finance.typeFilter")}
            allLabel={t("finance.allTypes")}
            value={queryParams.type}
            options={(["INCOME", "EXPENSE"] as const).map((type) => ({
              value: type,
              label: t(`status.${type}`),
            }))}
            onChange={(type) => set({ type })}
          />
          <FilterSelect
            label={t("finance.categoryFilter")}
            allLabel={t("finance.allCategories")}
            value={queryParams.category}
            options={allCategories.map((category) => ({
              value: category,
              label: t(`finance.categories.${category}`),
            }))}
            onChange={(category) => set({ category })}
          />
        </div>
        <FinanceEntryCreateDialog />
      </div>

      <Suspense fallback={<FinanceEntryTableLoading />}>
        <FinanceEntryTable
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </div>
  );
}
