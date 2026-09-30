"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
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
  const filtered = Boolean(
    queryParams.searchTerm || queryParams.role || queryParams.status,
  );
  const clearFilters = () =>
    set({ searchTerm: undefined, role: undefined, status: undefined });

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
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
            label: t(`status.${role}`),
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
        {filtered && (
          <Button
            variant="link"
            className="self-start px-2 sm:self-auto"
            onClick={clearFilters}
          >
            {t("common.clearFilters")}
          </Button>
        )}
      </div>

      <Suspense fallback={<UserTableLoading />}>
        <UserTable
          {...queryParams}
          onClearFilters={filtered ? clearFilters : undefined}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
