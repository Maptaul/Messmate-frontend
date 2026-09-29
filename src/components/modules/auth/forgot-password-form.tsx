"use client";

import { KeyRoundIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { applyServerErrors, useAppForm } from "@/components/form";
import { FieldGroup } from "@/components/ui/field";
import { useForgotPassword, useResetPassword } from "@/hooks";
import { getErrorMessage } from "@/lib/errors";
import { forgotPasswordSchema, resetPasswordSchema } from "@/validation";
import { FormAlert } from "./form-alert";

/** Step 1 asks for the email; step 2 takes the emailed code and a new password. */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRoundIcon className="size-6" aria-hidden />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          {email ? "Set a new password" : "Forgot your password?"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {email
            ? `Enter the code we sent to ${email} and choose a new password.`
            : "Enter your account email and we'll send you a reset code."}
        </p>
      </div>

      {email ? (
        <ResetStep email={email} onBack={() => setEmail(null)} />
      ) : (
        <EmailStep onSent={setEmail} />
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to log in
        </Link>
      </p>
    </div>
  );
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const { mutateAsync: sendCode } = useForgotPassword();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const email = value.email.trim();
      try {
        await sendCode(email);
        onSent(email);
      } catch (error) {
        setFormError(getErrorMessage(error));
        applyServerErrors(form, error);
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FormAlert message={formError} />
        <form.AppField name="email">
          {(field) => (
            <field.TextField label="Email" type="email" autoComplete="email" />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton
            size="lg"
            className="w-full"
            pendingLabel="Sending…"
          >
            Send reset code
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

function ResetStep({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter();
  const { mutateAsync: reset } = useResetPassword();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
    validators: { onChange: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        await reset({ email, otp: value.otp, newPassword: value.newPassword });
        toast.success("Password changed. Log in with your new password.");
        router.push(`/login?email=${encodeURIComponent(email)}`);
      } catch (error) {
        setFormError(getErrorMessage(error));
        applyServerErrors(form, error);
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FormAlert message={formError} />
        <form.AppField name="otp">
          {(field) => <field.OtpField label="Reset code" />}
        </form.AppField>
        <form.AppField name="newPassword">
          {(field) => (
            <field.PasswordField
              label="New password"
              autoComplete="new-password"
              description="8+ characters with upper and lower case, a number and a symbol."
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordField
              label="Confirm new password"
              autoComplete="new-password"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton
            size="lg"
            className="w-full"
            pendingLabel="Saving…"
          >
            Change password
          </form.SubmitButton>
        </form.AppForm>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Use a different email
        </button>
      </FieldGroup>
    </form>
  );
}
