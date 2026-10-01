"use client";

import { MailCheckIcon, RotateCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { applyServerErrors, useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useRegistration, useVerifyAccount } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { usePendingRegistration } from "@/stores/pending-registration.store";
import { formatNumber, getErrorMessage, homeAfterLogin } from "@/utils";
import { verifyAccountSchema } from "@/validation";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyAccountForm({ email }: { email: string }) {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const { mutate: verify, isPending } = useVerifyAccount();
  const { mutate: resend, isPending: isResending } = useRegistration();
  const pending = usePendingRegistration((state) => state.payload);
  const clearPending = usePendingRegistration((state) => state.setPayload);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const form = useAppForm({
    defaultValues: { otp: "" },
    validators: { onChange: verifyAccountSchema },
    onSubmit: ({ value }) => {
      verify(
        { email, otp: value.otp },
        {
          onSuccess: (res) => {
            clearPending(null);
            toast.success(t("auth.verify.welcome"));
            router.replace(homeAfterLogin(res.data.accessToken, locale));
            router.refresh();
          },
          onError: (err) => {
            toast.error(t.dynamic(getErrorMessage(err)));
            applyServerErrors(form, err);
          },
        },
      );
    },
  });

  // Resending means registering again with the same details, which only this
  // tab still holds.
  const canResend = pending?.email === email;

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex flex-col gap-3">
        <span className="grid size-12 place-items-center rounded-xl bg-primary-tint text-primary">
          <MailCheckIcon className="size-5.5" aria-hidden />
        </span>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight">
          {t("auth.verify.title")}
        </h1>
        <p className="leading-relaxed text-foreground-2">
          {t("auth.verify.sentTo", { email })}
        </p>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="otp">
            {(field) => <field.OtpField label={t("auth.verify.code")} />}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton
              isPending={isPending}
              size="lg"
              className="w-full"
              pendingLabel={t("auth.verify.submitting")}
            >
              {t("auth.verify.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>

      <div className="text-[13.5px] text-muted-foreground">
        {canResend ? (
          <Button
            variant="link"
            disabled={cooldown > 0 || isResending}
            onClick={() =>
              resend(pending, {
                onSuccess: () => {
                  toast.success(t("auth.verify.resent"));
                  setCooldown(RESEND_COOLDOWN_SECONDS);
                },
              })
            }
          >
            <RotateCwIcon />
            {cooldown > 0
              ? t("auth.verify.resendIn", {
                  seconds: formatNumber(cooldown, locale),
                })
              : t("auth.verify.resend")}
          </Button>
        ) : (
          <p>
            {t("auth.verify.expired")}{" "}
            <Link
              href={href("/register")}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("auth.verify.registerAgain")}
            </Link>{" "}
            {t("auth.verify.toGetNew")}
          </p>
        )}
      </div>
    </div>
  );
}
