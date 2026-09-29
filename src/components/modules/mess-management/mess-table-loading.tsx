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

export default function MessTableLoading() {
  const t = useT();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.messes.mess")}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {t("admin.messes.members")}
            </TableHead>
            <TableHead>{t("admin.messes.rent")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {t("admin.messes.created")}
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
