"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useT } from "@/i18n/i18n-provider";
import type { AuditLog } from "@/types";

const show = (value: unknown) => {
  if (value === undefined || value === null) return "—";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

/** Before/after of one audit entry, one row per field that was recorded. */
export default function AuditChangeDialog({ log }: { log: AuditLog }) {
  const t = useT();
  const fields = [
    ...new Set([
      ...Object.keys(log.before ?? {}),
      ...Object.keys(log.after ?? {}),
    ]),
  ];

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        {t("audit.viewChange")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("audit.changeTitle")}</DialogTitle>
          <DialogDescription>
            {t(`audit.actions.${log.action}`)}
            {log.subjectMember
              ? ` · ${t("audit.about", { name: log.subjectMember.user.name })}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("audit.noDetails")}
          </p>
        ) : (
          <div className="max-h-80 overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("audit.field")}</TableHead>
                  <TableHead>{t("audit.before")}</TableHead>
                  <TableHead>{t("audit.after")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field}>
                    <TableCell className="font-medium">{field}</TableCell>
                    <TableCell className="break-all text-muted-foreground">
                      {show(log.before?.[field])}
                    </TableCell>
                    <TableCell className="break-all">
                      {show(log.after?.[field])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
