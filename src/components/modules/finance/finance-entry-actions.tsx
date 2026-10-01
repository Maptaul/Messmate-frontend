"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FinanceEntryForm from "@/components/form/finance-entry-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InlineConfirm from "@/components/ui/inline-confirm";
import { useDeleteFinanceEntry } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { FinanceEntry } from "@/types";
import { getErrorMessage } from "@/utils";

export default function FinanceEntryActions({
  entry,
}: {
  entry: FinanceEntry;
}) {
  const t = useT();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: remove, isPending } = useDeleteFinanceEntry();

  const handleDelete = () => {
    remove(entry.id, {
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
        hint={t("finance.deleteBody")}
        confirmLabel={t("finance.deleteConfirm")}
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
          aria-label={t("finance.edit")}
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive-tint hover:text-destructive"
          aria-label={t("finance.delete")}
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("finance.editTitle")}</DialogTitle>
          </DialogHeader>
          <FinanceEntryForm
            entry={entry}
            handleClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
