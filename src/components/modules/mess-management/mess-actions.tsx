"use client";

import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDeleteMess } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { Mess } from "@/types";
import { getErrorMessage } from "@/utils";

export default function MessActions({ mess }: { mess: Mess }) {
  const t = useT();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: remove, isPending } = useDeleteMess();

  const handleDelete = () => {
    remove(mess.id, {
      onSuccess: (res) => {
        toast.success(t("admin.toast.messDeleted", { name: res.data.name }));
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
          {t("admin.messes.cancel")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          title={t("admin.messes.deleteBody")}
        >
          {t("admin.messes.confirm")}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-destructive hover:text-destructive"
      aria-label={`${t("admin.messes.delete")}: ${mess.name}`}
      onClick={() => setConfirmDelete(true)}
    >
      <Trash2Icon />
    </Button>
  );
}
