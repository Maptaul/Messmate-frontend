"use client";

import { InfoIcon, PlusIcon, XIcon } from "lucide-react";
import StepNav, { StepCard } from "@/components/modules/mess-wizard/step-nav";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";
import { addMemberSchema } from "@/validation";
import { useAppForm } from ".";

export default function MessMembersForm() {
  const t = useT();
  const { memberEmails, addEmail, removeEmail, setStep } = useMessWizard();

  const form = useAppForm({
    defaultValues: { email: "" },
    validators: {
      onChange: addMemberSchema.refine(
        ({ email }) => !memberEmails.includes(email.trim().toLowerCase()),
        { message: "manager.wizard.duplicate", path: ["email"] },
      ),
    },
    onSubmit: ({ value, formApi }) => {
      addEmail(value.email.trim().toLowerCase());
      formApi.reset();
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <StepCard title={t("manager.wizard.membersTitle")}>
        <form
          noValidate
          className="flex flex-wrap items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="min-w-55 flex-1">
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label={t("manager.wizard.memberEmail")}
                  type="email"
                  autoComplete="off"
                  placeholder="name@example.com"
                />
              )}
            </form.AppField>
          </div>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="mt-[1.625rem] px-3.5"
          >
            <PlusIcon />
            {t("manager.wizard.addMember")}
          </Button>
        </form>

        <p className="tone-b flex gap-2 rounded-xl border px-3 py-2.5">
          <InfoIcon className="mt-0.5 size-4 shrink-0" />
          {t("manager.members.mustHave")}
        </p>

        {memberEmails.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {memberEmails.map((email) => (
              <li
                key={email}
                className="flex h-7 items-center gap-1.5 rounded-full border bg-muted pr-1 pl-2.5"
              >
                {email}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="rounded-full"
                  aria-label={t("manager.wizard.removeMember", { email })}
                  onClick={() => removeEmail(email)}
                >
                  <XIcon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </StepCard>
      <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
    </div>
  );
}
