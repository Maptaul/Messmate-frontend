"use client";

import { LockIcon } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import FilterSelect from "@/components/ui/filter-select";
import { Input } from "@/components/ui/input";
import SearchInput from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinanceCategories } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import {
  FINANCE_PERIODS,
  financeEntriesParams,
  financeSummaryParams,
} from "@/utils";
import FinanceEntryCreateDialog from "./finance-entry-create-dialog";
import FinanceEntryTable from "./finance-entry-table";
import FinanceEntryTableLoading from "./finance-entry-table-loading";
import FinanceExport from "./finance-export";
import FinancePeriodNav from "./finance-period-nav";
import FinanceSummary from "./finance-summary";
import FinanceSummaryLoading from "./finance-summary-loading";

export default function FinanceTabs() {
  const t = useT();
  const { get, set } = useQueryParams();
  const { data: categories } = useFinanceCategories();

  const { period, date } = financeSummaryParams(get);
  const queryParams = financeEntriesParams(get);
  const filtered = !!(
    queryParams.type ||
    queryParams.category ||
    queryParams.from ||
    queryParams.to ||
    queryParams.searchTerm
  );
  const clear = () =>
    set({
      type: undefined,
      category: undefined,
      from: undefined,
      to: undefined,
      searchTerm: undefined,
    });

  // The API's list, by the chosen type; the built-in list until it arrives.
  const income = categories?.data.INCOME ?? INCOME_CATEGORIES;
  const expense = categories?.data.EXPENSE ?? EXPENSE_CATEGORIES;
  const categoryOptions =
    queryParams.type === "INCOME"
      ? income
      : queryParams.type === "EXPENSE"
        ? expense
        : [...new Set([...income, ...expense])];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("finance.title")}</h1>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <LockIcon className="size-3.5" />
            {t("finance.description")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FinanceExport />
          <FinanceEntryCreateDialog />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={period}
          onValueChange={(next) =>
            set({
              period: next === "monthly" ? undefined : String(next),
              date: undefined,
            })
          }
        >
          <TabsList aria-label={t("finance.periodLabel")}>
            {FINANCE_PERIODS.map((each) => (
              <TabsTrigger key={each} value={each} className="px-3">
                {t(`finance.periods.${each}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Suspense fallback={<Skeleton className="h-9 w-56 rounded-lg" />}>
          <FinancePeriodNav
            period={period}
            date={date}
            onChange={(next) => set({ date: next })}
          />
        </Suspense>
      </div>

      <Suspense fallback={<FinanceSummaryLoading />}>
        <FinanceSummary period={period} date={date} />
      </Suspense>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <FilterSelect
          label={t("finance.typeFilter")}
          allLabel={t("finance.allTypes")}
          value={queryParams.type}
          options={(["INCOME", "EXPENSE"] as const).map((type) => ({
            value: type,
            label: t(`status.${type}`),
          }))}
          onChange={(type) => set({ type, category: undefined })}
        />
        <FilterSelect
          label={t("finance.categoryFilter")}
          allLabel={t("finance.allCategories")}
          value={queryParams.category}
          options={categoryOptions.map((category) => ({
            value: category,
            label: t.dynamic(`finance.categories.${category}`),
          }))}
          onChange={(category) => set({ category })}
        />
        <Input
          type="date"
          aria-label={t("finance.fromDate")}
          className="w-full sm:w-40"
          value={queryParams.from ?? ""}
          max={queryParams.to}
          onChange={(event) => set({ from: event.target.value || undefined })}
        />
        <Input
          type="date"
          aria-label={t("finance.toDate")}
          className="w-full sm:w-40"
          value={queryParams.to ?? ""}
          min={queryParams.from}
          onChange={(event) => set({ to: event.target.value || undefined })}
        />
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("finance.searchPlaceholder")}
          label={t("finance.searchLabel")}
        />
        {filtered && (
          <Button variant="ghost" onClick={clear}>
            {t("common.clearFilters")}
          </Button>
        )}
      </div>

      <Suspense fallback={<FinanceEntryTableLoading />}>
        <FinanceEntryTable
          filtered={filtered}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
