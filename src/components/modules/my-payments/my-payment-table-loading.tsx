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

export default function MyPaymentTableLoading() {
  const t = useT();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">
              {t("resident.payments.date")}
            </TableHead>
            <TableHead>{t("resident.payments.month")}</TableHead>
            <TableHead>{t("resident.payments.amount")}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("resident.payments.method")}
            </TableHead>
            <TableHead>{t("resident.payments.status")}</TableHead>
            <TableHead className="hidden lg:table-cell">
              {t("resident.payments.invoice")}
            </TableHead>
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
