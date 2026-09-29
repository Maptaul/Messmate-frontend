"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DepositForm from "@/components/form/deposit-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteDeposit } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { Deposit } from "@/types";
import { getErrorMessage } from "@/utils";

export default function DepositActions({
  deposit,
  cycleId,
  messId,
}: {
  deposit: Deposit;
  cycleId: string;
  messId: string;
}) {
  const t = useT();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: remove, isPending } = useDeleteDeposit();

  const handleDelete = () => {
    remove(deposit.id, {
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
          {t("manager.deposits.cancel")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          title={t("manager.deposits.deleteBody")}
        >
          {t("manager.deposits.deleteConfirm")}
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
          aria-label={t("manager.deposits.edit")}
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          aria-label={t("manager.deposits.delete")}
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("manager.deposits.editTitle")}</DialogTitle>
          </DialogHeader>
          <DepositForm
            cycleId={cycleId}
            messId={messId}
            deposit={deposit}
            handleClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
