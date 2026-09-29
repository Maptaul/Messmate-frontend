"use client";

import { MailCheckIcon, RotateCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { applyServerErrors, useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useRegister, useVerifyEmail } from "@/hooks";
import { homeAfterLogin } from "@/lib/auth-redirect";
import { getErrorMessage } from "@/lib/errors";
import { usePendingRegistration } from "@/stores/pending-registration.store";
import { verifyEmailSchema } from "@/validation";
import { FormAlert } from "./form-alert";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter();
  const { mutateAsync: verify } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useRegister();
  const pending = usePendingRegistration((state) => state.payload);
  const clearPending = usePendingRegistration((state) => state.setPayload);
  const [formError, setFormError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const form = useAppForm({
    defaultValues: { otp: "" },
    validators: { onChange: verifyEmailSchema },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        const { data } = await verify({ email, otp: value.otp });
        clearPending(null);
        toast.success("Email confirmed — welcome to MessMate!");
        router.replace(homeAfterLogin(data.accessToken));
        router.refresh();
      } catch (error) {
        setFormError(getErrorMessage(error));
        applyServerErrors(form, error);
      }
    },
  });

  // Resending means registering again with the same details, which only this
  // tab still holds.
  const canResend = pending?.email === email;

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheckIcon className="size-6" aria-hidden />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>. It
          expires in 5 minutes.
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
          <form.AppField name="otp">
            {(field) => <field.OtpField label="Verification code" />}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton
              size="lg"
              className="w-full"
              pendingLabel="Verifying…"
            >
              Verify and continue
            </form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {canResend ? (
          <Button
            variant="link"
            disabled={cooldown > 0 || isResending}
            onClick={() =>
              resend(pending, {
                onSuccess: () => {
                  toast.success("A new code is on its way.");
                  setCooldown(RESEND_COOLDOWN_SECONDS);
                },
              })
            }
          >
            <RotateCwIcon />
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </Button>
        ) : (
          <p>
            Code expired?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Register again
            </Link>{" "}
            to get a new one.
          </p>
        )}
      </div>
    </div>
  );
}
