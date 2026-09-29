"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useRecordCash } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { CycleBill } from "@/types";
import { formatBDT, getErrorMessage, toNumber } from "@/utils";
import { cashPaymentSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

/** Records cash the member handed over — partial is fine, never more than is due. */
export default function CashPaymentForm({
  bill,
  handleClose,
}: {
  bill: CycleBill;
  handleClose: () => void;
}) {
  const t = useT();
  const locale = useLocale();

  const { mutate: recordCash, isPending } = useRecordCash();

  const due = toNumber(bill.dueAmount);
  const schema = cashPaymentSchema(due);

  const form = useAppForm({
    defaultValues: { amount: String(due), note: "" },
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      const parsed = schema.parse(value);
      recordCash(
        {
          billId: bill.id,
          amount: parsed.amount,
          note: parsed.note || undefined,
        },
        {
          onSuccess: () => {
            toast.success(
              t("toast.cashRecorded", {
                amount: formatBDT(parsed.amount, locale),
              }),
            );
            handleClose();
          },
          onError: (err) => {
            toast.error(t.dynamic(getErrorMessage(err)));
            applyServerErrors(form, err);
          },
        },
      );
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="amount">
          {(field) => (
            <field.TextField
              label={t("manager.bills.cashAmount")}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
            />
          )}
        </form.AppField>
        <form.AppField name="note">
          {(field) => <field.TextField label={t("manager.bills.cashNote")} />}
        </form.AppField>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("manager.bills.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton isPending={isPending}>
              {t("manager.bills.cashSubmit")}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
