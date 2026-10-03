"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useSettlementPreview } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { ActiveCycle } from "@/lib/activeCycle";
import type { UserRole } from "@/types";
import { formatBDT, formatShortMonth } from "@/utils";

const subscribe = () => () => {};

export default function CyclePill({
  role,
  cycle,
}: {
  role: UserRole;
  cycle: ActiveCycle;
}) {
  const locale = useLocale();
  const href = useLocalePath();
  // Pages prefetch this month's settlement too. If the pill created that query
  // during the server render, the page's server data would only arrive in an
  // effect, so the rate joins once the page has hydrated.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

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
      {hydrated && <MealRate cycleId={cycle.id} />}
    </Link>
  );
}

function MealRate({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const { data } = useSettlementPreview(cycleId);
  const rate = data?.data.mealRate;

  if (rate === undefined) return null;

  return ` · ${t("shell.perMeal", { rate: formatBDT(rate, locale) })}`;
}
