"use client";

import { getMessMembers } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { MessMember } from "@/types";
import { EXPORT_PAGE_SIZE, membersParams } from "@/utils";

/** Every member matching the current search and status. */
export default function MemberExport({ messId }: { messId: string }) {
  const t = useT();
  const { get } = useQueryParams();
  const params = membersParams(get);

  return (
    <ExportCsvButton<MessMember>
      name="members"
      fetchPage={(page) =>
        getMessMembers(messId, { ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("manager.members.member"), (member) => member.user.name],
        [t("manager.members.email"), (member) => member.user.email],
        [t("manager.members.phone"), (member) => member.user.phone],
        [t("manager.members.status"), (member) => t(`status.${member.status}`)],
        [t("manager.members.joined"), (member) => member.joinedAt.slice(0, 10)],
        [
          t("manager.members.left"),
          (member) => member.leftAt?.slice(0, 10) ?? "",
        ],
        [t("manager.members.lunch"), (member) => member.defaultLunch],
        [t("manager.members.dinner"), (member) => member.defaultDinner],
      ]}
    />
  );
}
