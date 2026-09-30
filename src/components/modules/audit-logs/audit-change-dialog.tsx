"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { AuditLog } from "@/types";
import { formatDateTime } from "@/utils";

const show = (value: unknown) => {
  if (value === undefined || value === null) return "—";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
};

/**
 * "View change": a side sheet with the entity and a before/after row per
 * recorded field — the old value struck through, the new one in green.
 */
export default function AuditChangeDialog({
  log,
  variant = "ghost",
}: {
  log: AuditLog;
  variant?: "ghost" | "outline" | "link";
}) {
  const t = useT();
  const locale = useLocale();
  const fields = [
    ...new Set([
      ...Object.keys(log.before ?? {}),
      ...Object.keys(log.after ?? {}),
    ]),
  ];

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant={variant}
            size="sm"
            className={cn(variant === "link" && "h-auto px-0")}
          />
        }
      >
        {t("audit.viewChange")}
      </SheetTrigger>
      <SheetContent className="w-full gap-4 overflow-y-auto p-6 sm:max-w-115">
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg">
            {t(`audit.actions.${log.action}`)}
          </SheetTitle>
          <SheetDescription>
            {log.actor.name} · {formatDateTime(log.createdAt, locale)}
          </SheetDescription>
        </SheetHeader>

        <p className="flex flex-wrap gap-2 text-[13px]">
          <span className="text-muted-foreground">
            {t("admin.auditPage.entity")}
          </span>
          <b>{log.entity}</b>
          <span className="font-mono text-muted-foreground">
            {log.entityId.slice(0, 4)}…{log.entityId.slice(-4)}
          </span>
          {log.subjectMember && (
            <span className="text-muted-foreground">
              · {t("audit.about", { name: log.subjectMember.user.name })}
            </span>
          )}
        </p>

        {fields.length === 0 ? (
          <p className="text-muted-foreground">{t("audit.noDetails")}</p>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <div className="grid grid-cols-[110px_1fr_1fr] bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
              <span>{t("audit.field")}</span>
              <span>{t("audit.before")}</span>
              <span>{t("audit.after")}</span>
            </div>
            {fields.map((field) => {
              const before = show(log.before?.[field]);
              return (
                <div
                  key={field}
                  className="grid grid-cols-[110px_1fr_1fr] gap-2 border-t px-3 py-2.5"
                >
                  <span className="font-mono text-xs break-all text-muted-foreground">
                    {field}
                  </span>
                  <span
                    className={cn(
                      "break-all text-(--tone-r-fg)",
                      before !== "—" && "line-through",
                    )}
                  >
                    {before}
                  </span>
                  <span className="font-medium break-all text-(--tone-g-fg)">
                    {show(log.after?.[field])}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
