"use client";

import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useReopenCycle } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatMonth, getErrorMessage } from "@/utils";

/** Admin only: withdraws a closed month's bills so the manager can fix it. */
export default function CycleReopenActions({
  cycleId,
  year,
  month,
}: {
  cycleId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const locale = useLocale();
  const [confirmReopen, setConfirmReopen] = useState(false);

  const { mutate: reopenCycle, isPending } = useReopenCycle();

  const handleReopen = () => {
    reopenCycle(cycleId, {
      onSuccess: () => {
        toast.success(
          t("toast.cycleReopened", { month: formatMonth(year, month, locale) }),
        );
        setConfirmReopen(false);
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  if (confirmReopen) {
    return (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmReopen(false)}
        >
          {t("admin.messDetail.cancel")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleReopen}
          disabled={isPending}
          title={t("admin.messDetail.reopenHint")}
        >
          {t("admin.messDetail.reopenConfirm")}
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setConfirmReopen(true)}>
      <RotateCcwIcon />
      {t("admin.messDetail.reopen")}
    </Button>
  );
}
