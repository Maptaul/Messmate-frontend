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
import InlineConfirm from "@/components/ui/inline-confirm";
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
      <InlineConfirm
        hint={t("manager.expenses.deleteBody")}
        confirmLabel={t("manager.expenses.deleteConfirm")}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        pending={isPending}
      />
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
          className="text-destructive hover:bg-destructive-tint hover:text-destructive"
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
