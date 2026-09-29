"use client";

import { useSuspenseCycleMeals, useSuspenseMealSummary } from "@/hooks";
import { MEAL_PAGE_PARAMS } from "@/utils";
import MealRegisterGrid from "./meal-register-grid";

export default function MealRegisterTable({
  cycleId,
  date,
  locked,
}: {
  cycleId: string;
  date: string;
  locked: boolean;
}) {
  const { data: summary } = useSuspenseMealSummary(cycleId);
  const { data: entries } = useSuspenseCycleMeals(cycleId, {
    ...MEAL_PAGE_PARAMS,
    date,
  });

  const members = summary.data.members.filter(
    (member) => member.status === "ACTIVE",
  );

  // A fresh grid whenever the day or the saved values change underneath it.
  const signature = `${date}|${entries.data
    .map((entry) => `${entry.member.id}:${entry.lunch}:${entry.dinner}`)
    .join(",")}`;

  return (
    <MealRegisterGrid
      key={signature}
      cycleId={cycleId}
      date={date}
      members={members}
      entries={entries.data}
      locked={locked}
    />
  );
}
