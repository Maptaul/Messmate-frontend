"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteMess } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import type { MessDetail } from "@/types";
import { getErrorMessage } from "@/utils";

export default function DeleteMessDialog({ mess }: { mess: MessDetail }) {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");

  const { mutate: deleteMess, isPending } = useDeleteMess();

  const handleDelete = () => {
    deleteMess(mess.id, {
      onSuccess: (res) => {
        toast.success(t("admin.toast.messDeleted", { name: res.data.name }));
        router.replace(href("/manager/messes"));
        router.refresh();
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTyped("");
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-destructive text-white hover:bg-destructive/90 dark:text-white" />
        }
      >
        <Trash2Icon />
        {t("manager.settings.deleteButton")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("manager.settings.deleteTitle", { name: mess.name })}
          </DialogTitle>
          <DialogDescription>
            {t("manager.settings.dangerBody")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label htmlFor="confirm-name" className="text-sm font-medium">
            {t("manager.settings.typeName", { name: mess.name })}
          </label>
          <Input
            id="confirm-name"
            placeholder={mess.name}
            value={typed}
            autoComplete="off"
            onChange={(e) => setTyped(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t("manager.settings.cancel")}
          </Button>
          <Button
            type="button"
            className="bg-destructive text-white hover:bg-destructive/90 dark:text-white"
            disabled={typed.trim() !== mess.name || isPending}
            onClick={handleDelete}
          >
            {isPending && <Spinner />}
            {t("manager.settings.deleteConfirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
