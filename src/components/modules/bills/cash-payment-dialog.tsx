"use client";

import { BanknoteIcon } from "lucide-react";
import { useState } from "react";
import CashPaymentForm from "@/components/form/cash-payment-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { CycleBill } from "@/types";
import { formatBDT } from "@/utils";

export default function CashPaymentDialog({ bill }: { bill: CycleBill }) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <BanknoteIcon />
        {t("manager.bills.recordCash")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("manager.bills.cashTitle")}</DialogTitle>
          <DialogDescription>
            {t("manager.bills.cashBody", {
              name: bill.member.user.name,
              due: formatBDT(bill.dueAmount, locale),
            })}
          </DialogDescription>
        </DialogHeader>
        <CashPaymentForm bill={bill} handleClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
