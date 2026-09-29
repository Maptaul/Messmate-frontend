"use client";

import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import AddMemberForm from "@/components/form/add-member-form";
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

export default function AddMemberDialog({ messId }: { messId: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon />
        {t("manager.members.add")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manager.members.addTitle")}</DialogTitle>
          <DialogDescription>{t("manager.members.addBody")}</DialogDescription>
        </DialogHeader>
        <AddMemberForm messId={messId} handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
