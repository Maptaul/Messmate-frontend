"use client";

import { CalendarCheckIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCloseCycle, useSettlementPreview } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatNumber, getErrorMessage } from "@/utils";

/** "Close this month", with what closing does spelled out before it happens. */
export default function CloseCycleDialog({
  cycleId,
  month,
}: {
  cycleId: string;
  month: string;
}) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { data: preview } = useSettlementPreview(cycleId);
  const { mutate: closeCycle, isPending } = useCloseCycle();

  const count = formatNumber(preview?.data.bills.length ?? 0, locale);

  const handleClose = () => {
    closeCycle(cycleId, {
      onSuccess: (res) => {
        setOpen(false);
        // The page is rendered on the server; `closed` shows the banner.
        router.replace(`${pathname}?closed=${res.data.bills.length}`);
        router.refresh();
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button />}>
        <CalendarCheckIcon />
        {t("manager.cycle.close")}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-primary-tint text-primary">
            <CalendarCheckIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {t("manager.cycle.closeTitle", { month })}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-muted-foreground">
          <li>{t("manager.cycle.closeList1", { count })}</li>
          <li>{t("manager.cycle.closeList2")}</li>
          <li>{t("manager.cycle.closeList3")}</li>
          <li>{t("manager.cycle.closeList4")}</li>
        </ul>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("manager.cycle.cancel")}
          </AlertDialogCancel>
          <Button onClick={handleClose} disabled={isPending}>
            {isPending && <Spinner />}
            {isPending
              ? t("manager.cycle.closing")
              : t("manager.cycle.confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
