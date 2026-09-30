"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { BillStatus } from "@/types";
import { billsParams } from "@/utils";
import BillTable from "./bill-table";
import BillTableLoading from "./bill-table-loading";

const statuses: BillStatus[] = ["UNPAID", "PARTIAL", "PAID"];

export default function BillList({
  cycleId,
  messName,
  period,
  periodKey,
}: {
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
      <div className="my-5">
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

      <Suspense fallback={<BillTableLoading />}>
        <BillTable
          cycleId={cycleId}
          messName={messName}
          period={period}
          periodKey={periodKey}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
