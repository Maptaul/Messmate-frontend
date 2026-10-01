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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useT } from "@/i18n/i18n-provider";
import type { BillMoney } from "@/types";
import BillInvoice from "./bill-invoice";

/**
 * One member's bill, itemised. "PDF" opens it ready to print; "Breakdown"
 * slides it in from the side to read.
 */
export default function BillInvoiceDialog({
  bill,
  messName,
  memberName,
  period,
  fileName,
  variant = "pdf",
  label,
  className,
}: {
  bill: BillMoney;
  messName: string;
  memberName: string;
  period: string;
  /** Becomes the suggested PDF file name in the print window. */
  fileName: string;
  variant?: "pdf" | "breakdown";
  /** The trigger's text, when the default ("PDF", "Breakdown") is too short. */
  label?: string;
  className?: string;
}) {
  const t = useT();

  const handleDownload = () => {
    const title = document.title;
    document.title = fileName;
    window.print();
    document.title = title;
  };

  const invoice = (
    <BillInvoice
      bill={bill}
      messName={messName}
      memberName={memberName}
      period={period}
    />
  );
  const download = (
    <Button onClick={handleDownload}>
      <FileDownIcon />
      {t("invoice.download")}
    </Button>
  );

  if (variant === "breakdown") {
    return (
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="link"
              size="sm"
              className={className}
              aria-label={t("invoice.breakdownAria", { name: memberName })}
            />
          }
        >
          {label ?? t("invoice.breakdown")}
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{memberName}</SheetTitle>
            <SheetDescription>{period}</SheetDescription>
          </SheetHeader>
          <div className="px-4">{invoice}</div>
          <SheetFooter>{download}</SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={className}
            aria-label={t("invoice.openAria", { period })}
          />
        }
      >
        <FileDownIcon />
        {label ?? t("invoice.open")}
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("invoice.title")}</DialogTitle>
          <DialogDescription>{t("invoice.hint")}</DialogDescription>
        </DialogHeader>
        {invoice}
        <DialogFooter>{download}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
