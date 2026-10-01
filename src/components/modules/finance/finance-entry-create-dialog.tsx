"use client";

import { PlusIcon } from "lucide-react";
import FinanceEntryForm from "@/components/form/finance-entry-form";
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

export default function FinanceEntryCreateDialog() {
  const t = useT();
  const [open, setOpen] = useCreateDialog();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        {t("finance.add")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("finance.addTitle")}</DialogTitle>
        </DialogHeader>
        <FinanceEntryForm handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
