"use client";

import { getAuditLogs } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { AuditLog } from "@/types";
import { auditParams, EXPORT_PAGE_SIZE } from "@/utils";

/** Every audit entry matching the current action and entity filters. */
export default function AuditLogExport() {
  const t = useT();
  const { get } = useQueryParams();
  const params = auditParams(get);

  return (
    <ExportCsvButton<AuditLog>
      name="audit-log"
      fetchPage={(page) =>
        getAuditLogs({ ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("admin.auditPage.when"), (log) => log.createdAt],
        [t("admin.auditPage.actor"), (log) => log.actor.name],
        [t("admin.users.role"), (log) => t(`status.${log.actor.role}`)],
        [
          t("admin.auditPage.action"),
          (log) => t(`audit.actions.${log.action}`),
        ],
        [t("admin.auditPage.entity"), (log) => log.entity],
        [t("admin.auditPage.entityId"), (log) => log.entityId],
        [
          t("admin.messDetail.membersTitle"),
          (log) => log.subjectMember?.user.name ?? "",
        ],
      ]}
    />
  );
}
