"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { PaymentStatus } from "@/types";
import { paymentsParams } from "@/utils";
import MyPaymentTable from "./my-payment-table";
import MyPaymentTableLoading from "./my-payment-table-loading";

const statuses: PaymentStatus[] = [
  "PAID",
  "UNPAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
];

export default function MyPaymentList() {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = paymentsParams(get);

  return (
    <>
      <div className="my-5">
        <FilterSelect
          label={t("resident.payments.statusFilter")}
          allLabel={t("resident.payments.allStatuses")}
          value={queryParams.status}
          options={statuses.map((status) => ({
            value: status,
            label: t(`status.${status}`),
          }))}
          onChange={(status) => set({ status })}
        />
      </div>

      <Suspense fallback={<MyPaymentTableLoading />}>
        <MyPaymentTable
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
