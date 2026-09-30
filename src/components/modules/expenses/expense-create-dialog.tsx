"use client";

import { PlusIcon } from "lucide-react";
import ExpenseForm from "@/components/form/expense-form";
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

export default function ExpenseCreateDialog({
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
        {t("manager.expenses.add")}
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("manager.expenses.addTitle")}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          cycleId={cycleId}
          messId={messId}
          handleClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
