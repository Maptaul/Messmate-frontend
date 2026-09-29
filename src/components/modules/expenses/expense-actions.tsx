"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ExpenseForm from "@/components/form/expense-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteExpense } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { Expense } from "@/types";
import { getErrorMessage } from "@/utils";

export default function ExpenseActions({
  expense,
  cycleId,
  messId,
}: {
  expense: Expense;
  cycleId: string;
  messId: string;
}) {
  const t = useT();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: remove, isPending } = useDeleteExpense();

  const handleDelete = () => {
    remove(expense.id, {
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
          {t("manager.expenses.cancel")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          title={t("manager.expenses.deleteBody")}
        >
          {t("manager.expenses.deleteConfirm")}
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
          aria-label={t("manager.expenses.edit")}
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          aria-label={t("manager.expenses.delete")}
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("manager.expenses.editTitle")}</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            cycleId={cycleId}
            messId={messId}
            expense={expense}
            handleClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
