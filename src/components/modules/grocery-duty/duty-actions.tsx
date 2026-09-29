"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DutyForm from "@/components/form/duty-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRemoveDuty } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { GroceryDuty } from "@/types";
import { getErrorMessage } from "@/utils";

export default function DutyActions({
  duty,
  cycleId,
  messId,
  year,
  month,
}: {
  duty: GroceryDuty;
  cycleId: string;
  messId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: remove, isPending } = useRemoveDuty();

  const handleDelete = () => {
    remove(duty.id, {
      onSuccess: () => {
        toast.success(t("toast.deleted"));
        setConfirmDelete(false);
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  if (confirmDelete) {
    return (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmDelete(false)}
        >
          {t("manager.duty.cancel")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          title={t("manager.duty.deleteBody")}
        >
          {t("manager.duty.deleteConfirm")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("manager.duty.edit")}
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          aria-label={t("manager.duty.delete")}
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("manager.duty.editTitle")}</DialogTitle>
          </DialogHeader>
          <DutyForm
            cycleId={cycleId}
            messId={messId}
            year={year}
            month={month}
            duty={duty}
            handleClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
