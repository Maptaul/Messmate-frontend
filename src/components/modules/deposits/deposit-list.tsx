"use client";

import { Suspense } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FilterSelect from "@/components/ui/filter-select";
import { useActiveMembers } from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import { depositsParams } from "@/utils";
import DepositCreateDialog from "./deposit-create-dialog";
import DepositTable from "./deposit-table";
import DepositTableLoading from "./deposit-table-loading";

export default function DepositList({
  cycleId,
  messId,
  locked,
  readOnly = false,
}: {
  cycleId: string;
  messId: string;
  locked: boolean;
  readOnly?: boolean;
}) {
  const t = useT();
  const { get, set } = useQueryParams();

  const { data: members } = useActiveMembers(messId);

  const queryParams = depositsParams(get);
  const canEdit = !locked && !readOnly;

  return (
    <div className="space-y-4">
      {locked && (
        <Alert>
          <AlertDescription>{t("manager.closedNote")}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterSelect
          label={t("manager.deposits.memberFilter")}
          allLabel={t("manager.deposits.allMembers")}
          value={queryParams.memberId}
          options={(members?.data ?? []).map((member) => ({
            value: member.id,
            label: member.user.name,
          }))}
          onChange={(memberId) => set({ memberId })}
        />
        {canEdit && <DepositCreateDialog cycleId={cycleId} messId={messId} />}
      </div>

      <Suspense fallback={<DepositTableLoading />}>
        <DepositTable
          cycleId={cycleId}
          messId={messId}
          canEdit={canEdit}
          {...queryParams}
          handlePageChange={(page) => set({ page })}
        />
      </Suspense>
    </div>
  );
}
