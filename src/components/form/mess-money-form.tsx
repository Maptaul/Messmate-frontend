"use client";

import StepNav from "@/components/modules/mess-wizard/step-nav";
import { FieldGroup } from "@/components/ui/field";
import { useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";
import { messMoneySchema } from "@/validation";
import { useAppForm } from ".";

export default function MessMoneyForm() {
  const t = useT();
  const { money, setMoney, setStep } = useMessWizard();

  const form = useAppForm({
    defaultValues: money,
    validators: { onChange: messMoneySchema },
    onSubmit: ({ value }) => {
      setMoney(value);
      setStep(2);
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
        <form.AppField name="monthlyRent">
          {(field) => (
            <field.TextField
              label={t("manager.wizard.rent")}
              description={t("manager.wizard.rentHint")}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
            />
          )}
        </form.AppField>
        <form.AppField name="monthlyDeposit">
          {(field) => (
            <field.TextField
              label={t("manager.wizard.deposit")}
              description={t("manager.wizard.depositHint")}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
            />
          )}
        </form.AppField>
        <StepNav onBack={() => setStep(0)} />
      </FieldGroup>
    </form>
  );
}
