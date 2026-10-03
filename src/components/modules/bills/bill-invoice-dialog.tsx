"use client";

import { FileDownIcon } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useDownloadBillPdf } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { BillMoney } from "@/types";
import { downloadFile, getErrorMessage } from "@/utils";
import BillInvoice from "./bill-invoice";

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
  /** The downloaded file's name, without the extension. */
  fileName: string;
  variant?: "pdf" | "breakdown";
  label?: string;
  className?: string;
}) {
  const t = useT();
  const { mutate: downloadPdf, isPending } = useDownloadBillPdf();

  const handleDownload = () => {
    downloadPdf(bill.id, {
      onSuccess: (file) => downloadFile(file, `${fileName}.pdf`),
      onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
    });
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
    <Button onClick={handleDownload} disabled={isPending}>
      {isPending ? <Spinner /> : <FileDownIcon />}
      {isPending ? t("invoice.downloading") : t("invoice.download")}
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
