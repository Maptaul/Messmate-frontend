"use client";

import { FileDownIcon } from "lucide-react";
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
import { useT } from "@/i18n/i18n-provider";
import type { BillMoney } from "@/types";
import BillInvoice from "./bill-invoice";

export default function BillInvoiceDialog({
  bill,
  messName,
  memberName,
  period,
  fileName,
}: {
  bill: BillMoney;
  messName: string;
  memberName: string;
  period: string;
  /** Becomes the suggested PDF file name in the print window. */
  fileName: string;
}) {
  const t = useT();

  const handleDownload = () => {
    const title = document.title;
    document.title = fileName;
    window.print();
    document.title = title;
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            aria-label={t("invoice.openAria", { period })}
          />
        }
      >
        <FileDownIcon />
        {t("invoice.open")}
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("invoice.title")}</DialogTitle>
          <DialogDescription>{t("invoice.hint")}</DialogDescription>
        </DialogHeader>
        <BillInvoice
          bill={bill}
          messName={messName}
          memberName={memberName}
          period={period}
        />
        <DialogFooter>
          <Button onClick={handleDownload}>
            <FileDownIcon />
            {t("invoice.download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
