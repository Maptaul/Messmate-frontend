"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import {
  useAddFinanceEntry,
  useFinanceCategories,
  useUpdateFinanceEntry,
} from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import {
  EXPENSE_CATEGORIES,
  type FinanceCategory,
  type FinanceEntry,
  INCOME_CATEGORIES,
} from "@/types";
import { getErrorMessage, todayInDhaka } from "@/utils";
import { financeEntrySchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

/** Add or edit one entry; the category list follows the chosen type. */
export default function FinanceEntryForm({
  entry,
  handleClose,
}: {
  entry?: FinanceEntry;
  handleClose: () => void;
}) {
  const t = useT();
  // The API's category lists; the built-in ones until they arrive.
  const { data: categories } = useFinanceCategories();

  const { mutate: addEntry, isPending: addPending } = useAddFinanceEntry();
  const { mutate: updateEntry, isPending: updatePending } =
    useUpdateFinanceEntry();

  const form = useAppForm({
    defaultValues: {
      type: entry?.type ?? "EXPENSE",
      category: entry?.category ?? "",
      amount: entry ? String(Number(entry.amount)) : "",
      date: entry?.date.slice(0, 10) ?? todayInDhaka(),
      note: entry?.note ?? "",
    },
    validators: { onChange: financeEntrySchema },
    onSubmit: ({ value }) => {
      const parsed = financeEntrySchema.parse(value);
      const payload = {
        type: parsed.type,
        category: parsed.category as FinanceCategory,
        amount: parsed.amount,
        date: parsed.date,
        note: parsed.note || undefined,
      };

      const callbacks = {
        onSuccess: () => {
          toast.success(t(entry ? "toast.saved" : "toast.entryAdded"));
          handleClose();
        },
        onError: (err: unknown) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          applyServerErrors(form, err);
        },
      };

      if (entry) {
        updateEntry({ entryId: entry.id, ...payload }, callbacks);
      } else {
        addEntry(payload, callbacks);
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
        <form.AppField
          name="type"
          listeners={{
            // A category from the other list would be rejected.
            onChange: () => form.setFieldValue("category", ""),
          }}
        >
          {(field) => (
            <field.SelectField
              label={t("finance.formType")}
              options={(["EXPENSE", "INCOME"] as const).map((type) => ({
                value: type,
                label: t(`status.${type}`),
              }))}
            />
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => state.values.type}>
          {(type) => (
            <form.AppField name="category">
              {(field) => (
                <field.SelectField
                  label={t("finance.formCategory")}
                  placeholder={t("finance.selectCategory")}
                  options={(type === "INCOME"
                    ? (categories?.data.INCOME ?? INCOME_CATEGORIES)
                    : (categories?.data.EXPENSE ?? EXPENSE_CATEGORIES)
                  ).map((category) => ({
                    value: category,
                    label: t.dynamic(`finance.categories.${category}`),
                  }))}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="amount">
            {(field) => <field.MoneyField label={t("finance.formAmount")} />}
          </form.AppField>
          <form.AppField name="date">
            {(field) => (
              <field.TextField
                label={t("finance.formDate")}
                type="date"
                max={todayInDhaka()}
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="note">
          {(field) => (
            <field.TextareaField label={t("finance.formNote")} rows={2} />
          )}
        </form.AppField>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("finance.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton isPending={addPending || updatePending}>
              {t("finance.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
