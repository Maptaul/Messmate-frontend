import type { GroceryDuty } from "@/types";

// Five chart hues repeat past five shoppers; the name always sits
// beside the dot, so colour is never the only thing that tells them apart.
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

/** A stable dot colour per member, in the order their first turn comes. */
export function dutyColors(duties: GroceryDuty[]) {
  const ids = [
    ...new Set(
      [...duties]
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .map((duty) => duty.member.id),
    ),
  ];
  return (memberId: string) =>
    COLORS[Math.max(ids.indexOf(memberId), 0) % COLORS.length];
}
