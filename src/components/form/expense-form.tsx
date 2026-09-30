"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import FileUpload from "@/components/ui/file-upload";
import RadioCards from "@/components/ui/radio-cards";
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
      splitMethod: expense?.splitMethod ?? "BY_MEAL",
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
          <form.AppField
            name="type"
            listeners={{
              // Groceries feed the meal rate; bills are shared equally.
              onChange: ({ value }) =>
                form.setFieldValue(
                  "splitMethod",
                  value === "GROCERY" ? "BY_MEAL" : "EQUAL",
                ),
            }}
          >
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
              <field.MoneyField label={t("manager.expenses.formAmount")} />
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
        </div>
        <form.AppField name="splitMethod">
          {(field) => (
            <div className="flex flex-col gap-2">
              <span className="font-medium">
                {t("manager.expenses.formSplit")}
              </span>
              <RadioCards
                label={t("manager.expenses.formSplit")}
                value={field.state.value}
                onChange={field.handleChange}
                className="grid sm:grid-cols-2"
                options={SPLIT_METHODS.map((method) => ({
                  value: method,
                  label: t(`manager.expenses.splits.${method}`),
                  hint: t(`manager.expenses.splitHints.${method}`),
                }))}
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label={t("manager.expenses.formDescription")}
              description={`${field.state.value.length}/500`}
              maxLength={500}
              rows={2}
            />
          )}
        </form.AppField>

        <FileUpload
          label={t("manager.expenses.formReceipt")}
          prompt={t("manager.expenses.dropReceipt")}
          hint={t("manager.expenses.receiptRules")}
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
