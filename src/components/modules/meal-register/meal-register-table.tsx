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

  // Everyone living in the mess, plus anyone who has since left but still has
  // an entry on this day, so that entry can be corrected or removed.
  const withEntry = new Set(entries.data.map((entry) => entry.member.id));
  const members = summary.data.members.filter(
    (member) => member.status === "ACTIVE" || withEntry.has(member.memberId),
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
