"use client";

import { getAllMesses } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { Mess } from "@/types";
import { EXPORT_PAGE_SIZE, messesParams, toNumber } from "@/utils";

/** Every mess matching the current search and manager filter. */
export default function MessExport() {
  const t = useT();
  const { get } = useQueryParams();
  const params = messesParams(get);

  return (
    <ExportCsvButton<Mess>
      name="messes"
      fetchPage={(page) =>
        getAllMesses({ ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("admin.messes.mess"), (mess) => mess.name],
        [t("admin.messDetail.address"), (mess) => mess.address],
        [t("admin.messes.manager"), (mess) => mess.manager.name],
        [t("admin.messes.members"), (mess) => mess._count.members],
        [t("admin.messes.cycles"), (mess) => mess._count.cycles],
        [t("admin.messes.rent"), (mess) => toNumber(mess.monthlyRent)],
        [t("admin.messes.advance"), (mess) => toNumber(mess.monthlyDeposit)],
        [t("admin.messes.created"), (mess) => mess.createdAt.slice(0, 10)],
      ]}
    />
  );
}
