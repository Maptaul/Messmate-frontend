"use client";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Fragment, type ReactNode, useState } from "react";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { formatBDT, formatNumber } from "@/utils";

export interface SettlementRow {
  id: string;
  name: string;
  meals: number;
  mealCost: number;
  shared: number;
  rent: number;
  /** Only the preview knows these; a stored bill folds them into the total. */
  advance?: number;
  opening?: number;
  total: number;
  credit: number;
  paid?: number;
  due: number;
  /** Its balance opened the next month's bill. */
  carried?: boolean;
  /** Shown when the row is opened. */
  detail?: ReactNode;
}

/**
 * The month's bills as one wide table with a totals row. Rows with a
 * `detail` open to show it.
 */
export default function SettlementTable({
  title,
  caption,
  rows,
}: {
  title: string;
  caption: string;
  rows: SettlementRow[];
}) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const money = (value: number) => formatBDT(value, locale);

  const hasPreview = rows.some((row) => row.advance !== undefined);
  const hasPaid = rows.some((row) => row.paid !== undefined);
  const expandable = rows.some((row) => row.detail);
  const sum = (pick: (row: SettlementRow) => number) =>
    rows.reduce((total, row) => total + pick(row), 0);

  type Column = [string, (row: SettlementRow) => ReactNode];
  const columns: Column[] = [
    [t("manager.cycle.colMeals"), (row) => formatNumber(row.meals, locale)],
    [t("manager.cycle.colMealCost"), (row) => money(row.mealCost)],
    [t("manager.cycle.colShared"), (row) => money(row.shared)],
    [t("manager.cycle.colRent"), (row) => money(row.rent)],
    ...(hasPreview
      ? ([
          [t("manager.cycle.colAdvance"), (row) => money(row.advance ?? 0)],
          [t("manager.cycle.colOpening"), (row) => money(row.opening ?? 0)],
        ] satisfies Column[])
      : []),
    [t("manager.cycle.colTotal"), (row) => money(row.total)],
    [
      t("manager.cycle.colCredit"),
      (row) => <span className="text-(--tone-g-fg)">−{money(row.credit)}</span>,
    ],
    ...(hasPaid
      ? ([
          [t("manager.cycle.colPaid"), (row) => money(row.paid ?? 0)],
        ] satisfies Column[])
      : []),
  ];

  const due = (row: SettlementRow) =>
    row.carried ? (
      <span className="text-muted-foreground">{t("status.CARRIED")}</span>
    ) : row.due < 0 ? (
      <span className="text-(--tone-g-fg)">
        {t("manager.cycle.inCredit", { amount: money(-row.due) })}
      </span>
    ) : (
      money(row.due)
    );

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-1">
      <div className="border-b px-4 py-3.5">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[67.5rem] border-collapse tabular-nums">
          <thead>
            <tr className="text-muted-foreground">
              {expandable && <th className="w-9 border-b" />}
              <th className="border-b px-2.5 py-2.5 text-left font-medium first:pl-4">
                {t("manager.cycle.colMember")}
              </th>
              {columns.map(([label]) => (
                <th
                  key={label}
                  className="border-b px-2.5 py-2.5 text-right font-medium whitespace-nowrap"
                >
                  {label}
                </th>
              ))}
              <th className="border-b py-2.5 pr-4 pl-2.5 text-right font-medium">
                {t("manager.cycle.colDue")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isOpen = !!open[row.id];
              const toggle = () =>
                setOpen((prev) => ({ ...prev, [row.id]: !prev[row.id] }));
              return (
                <Fragment key={row.id}>
                  <tr
                    className={cn(
                      "border-b hover:bg-accent/70",
                      row.detail && "cursor-pointer",
                    )}
                    onClick={row.detail ? toggle : undefined}
                  >
                    {expandable && (
                      <td className="py-2.5 pl-3">
                        {row.detail && (
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-label={t("manager.cycle.showBreakdown", {
                              name: row.name,
                            })}
                            onClick={(event) => {
                              event.stopPropagation();
                              toggle();
                            }}
                            className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted"
                          >
                            {isOpen ? (
                              <ChevronDownIcon className="size-4" />
                            ) : (
                              <ChevronRightIcon className="size-4" />
                            )}
                          </button>
                        )}
                      </td>
                    )}
                    <td className="px-2.5 py-2.5 font-medium whitespace-nowrap first:pl-4">
                      {row.name}
                    </td>
                    {columns.map(([label, cell]) => (
                      <td
                        key={label}
                        className="px-2.5 py-2.5 text-right whitespace-nowrap"
                      >
                        {cell(row)}
                      </td>
                    ))}
                    <td className="py-2.5 pr-4 pl-2.5 text-right font-bold whitespace-nowrap">
                      {due(row)}
                    </td>
                  </tr>
                  {isOpen && row.detail && (
                    <tr className="border-b bg-muted">
                      <td
                        colSpan={columns.length + 3}
                        className="py-3 pr-4 pl-12 text-[13px]"
                      >
                        {row.detail}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              {expandable && <td />}
              <td className="px-2.5 py-2.5 first:pl-4">
                {t("manager.cycle.total")}
              </td>
              {columns.map(([label], index) => (
                <td key={label} className="px-2.5 py-2.5 text-right">
                  {index === 0 &&
                    formatNumber(
                      sum((row) => row.meals),
                      locale,
                    )}
                  {label === t("manager.cycle.colTotal") &&
                    money(sum((row) => row.total))}
                  {label === t("manager.cycle.colCredit") && (
                    <span className="text-(--tone-g-fg)">
                      −{money(sum((row) => row.credit))}
                    </span>
                  )}
                </td>
              ))}
              <td className="py-2.5 pr-4 pl-2.5 text-right font-bold">
                {money(sum((row) => Math.max(0, row.due)))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
