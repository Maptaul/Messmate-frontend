"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FilterSelect from "@/components/ui/filter-select";
import { useMessCycles } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatMonth } from "@/utils";

const RECENT = { limit: 12 };

/**
 * Switches which month a ledger page shows. The month comes from `?cycle=`,
 * which the server page reads, so a change is a real navigation.
 */
export default function CyclePicker({
  messId,
  cycleId,
}: {
  messId: string;
  cycleId: string;
}) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data } = useMessCycles(messId, RECENT);

  const cycles = data?.data ?? [];
  if (cycles.length < 2) return null;

  return (
    <FilterSelect
      label={t("manager.cyclePicker.label")}
      allLabel={t("manager.cyclePicker.current")}
      value={cycles.some((cycle) => cycle.id === cycleId) ? cycleId : undefined}
      options={cycles.map((cycle) => ({
        value: cycle.id,
        label: `${formatMonth(cycle.year, cycle.month, locale)}${cycle.status === "OPEN" ? ` · ${t("status.OPEN")}` : ""}`,
      }))}
      onChange={(next) => {
        const params = new URLSearchParams(searchParams.toString());
        // Filters and pages belong to the month being left.
        for (const key of [...params.keys()]) params.delete(key);
        if (next) params.set("cycle", next);
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
      }}
    />
  );
}
