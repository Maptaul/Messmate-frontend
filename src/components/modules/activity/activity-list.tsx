"use client";

import { CheckCheckIcon } from "lucide-react";
import { Suspense, useEffect } from "react";
import FilterSelect from "@/components/ui/filter-select";
import { useActiveMembers, useMarkActivitySeen } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from "@/types";
import { messAuditParams } from "@/utils";
import ActivityTable from "./activity-table";
import ActivityTableLoading from "./activity-table-loading";

/**
 * The mess's activity feed. A manager sees every change and can narrow it by
 * member and by who made it; the API narrows a member's view to the rows that
 * involve them. Opening it marks it as seen.
 */
export default function ActivityList({
  messId,
  isManager = false,
}: {
  messId: string;
  isManager?: boolean;
}) {
  const t = useT();
  const { get, set } = useQueryParams();

  const { mutate: markSeen } = useMarkActivitySeen();
  const { data: members } = useActiveMembers(isManager ? messId : "");

  const queryParams = messAuditParams(get);

  useEffect(() => {
    markSeen(messId);
  }, [messId, markSeen]);

  const people = members?.data ?? [];

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {isManager && (
          <FilterSelect
            label={t("activity.memberFilter")}
            allLabel={t("activity.allMembers")}
            value={queryParams.memberId}
            options={people.map((member) => ({
              value: member.id,
              label: member.user.name,
            }))}
            onChange={(memberId) => set({ memberId })}
          />
        )}
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
        {isManager && (
          <FilterSelect
            label={t("activity.actorFilter")}
            allLabel={t("activity.anyActor")}
            value={queryParams.actorId}
            options={people.map((member) => ({
              value: member.user.id,
              label: member.user.name,
            }))}
            onChange={(actorId) => set({ actorId })}
          />
        )}
      </div>

      <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <CheckCheckIcon className="size-4 text-primary" />
        {t("activity.seenNote")}
      </p>

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
