import { InboxIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string;
  /** First load, nothing to show yet. */
  isLoading?: boolean;
  /** Refetching behind existing rows (new page, new filter). */
  isFetching?: boolean;
  empty: { icon?: LucideIcon; title: string; description?: ReactNode };
  caption?: string;
}

/**
 * Server-paginated tables are all the same shape here: columns, rows, a
 * skeleton on first load, dimmed rows while the next page loads, and an
 * empty state that says why it is empty.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  isFetching,
  empty,
  caption,
}: DataTableProps<T>) {
  if (!isLoading && rows?.length === 0) {
    return (
      <div className="rounded-xl border">
        <EmptyState
          icon={empty.icon ?? InboxIcon}
          title={empty.title}
          description={empty.description}
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      <Table aria-busy={isLoading || isFetching}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody
          className={cn(
            isFetching && !isLoading && "opacity-60 transition-opacity",
          )}
        >
          {isLoading || !rows
            ? Array.from({ length: 5 }, (_, row) => row).map((row) => (
                <TableRow key={row}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
