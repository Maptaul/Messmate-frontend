"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export default function InlineConfirm({
  confirmLabel,
  onConfirm,
  onCancel,
  hint,
  pending,
  tone = "destructive",
  className,
}: {
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  hint?: string;
  pending?: boolean;
  tone?: "destructive" | "primary";
  className?: string;
}) {
  const t = useT();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-1.5",
        className,
      )}
    >
      {hint && (
        <span className="max-w-70 text-right text-xs text-pretty text-muted-foreground">
          {hint}
        </span>
      )}
      <Button variant="outline" size="sm" onClick={onCancel}>
        {t("common.cancel")}
      </Button>
      <Button
        size="sm"
        onClick={onConfirm}
        disabled={pending}
        className={
          tone === "destructive"
            ? "bg-destructive text-white hover:bg-destructive/90 dark:text-white"
            : undefined
        }
      >
        {pending && <Spinner />}
        {confirmLabel}
      </Button>
    </div>
  );
}
