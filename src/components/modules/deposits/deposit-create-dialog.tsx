"use client";

import { PlusIcon } from "lucide-react";
import DepositForm from "@/components/form/deposit-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCreateDialog from "@/hooks/create-dialog.hook";
import { useT } from "@/i18n/i18n-provider";

export default function DepositCreateDialog({
  cycleId,
  messId,
}: {
  cycleId: string;
  messId: string;
}) {
  const t = useT();
  const [open, setOpen] = useCreateDialog();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        {t("manager.deposits.add")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manager.deposits.addTitle")}</DialogTitle>
        </DialogHeader>
        <DepositForm
          cycleId={cycleId}
          messId={messId}
          handleClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
