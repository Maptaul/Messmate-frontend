import type { ReactNode } from "react";

/**
 * The joined KPI card: StatCard cells in one row when the content area (padding included) is at
 * least 820px wide, otherwise two by two.
 */
export default function StatStrip({ children }: { children: ReactNode }) {
  return (
    <div className="@container overflow-hidden rounded-xl border bg-card shadow-1">
      <div className="-mr-px -mb-px grid grid-cols-2 @min-[756px]:grid-flow-col @min-[756px]:grid-cols-none @min-[756px]:auto-cols-fr">
        {children}
      </div>
    </div>
  );
}
