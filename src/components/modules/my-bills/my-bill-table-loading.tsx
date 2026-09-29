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

export default function MyBillTableLoading() {
  const t = useT();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("resident.bills.month")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("resident.bills.payable")}
            </TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("resident.bills.paid")}
            </TableHead>
            <TableHead>{t("resident.bills.due")}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("resident.bills.status")}
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item}>
              <TableCell colSpan={6}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
