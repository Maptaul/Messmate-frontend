import { InboxIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  empty: { icon?: LucideIcon; title: string; description?: ReactNode };
  caption?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  caption,
}: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border bg-card">
        <EmptyState
          icon={empty.icon ?? InboxIcon}
          title={empty.title}
          description={empty.description}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
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
