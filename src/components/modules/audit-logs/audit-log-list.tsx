"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
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
  const filtered = Boolean(queryParams.action || queryParams.entity);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
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
        <FilterSelect
          label={t("admin.auditPage.sortLabel")}
          allLabel={t("admin.auditPage.newest")}
          value={queryParams.sortOrder}
          options={[{ value: "asc", label: t("admin.auditPage.oldest") }]}
          onChange={(sortOrder) => set({ sortOrder })}
        />
        {filtered && (
          <Button
            variant="link"
            className="self-start px-2 sm:self-auto"
            onClick={() => set({ action: undefined, entity: undefined })}
          >
            {t("common.clearFilters")}
          </Button>
        )}
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
