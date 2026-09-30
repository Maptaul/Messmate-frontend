"use client";

import { Suspense } from "react";
import CyclePicker from "@/components/modules/cycles/cycle-picker";
import FilterSelect from "@/components/ui/filter-select";
import SearchInput from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { BillStatus } from "@/types";
import { billsParams } from "@/utils";
import BillSummary from "./bill-summary";
import BillTable from "./bill-table";
import BillTableLoading from "./bill-table-loading";

const statuses: BillStatus[] = ["UNPAID", "PARTIAL", "PAID"];

export default function BillList({
  messId,
  cycleId,
  messName,
  period,
  periodKey,
}: {
  messId: string;
  cycleId: string;
  messName: string;
  period: string;
  periodKey: string;
}) {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = billsParams(get);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <CyclePicker messId={messId} cycleId={cycleId} />
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("manager.bills.searchPlaceholder")}
          label={t("manager.bills.searchLabel")}
        />
        <FilterSelect
          label={t("manager.bills.statusFilter")}
          allLabel={t("manager.bills.allStatuses")}
          value={queryParams.status}
          options={statuses.map((status) => ({
            value: status,
            label: t(`status.${status}`),
          }))}
          onChange={(status) => set({ status })}
        />
      </div>

      <Suspense fallback={<Skeleton className="h-48 rounded-xl md:h-28" />}>
        <BillSummary cycleId={cycleId} />
      </Suspense>

      <Suspense fallback={<BillTableLoading />}>
        <BillTable
          cycleId={cycleId}
          messName={messName}
          period={period}
          periodKey={periodKey}
          filtered={!!(queryParams.searchTerm || queryParams.status)}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
