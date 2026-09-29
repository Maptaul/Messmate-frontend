"use client";

import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { applyServerErrors, useAppForm } from "@/components/form";
import { FieldGroup } from "@/components/ui/field";
import { useRegister } from "@/hooks";
import { getErrorMessage } from "@/lib/errors";
import { usePendingRegistration } from "@/stores/pending-registration.store";
import type { RegisterPayload } from "@/types";
import { registerSchema } from "@/validation";
import { FormAlert } from "./form-alert";

const ROLE_OPTIONS = [
  {
    value: "MEMBER",
    title: "I live in a mess",
    description: "Plan meals, see the ledger, pay my bill.",
  },
  {
    value: "MESS_MANAGER",
    title: "I run a mess",
    description: "Add members, record expenses, close the month.",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const { mutateAsync: createAccount } = useRegister();
  const setPending = usePendingRegistration((state) => state.setPayload);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "MEMBER",
      password: "",
      confirmPassword: "",
    },
    validators: { onChange: registerSchema },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const {
        confirmPassword: _,
        phone,
        ...rest
      } = registerSchema.parse(value);
      const payload: RegisterPayload = { ...rest, ...(phone ? { phone } : {}) };

      try {
        await createAccount(payload);
        setPending(payload);
        router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`);
      } catch (error) {
        setFormError(getErrorMessage(error));
        applyServerErrors(form, error);
      }
    },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          We'll email you a 6-digit code to confirm it's you.
        </p>
      </div>

      <FormAlert message={formError} />

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="role">
            {(field) => (
              <field.RadioCardsField
                label="How will you use MessMate?"
                options={ROLE_OPTIONS}
              />
            )}
          </form.AppField>
          <form.AppField name="name">
            {(field) => (
              <field.TextField label="Full name" autoComplete="name" />
            )}
          </form.AppField>
          <div className="grid gap-6 sm:grid-cols-2">
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              )}
            </form.AppField>
            <form.AppField name="phone">
              {(field) => (
                <field.TextField
                  label="Phone (optional)"
                  type="tel"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="password">
            {(field) => (
              <field.PasswordField
                label="Password"
                autoComplete="new-password"
                description="8+ characters with upper and lower case, a number and a symbol."
              />
            )}
          </form.AppField>
          <form.AppField name="confirmPassword">
            {(field) => (
              <field.PasswordField
                label="Confirm password"
                autoComplete="new-password"
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton
              size="lg"
              className="w-full"
              pendingLabel="Sending code…"
            >
              <UserPlusIcon />
              Create account
            </form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
