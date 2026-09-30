"use client";

import StepNav, { StepCard } from "@/components/modules/mess-wizard/step-nav";
import { useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";
import { messDetailsSchema } from "@/validation";
import { useAppForm } from ".";

export default function MessDetailsForm() {
  const t = useT();
  const { details, setDetails, setStep } = useMessWizard();

  const form = useAppForm({
    defaultValues: details,
    validators: { onChange: messDetailsSchema },
    listeners: { onChange: ({ formApi }) => setDetails(formApi.state.values) },
    onSubmit: ({ value }) => {
      setDetails(messDetailsSchema.parse(value));
      setStep(1);
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
      <StepCard title={t("manager.wizard.detailsTitle")}>
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label={t("manager.wizard.name")}
              placeholder={t("manager.wizard.namePlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="address">
          {(field) => (
            <field.TextareaField
              label={t("manager.wizard.address")}
              placeholder={t("manager.wizard.addressPlaceholder")}
              description={t("manager.wizard.addressHint")}
              rows={2}
            />
          )}
        </form.AppField>
      </StepCard>
      <StepNav />
    </form>
  );
}
