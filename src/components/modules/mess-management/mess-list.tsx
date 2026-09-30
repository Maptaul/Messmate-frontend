"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import SearchInput from "@/components/ui/search-input";
import { useManagers } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { messesParams } from "@/utils";
import MessTable from "./mess-table";
import MessTableLoading from "./mess-table-loading";

export default function MessList() {
  const t = useT();
  const { get, set } = useQueryParams();
  const { data: managers } = useManagers();

  const queryParams = messesParams(get);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("admin.messes.searchPlaceholder")}
          label={t("admin.messes.searchLabel")}
        />
        <FilterSelect
          label={t("admin.messes.managerFilter")}
          allLabel={t("admin.messes.allManagers")}
          value={queryParams.managerId}
          options={(managers?.data ?? []).map((manager) => ({
            value: manager.id,
            label: manager.name,
          }))}
          onChange={(managerId) => set({ managerId })}
        />
      </div>

      <Suspense fallback={<MessTableLoading />}>
        <MessTable
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
