"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import FileUpload from "@/components/ui/file-upload";
import { useActiveMembers, useAddExpense, useUpdateExpense } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { EXPENSE_TYPES, type Expense, SPLIT_METHODS } from "@/types";
import { formatBDT, getErrorMessage, todayInDhaka } from "@/utils";
import { RECEIPT_TYPES } from "@/utils/upload.util";
import { expenseSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

const FUND = "fund";

/** Add an expense, or edit one; the optional receipt uploads with a progress bar. */
export default function ExpenseForm({
  cycleId,
  messId,
  expense,
  handleClose,
}: {
  cycleId: string;
  messId: string;
  expense?: Expense;
  handleClose: () => void;
}) {
  const t = useT();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const { data: members } = useActiveMembers(messId);
  const { mutate: addExpense, isPending: addPending } = useAddExpense();
  const { mutate: updateExpense, isPending: updatePending } =
    useUpdateExpense();

  const form = useAppForm({
    defaultValues: {
      type: expense?.type ?? "GROCERY",
      amount: expense ? String(Number(expense.amount)) : "",
      splitMethod: expense?.splitMethod ?? "EQUAL",
      paidByMemberId: expense?.paidByMember?.id ?? FUND,
      description: expense?.description ?? "",
      spentAt: expense?.spentAt.slice(0, 10) ?? todayInDhaka(),
    },
    validators: { onChange: expenseSchema },
    onSubmit: ({ value }) => {
      const parsed = expenseSchema.parse(value);
      const fields = {
        ...parsed,
        paidByMemberId:
          parsed.paidByMemberId === FUND ? undefined : parsed.paidByMemberId,
        receipt: file ?? undefined,
        onProgress: setProgress,
      };

      const callbacks = {
        onSuccess: () => {
          toast.success(
            expense
              ? t("toast.expenseUpdated")
              : t("toast.expenseAdded", { amount: formatBDT(parsed.amount) }),
          );
          handleClose();
        },
        onError: (err: unknown) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          applyServerErrors(form, err);
        },
        onSettled: () => setProgress(null),
      };

      if (expense) {
        updateExpense({ expenseId: expense.id, ...fields }, callbacks);
      } else {
        addExpense({ cycleId, ...fields }, callbacks);
      }
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="type">
            {(field) => (
              <field.SelectField
                label={t("manager.expenses.formType")}
                options={EXPENSE_TYPES.map((type) => ({
                  value: type,
                  label: t(`expenseTypes.${type}`),
                }))}
              />
            )}
          </form.AppField>
          <form.AppField name="amount">
            {(field) => (
              <field.TextField
                label={t("manager.expenses.formAmount")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
              />
            )}
          </form.AppField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="splitMethod">
            {(field) => (
              <field.SelectField
                label={t("manager.expenses.formSplit")}
                options={SPLIT_METHODS.map((method) => ({
                  value: method,
                  label: t(`manager.expenses.splits.${method}`),
                }))}
              />
            )}
          </form.AppField>
          <form.AppField name="spentAt">
            {(field) => (
              <field.TextField
                label={t("manager.expenses.formDate")}
                type="date"
                max={todayInDhaka()}
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="paidByMemberId">
          {(field) => (
            <field.SelectField
              label={t("manager.expenses.formPaidBy")}
              options={[
                { value: FUND, label: t("manager.expenses.fundOption") },
                ...(members?.data ?? []).map((member) => ({
                  value: member.id,
                  label: member.user.name,
                })),
              ]}
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label={t("manager.expenses.formDescription")}
              rows={2}
            />
          )}
        </form.AppField>

        <FileUpload
          label={t("manager.expenses.formReceipt")}
          hint={t("upload.hintReceipt")}
          file={file}
          onChange={setFile}
          allowedTypes={RECEIPT_TYPES}
          progress={progress}
        />
        {expense?.receiptUrl && !file && (
          <a
            href={expense.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            {t("manager.expenses.currentReceipt")}
          </a>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("manager.expenses.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton isPending={addPending || updatePending}>
              {t("manager.expenses.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
