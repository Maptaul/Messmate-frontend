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

export default function DepositTableLoading() {
  const t = useT();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("manager.deposits.date")}</TableHead>
            <TableHead>{t("manager.deposits.member")}</TableHead>
            <TableHead>{t("manager.deposits.amount")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("manager.deposits.by")}
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item}>
              <TableCell colSpan={5}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
