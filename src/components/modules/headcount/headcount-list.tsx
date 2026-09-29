"use client";

import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import useQueryParams from "@/hooks/query-params.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatDate, registerDate, todayInDhaka } from "@/utils";
import HeadcountTable from "./headcount-table";
import HeadcountTableLoading from "./headcount-table-loading";

/** How many plates a day needs: everyone's planned lunch and dinner, added up. */
export default function HeadcountList({
  cycleId,
  year,
  month,
}: {
  cycleId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const locale = useLocale();
  const { get, set } = useQueryParams();

  const date = registerDate(get("date"), year, month, todayInDhaka());
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label htmlFor="headcount-date" className="text-sm font-medium">
            {t("manager.headcount.date")}
          </label>
          <Input
            id="headcount-date"
            type="date"
            className="w-44"
            min={`${prefix}-01`}
            max={`${prefix}-${String(last).padStart(2, "0")}`}
            value={date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </div>
        <p className="pb-2 text-sm text-muted-foreground">
          {formatDate(date, locale)}
        </p>
      </div>

      <Suspense fallback={<HeadcountTableLoading />}>
        <HeadcountTable cycleId={cycleId} date={date} />
      </Suspense>
    </div>
  );
}
