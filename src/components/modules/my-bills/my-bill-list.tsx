"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { BillStatus } from "@/types";
import { billsParams } from "@/utils";
import MyBillTable from "./my-bill-table";
import MyBillTableLoading from "./my-bill-table-loading";

const statuses: BillStatus[] = ["UNPAID", "PARTIAL", "PAID"];

export default function MyBillList() {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = billsParams(get);

  return (
    <>
      <div className="my-5">
        <FilterSelect
          label={t("resident.bills.statusFilter")}
          allLabel={t("resident.bills.allStatuses")}
          value={queryParams.status}
          options={statuses.map((status) => ({
            value: status,
            label: t(`status.${status}`),
          }))}
          onChange={(status) => set({ status })}
        />
      </div>

      <Suspense fallback={<MyBillTableLoading />}>
        <MyBillTable
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
