"use client";

import { getMessAuditLogs } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { AuditLog } from "@/types";
import { EXPORT_PAGE_SIZE, messAuditParams } from "@/utils";

/** Every change matching the current filters. */
export default function ActivityExport({ messId }: { messId: string }) {
  const t = useT();
  const { get } = useQueryParams();
  const params = messAuditParams(get);

  return (
    <ExportCsvButton<AuditLog>
      name="activity"
      fetchPage={(page) =>
        getMessAuditLogs(messId, { ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("activity.when"), (log) => log.createdAt],
        [t("activity.who"), (log) => log.actor.name],
        [t("activity.action"), (log) => t(`audit.actions.${log.action}`)],
        [
          t("activity.entityFilter"),
          (log) => t.dynamic(`audit.entities.${log.entity}`),
        ],
        [t("activity.about"), (log) => log.subjectMember?.user.name],
      ]}
    />
  );
}
