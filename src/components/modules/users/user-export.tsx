"use client";

import { getUsers } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { User } from "@/types";
import { EXPORT_PAGE_SIZE, usersParams } from "@/utils";

export default function UserExport() {
  const t = useT();
  const { get } = useQueryParams();
  const params = usersParams(get);

  return (
    <ExportCsvButton<User>
      name="users"
      fetchPage={(page) =>
        getUsers({ ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("admin.users.user"), (user) => user.name],
        [t("admin.userDetail.email"), (user) => user.email],
        [t("admin.users.phone"), (user) => user.phone],
        [t("admin.users.role"), (user) => t(`status.${user.role}`)],
        [t("admin.users.status"), (user) => t(`status.${user.status}`)],
        [
          t("admin.users.verified"),
          (user) =>
            user.emailVerified
              ? t("admin.users.verified")
              : t("admin.users.notVerified"),
        ],
        [
          t("admin.users.signIn"),
          (user) =>
            user.authProvider === "GOOGLE"
              ? t("admin.users.providerGoogle")
              : t("admin.users.providerEmail"),
        ],
        [t("admin.users.joined"), (user) => user.createdAt.slice(0, 10)],
      ]}
    />
  );
}
