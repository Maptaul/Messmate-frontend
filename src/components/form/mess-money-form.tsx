"use client";

import StepNav, { StepCard } from "@/components/modules/mess-wizard/step-nav";
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
    listeners: { onChange: ({ formApi }) => setMoney(formApi.state.values) },
    onSubmit: ({ value }) => {
      setMoney(value);
      setStep(2);
    },
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <StepCard title={t("manager.wizard.moneyTitle")}>
        <form.AppField name="monthlyRent">
          {(field) => (
            <field.MoneyField
              label={t("manager.wizard.rent")}
              description={t("manager.wizard.rentHint")}
            />
          )}
        </form.AppField>
        <form.AppField name="monthlyDeposit">
          {(field) => (
            <field.MoneyField
              label={`${t("manager.wizard.deposit")} (${t("manager.wizard.optional")})`}
              description={t("manager.wizard.depositHint")}
            />
          )}
        </form.AppField>
      </StepCard>
      <StepNav onBack={() => setStep(0)} />
    </form>
  );
}
