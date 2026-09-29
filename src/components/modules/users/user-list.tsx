"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import SearchInput from "@/components/ui/search-input";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { UserRole, UserStatus } from "@/types";
import { usersParams } from "@/utils";
import UserTable from "./user-table";
import UserTableLoading from "./user-table-loading";

const roles: UserRole[] = ["ADMIN", "MESS_MANAGER", "MEMBER"];
const statuses: UserStatus[] = ["ACTIVE", "BLOCKED"];

export default function UserList() {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = usersParams(get);

  return (
    <>
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={queryParams.searchTerm ?? ""}
          onSearch={(searchTerm) => set({ searchTerm })}
          placeholder={t("admin.users.searchPlaceholder")}
          label={t("admin.users.searchLabel")}
        />
        <FilterSelect
          label={t("admin.users.roleFilter")}
          allLabel={t("admin.users.allRoles")}
          value={queryParams.role}
          options={roles.map((role) => ({
            value: role,
            label: t(`roles.${role}`),
          }))}
          onChange={(role) => set({ role })}
        />
        <FilterSelect
          label={t("admin.users.statusFilter")}
          allLabel={t("admin.users.allStatuses")}
          value={queryParams.status}
          options={statuses.map((status) => ({
            value: status,
            label: t(`status.${status}`),
          }))}
          onChange={(status) => set({ status })}
        />
      </div>

      <Suspense fallback={<UserTableLoading />}>
        <UserTable
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
