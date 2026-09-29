"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCloseCycle } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { getErrorMessage } from "@/utils";

export default function CloseCycleDialog({
  cycleId,
  month,
  hasWarnings,
  open,
  onClose,
}: {
  cycleId: string;
  month: string;
  hasWarnings: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const router = useRouter();

  const { mutate: closeCycle, isPending } = useCloseCycle();

  const handleClose = () => {
    closeCycle(cycleId, {
      onSuccess: (res) => {
        toast.success(
          t("toast.cycleClosed", { month, count: res.data.bills.length }),
        );
        onClose();
        // The month page renders its status on the server.
        router.refresh();
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manager.cycle.closeTitle", { month })}</DialogTitle>
          <DialogDescription>
            {t("manager.cycle.closeBody")}
            {hasWarnings && ` ${t("manager.cycle.closeWithWarnings")}`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("manager.cycle.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleClose}
            disabled={isPending}
          >
            {t("manager.cycle.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
