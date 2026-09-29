"use client";

import { ShoppingCartIcon } from "lucide-react";
import StatCard from "@/components/ui/stat-card";
import { useSuspenseDutyCalendar } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { todayInDhaka } from "@/utils";

export default function DutyToday({ cycleId }: { cycleId: string }) {
  const t = useT();

  const { data } = useSuspenseDutyCalendar(cycleId);

  const today = data.data.days.find((day) => day.date === todayInDhaka());

  return (
    <StatCard
      label={t("manager.duty.onToday")}
      value={today?.memberName ?? "—"}
      hint={today ? undefined : t("manager.duty.nobodyToday")}
      icon={ShoppingCartIcon}
    />
  );
}
