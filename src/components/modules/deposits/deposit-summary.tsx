"use client";

import { useSuspenseCycleDeposits, useSuspenseMessMembers } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import {
  ACTIVE_MEMBERS_PARAMS,
  ALL_DEPOSITS_PARAMS,
  formatBDT,
  formatNumber,
  toNumber,
} from "@/utils";

/** What came in this month, and who still hasn't put anything in. */
export default function DepositSummary({
  cycleId,
  messId,
}: {
  cycleId: string;
  messId: string;
}) {
  const t = useT();
  const locale = useLocale();

  const { data: deposits } = useSuspenseCycleDeposits(
    cycleId,
    ALL_DEPOSITS_PARAMS,
  );
  const { data: members } = useSuspenseMessMembers(
    messId,
    ACTIVE_MEMBERS_PARAMS,
  );

  const total = deposits.data.reduce(
    (sum, deposit) => sum + toNumber(deposit.amount),
    0,
  );
  const paid = new Set(deposits.data.map((deposit) => deposit.member.id));
  const missing = members.data.filter((member) => !paid.has(member.id));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card px-5 py-4 shadow-1">
        <p className="font-medium text-muted-foreground">
          {t("manager.deposits.totalDep")}
        </p>
        <p className="text-[28px] font-semibold tracking-tight tabular-nums">
          {formatBDT(total, locale)}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("manager.deposits.depCount", {
            count: formatNumber(deposits.meta.total, locale),
          })}
        </p>
      </div>
      <div className="rounded-xl border bg-card px-5 py-4 shadow-1">
        <p className="font-medium text-muted-foreground">
          {t("manager.deposits.notDep")}
        </p>
        <p className="text-[28px] font-semibold tracking-tight text-(--tone-a-fg) tabular-nums">
          {formatNumber(missing.length, locale)}
        </p>
        <p className="text-xs text-muted-foreground">
          {missing.map((member) => member.user.name).join(", ") ||
            t("manager.deposits.everyone")}
        </p>
      </div>
    </div>
  );
}
