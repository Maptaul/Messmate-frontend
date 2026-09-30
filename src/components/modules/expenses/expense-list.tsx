"use client";

import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveMembers } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { EXPENSE_TYPES } from "@/types";
import { expensesParams } from "@/utils";
import ExpenseSummary from "./expense-summary";
import ExpenseTable from "./expense-table";
import ExpenseTableLoading from "./expense-table-loading";

const ALL = "ALL";

export default function ExpenseList({
  cycleId,
  messId,
  locked,
  readOnly = false,
}: {
  cycleId: string;
  messId: string;
  /** The month is closed: read-only, and says why. */
  locked: boolean;
  /** The viewer can't edit (a member): read-only without the note. */
  readOnly?: boolean;
}) {
  const t = useT();
  const { get, set } = useQueryParams();
  const { data: members } = useActiveMembers(messId);

  const queryParams = expensesParams(get);
  const canEdit = !locked && !readOnly;
  const filtered = !!(
    queryParams.type ||
    queryParams.paidByMemberId ||
    queryParams.searchTerm
  );
  const clear = () =>
    set({ type: undefined, paidBy: undefined, searchTerm: undefined });

  const typeItems = [
    { value: ALL, label: t("manager.expenses.allTypes") },
    ...EXPENSE_TYPES.map((type) => ({
      value: type,
      label: t(`expenseTypes.${type}`),
    })),
  ];
  const payerItems = [
    { value: ALL, label: t("manager.expenses.allPayers") },
    { value: "fund", label: t("manager.expenses.fund") },
    ...(members?.data ?? []).map((member) => ({
      value: member.id,
      label: member.user.name,
    })),
  ];

  return (
    <>
      <Suspense
        fallback={<Skeleton className="h-[26rem] rounded-xl md:h-80" />}
      >
        <ExpenseSummary cycleId={cycleId} messId={messId} />
      </Suspense>

      {locked && (
        <Alert>
          <AlertDescription>{t("manager.closedNote")}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("manager.expenses.searchPlaceholder")}
          label={t("manager.expenses.searchLabel")}
        />
        <Select
          items={typeItems}
          value={queryParams.type ?? ALL}
          onValueChange={(type) =>
            set({ type: type === ALL ? undefined : String(type) })
          }
        >
          <SelectTrigger
            aria-label={t("manager.expenses.typeFilter")}
            className="w-full sm:w-40"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {typeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          items={payerItems}
          value={queryParams.paidByMemberId ?? ALL}
          onValueChange={(paidBy) =>
            set({ paidBy: paidBy === ALL ? undefined : String(paidBy) })
          }
        >
          <SelectTrigger
            aria-label={t("manager.expenses.payerFilter")}
            className="w-full sm:w-44"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {payerItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filtered && (
          <Button variant="ghost" onClick={clear}>
            {t("common.clearFilters")}
          </Button>
        )}
      </div>

      <Suspense fallback={<ExpenseTableLoading />}>
        <ExpenseTable
          cycleId={cycleId}
          messId={messId}
          canEdit={canEdit}
          filtered={filtered}
          onClear={clear}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
