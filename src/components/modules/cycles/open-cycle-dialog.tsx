"use client";

import { CalendarPlusIcon } from "lucide-react";
import { useState } from "react";
import OpenCycleForm from "@/components/form/open-cycle-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useT } from "@/i18n/i18n-provider";

export default function OpenCycleDialog({
  messId,
  openMonth,
}: {
  messId: string;
  /** The month already open, if any - a mess can only have one. */
  openMonth?: string;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);

  if (openMonth) {
    return (
      <span title={t("manager.cycles.oneOpen", { month: openMonth })}>
        <Button disabled>
          <CalendarPlusIcon />
          {t("manager.cycles.open")}
        </Button>
      </span>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <CalendarPlusIcon />
        {t("manager.cycles.open")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manager.cycles.openTitle")}</DialogTitle>
          <DialogDescription>{t("manager.cycles.openBody")}</DialogDescription>
        </DialogHeader>
        <OpenCycleForm messId={messId} handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
