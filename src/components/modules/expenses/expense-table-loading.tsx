"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useT } from "@/i18n/i18n-provider";

export default function ExpenseTableLoading() {
  const t = useT();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("manager.expenses.date")}</TableHead>
            <TableHead>{t("manager.expenses.type")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("manager.expenses.paidBy")}
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              {t("manager.expenses.split")}
            </TableHead>
            <TableHead>{t("manager.expenses.amount")}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("manager.expenses.receipt")}
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item}>
              <TableCell colSpan={7}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
