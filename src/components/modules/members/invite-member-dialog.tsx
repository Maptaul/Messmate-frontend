"use client";

import { MailPlusIcon } from "lucide-react";
import { useState } from "react";
import InviteMemberForm from "@/components/form/invite-member-form";
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

export default function InviteMemberDialog({ messId }: { messId: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <MailPlusIcon />
        {t("manager.members.add")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manager.members.addTitle")}</DialogTitle>
          <DialogDescription>{t("manager.members.addBody")}</DialogDescription>
        </DialogHeader>
        <InviteMemberForm messId={messId} handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
