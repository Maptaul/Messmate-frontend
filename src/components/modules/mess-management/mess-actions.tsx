"use client";

import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import InlineConfirm from "@/components/ui/inline-confirm";
import { useDeleteMess } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import type { Mess } from "@/types";
import { getErrorMessage } from "@/utils";

/** View, and delete with an in-row confirm; the API refuses while a month is open. */
export default function MessActions({ mess }: { mess: Mess }) {
  const t = useT();
  const href = useLocalePath();
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
        setConfirmDelete(false);
      },
    });
  };

  if (confirmDelete) {
    return (
      <InlineConfirm
        confirmLabel={t("admin.messes.confirm")}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        pending={isPending}
      />
    );
  }

  return (
    <div className="flex items-center justify-end gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        render={<Link href={href(`/admin/messes/${mess.id}`)} />}
        nativeButton={false}
      >
        {t("admin.messes.view")}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:bg-destructive-tint hover:text-destructive"
        aria-label={`${t("admin.messes.delete")}: ${mess.name}`}
        onClick={() => setConfirmDelete(true)}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}
