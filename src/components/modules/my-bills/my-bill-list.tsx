"use client";

import { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { BillStatus } from "@/types";
import { billsParams } from "@/utils";
import MyBillTable from "./my-bill-table";
import MyBillTableLoading from "./my-bill-table-loading";

const statuses: BillStatus[] = ["UNPAID", "PARTIAL", "PAID"];
const ALL = "ALL";

export default function MyBillList() {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = billsParams(get);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("resident.bills.title")}</h1>
          <p className="text-muted-foreground">
            {t("resident.bills.description")}
          </p>
        </div>
        <Tabs
          value={queryParams.status ?? ALL}
          onValueChange={(value) =>
            set({ status: value === ALL ? undefined : String(value) })
          }
        >
          <TabsList aria-label={t("resident.bills.tabsLabel")}>
            <TabsTrigger value={ALL} className="px-3">
              {t("resident.bills.all")}
            </TabsTrigger>
            {statuses.map((status) => (
              <TabsTrigger key={status} value={status} className="px-3">
                {t(`status.${status}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
