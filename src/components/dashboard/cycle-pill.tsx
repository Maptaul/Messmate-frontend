"use client";

import Link from "next/link";
import { useSettlementPreview } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { ActiveCycle } from "@/lib/activeCycle";
import type { UserRole } from "@/types";
import { formatBDT, formatShortMonth } from "@/utils";

export default function CyclePill({
  role,
  cycle,
}: {
  role: UserRole;
  cycle: ActiveCycle;
}) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const { data } = useSettlementPreview(cycle.id);

  const rate = data?.data.mealRate;
  const target =
    role === "MESS_MANAGER" ? `/manager/cycles/${cycle.id}` : "/dashboard/mess";

  return (
    <Link
      href={href(target)}
      className="tone-g hidden h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap min-[1080px]:inline-flex"
    >
      <span className="relative size-1.5">
        <span className="absolute inset-0 rounded-full bg-current" />
        <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-75 [animation-duration:1.4s]" />
      </span>
      {formatShortMonth(cycle.year, cycle.month, locale)}
      {rate !== undefined &&
        ` · ${t("shell.perMeal", { rate: formatBDT(rate, locale) })}`}
    </Link>
  );
}
