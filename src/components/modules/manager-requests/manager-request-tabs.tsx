"use client";

import { Suspense } from "react";
import SearchInput from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import {
  MANAGER_REQUEST_TABS,
  managerRequestsParams,
  managerRequestTab,
} from "@/utils";
import ManagerRequestTable from "./manager-request-table";
import ManagerRequestTableLoading from "./manager-request-table-loading";

export default function ManagerRequestTabs() {
  const t = useT();
  const { get, set } = useQueryParams();

  const tab = managerRequestTab(get);
  const queryParams = managerRequestsParams(get);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Tabs
          value={tab}
          onValueChange={(value) =>
            set({ status: value === "PENDING" ? undefined : String(value) })
          }
        >
          <TabsList
            aria-label={t("admin.managerRequests.title")}
            className="h-auto max-w-full flex-wrap justify-start"
          >
            {MANAGER_REQUEST_TABS.map((key) => (
              <TabsTrigger key={key} value={key} className="px-3">
                {t(`admin.managerRequests.tabs.${key}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("admin.managerRequests.searchPlaceholder")}
          label={t("admin.managerRequests.searchLabel")}
        />
      </div>

      <Suspense fallback={<ManagerRequestTableLoading />}>
        <ManagerRequestTable
          {...queryParams}
          isQueue={tab === "PENDING" && !queryParams.searchTerm}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
