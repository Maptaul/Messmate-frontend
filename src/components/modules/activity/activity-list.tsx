"use client";

import { Suspense, useEffect } from "react";
import FilterSelect from "@/components/ui/filter-select";
import { useMarkActivitySeen } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from "@/types";
import { messAuditParams } from "@/utils";
import ActivityTable from "./activity-table";
import ActivityTableLoading from "./activity-table-loading";

/**
 * The mess's activity feed. A manager sees every change; the API narrows a
 * member's view to the rows that involve them. Opening it marks it as seen.
 */
export default function ActivityList({ messId }: { messId: string }) {
  const t = useT();
  const { get, set } = useQueryParams();

  const { mutate: markSeen } = useMarkActivitySeen();

  const queryParams = messAuditParams(get);

  useEffect(() => {
    markSeen(messId);
  }, [messId, markSeen]);

  return (
    <>
      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <FilterSelect
          label={t("activity.actionFilter")}
          allLabel={t("activity.allActions")}
          value={queryParams.action}
          options={AUDIT_ACTIONS.map((action) => ({
            value: action,
            label: t(`audit.actions.${action}`),
          }))}
          onChange={(action) => set({ action })}
        />
        <FilterSelect
          label={t("activity.entityFilter")}
          allLabel={t("activity.allEntities")}
          value={queryParams.entity}
          options={AUDIT_ENTITIES.map((entity) => ({
            value: entity,
            label: t(`audit.entities.${entity}`),
          }))}
          onChange={(entity) => set({ entity })}
        />
      </div>

      <Suspense fallback={<ActivityTableLoading />}>
        <ActivityTable
          messId={messId}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </>
  );
}
