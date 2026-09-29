"use client";

import { Suspense } from "react";
import FilterSelect from "@/components/ui/filter-select";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from "@/types";
import { auditParams } from "@/utils";
import AuditLogTable from "./audit-log-table";
import AuditLogTableLoading from "./audit-log-table-loading";

export default function AuditLogList() {
  const t = useT();
  const { get, set } = useQueryParams();

  const queryParams = auditParams(get);

  return (
    <>
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <FilterSelect
          label={t("admin.auditPage.actionFilter")}
          allLabel={t("admin.auditPage.allActions")}
          value={queryParams.action}
          options={AUDIT_ACTIONS.map((action) => ({
            value: action,
            label: t(`audit.actions.${action}`),
          }))}
          onChange={(action) => set({ action })}
        />
        <FilterSelect
          label={t("admin.auditPage.entityFilter")}
          allLabel={t("admin.auditPage.allEntities")}
          value={queryParams.entity}
          options={AUDIT_ENTITIES.map((entity) => ({
            value: entity,
            label: t(`audit.entities.${entity}`),
          }))}
          onChange={(entity) => set({ entity })}
        />
      </div>

      <Suspense fallback={<AuditLogTableLoading />}>
        <AuditLogTable
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
