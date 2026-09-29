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

export default function DutyTableLoading() {
  const t = useT();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("manager.duty.member")}</TableHead>
            <TableHead>{t("manager.duty.from")}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("manager.duty.days")}
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((item) => (
            <TableRow key={item}>
              <TableCell colSpan={4}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
