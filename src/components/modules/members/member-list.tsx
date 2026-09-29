"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { MembershipStatus } from "@/types";
import { membersParams } from "@/utils";
import AddMemberDialog from "./add-member-dialog";
import MemberTable from "./member-table";
import MemberTableLoading from "./member-table-loading";

const statuses: MembershipStatus[] = ["ACTIVE", "LEFT"];

export default function MemberList({ messId }: { messId: string }) {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = membersParams(get);

  return (
    <>
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterSelect
          label={t("manager.members.statusFilter")}
          allLabel={t("manager.members.allStatuses")}
          value={queryParams.status}
          options={statuses.map((status) => ({
            value: status,
            label: t(`status.${status}`),
          }))}
          onChange={(status) => set({ status })}
        />
        <AddMemberDialog messId={messId} />
      </div>

      <Suspense fallback={<MemberTableLoading />}>
        <MemberTable
          messId={messId}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
