import { InboxIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import EmptyState from "./empty-state";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty: {
    icon?: LucideIcon;
    title: string;
    description?: ReactNode;
    action?: ReactNode;
  };
  caption?: string;
  /** Totals row. */
  footer?: ReactNode;
  /** Inside a Panel that already draws the card. */
  bare?: boolean;
}

const HEAD = "micro h-auto bg-muted px-3 py-2.5 first:pl-4 last:pr-4";
const CELL = "px-3 py-2.5 first:pl-4 last:pr-4";

/**
 * The design's table: micro-label header on a muted band, tabular numbers,
 * hover rows. Below `md` every row becomes a card — the first column is the
 * title, labelled columns become label/value pairs and the unlabelled last
 * column (row actions) sits at the bottom.
 */
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  caption,
  footer,
  bare,
}: Props<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={empty.icon ?? InboxIcon}
        title={empty.title}
        description={empty.description}
        action={empty.action}
      />
    );
  }

  const [first, ...rest] = columns;
  const labelled = rest.filter((column) => typeof column.header === "string");
  const actions = rest.filter((column) => typeof column.header !== "string");

  return (
    <>
      <div
        className={cn(
          "hidden overflow-hidden md:block",
          !bare && "rounded-xl border bg-card shadow-1",
        )}
      >
        <Table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(HEAD, column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={rowKey(row)} className="hover:bg-accent/70">
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(CELL, column.className)}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {footer && (
            <TableFooter className="bg-transparent font-semibold">
              {footer}
            </TableFooter>
          )}
        </Table>
      </div>

      <ul
        className={cn("flex flex-col gap-2 md:hidden", bare && "p-3")}
        aria-label={caption}
      >
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            className="flex flex-col gap-2.5 rounded-xl border bg-card p-3.5 shadow-1"
          >
            <div className="min-w-0">{first.cell(row)}</div>
            {labelled.length > 0 && (
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
                {labelled.map((column) => (
                  <div key={column.key} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">
                      {column.header}
                    </dt>
                    <dd className="truncate tabular-nums">
                      {column.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {actions.map((column) => (
              <div key={column.key} className="flex justify-end">
                {column.cell(row)}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}
