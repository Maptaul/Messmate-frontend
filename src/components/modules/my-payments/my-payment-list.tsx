"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { PaymentStatus } from "@/types";
import { paymentsParams } from "@/utils";
import MyPaymentExport from "./my-payment-export";
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("resident.payments.title")}</h1>
          <p className="text-muted-foreground">
            {t("resident.payments.description")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MyPaymentExport />
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
