"use client";

import { CalendarPlusIcon } from "lucide-react";
import DutyForm from "@/components/form/duty-form";
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

export default function DutyCreateDialog({
  cycleId,
  messId,
  year,
  month,
}: {
  cycleId: string;
  messId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const [open, setOpen] = useCreateDialog();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <CalendarPlusIcon />
        {t("manager.duty.add")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manager.duty.addTitle")}</DialogTitle>
        </DialogHeader>
        <DutyForm
          cycleId={cycleId}
          messId={messId}
          year={year}
          month={month}
          handleClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
