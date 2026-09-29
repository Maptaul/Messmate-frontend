"use client";

import { Suspense } from "react";
import SearchInput from "@/components/ui/search-input";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { messesParams } from "@/utils";
import MessTable from "./mess-table";
import MessTableLoading from "./mess-table-loading";

export default function MessList() {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = messesParams(get);

  return (
    <>
      <div className="my-5">
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("admin.messes.searchPlaceholder")}
          label={t("admin.messes.searchLabel")}
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
