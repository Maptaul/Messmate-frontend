"use client";

import { Suspense } from "react";
import SearchInput from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { ActiveCycle } from "@/lib/activeCycle";
import { membersParams } from "@/utils";
import MemberTable from "./member-table";
import MemberTableLoading from "./member-table-loading";

export default function MemberList({
  messId,
  cycle,
}: {
  messId: string;
  cycle: ActiveCycle | null;
}) {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = membersParams(get);
  const statusItems = [
    { value: "ACTIVE", label: t("status.ACTIVE") },
    { value: "LEFT", label: t("status.LEFT") },
    { value: "ALL", label: t("manager.members.allStatuses") },
  ];

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("manager.members.searchPlaceholder")}
          label={t("manager.members.searchLabel")}
        />
        <Select
          items={statusItems}
          value={queryParams.status ?? "ALL"}
          onValueChange={(status) =>
            set({ status: status === "ACTIVE" ? undefined : String(status) })
          }
        >
          <SelectTrigger
            aria-label={t("manager.members.statusFilter")}
            className="w-full sm:w-36"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<MemberTableLoading />}>
        <MemberTable
          messId={messId}
          cycle={cycle}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
