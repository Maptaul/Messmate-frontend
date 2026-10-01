"use client";

import { ClipboardListIcon, HomeIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { applyServerErrors, useAppForm } from "@/components/form";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { FieldGroup } from "@/components/ui/field";
import { useRegistration } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { usePendingRegistration } from "@/stores/pending-registration.store";
import type { RegistrationPayload } from "@/types";
import { getErrorMessage } from "@/utils";
import { registrationSchema } from "@/validation";

export default function RegisterForm() {
  const router = useRouter();
  const t = useT();
  const href = useLocalePath();
  const { mutate: registration, isPending } = useRegistration();
  const setPending = usePendingRegistration((state) => state.setPayload);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "MEMBER",
      password: "",
      confirmPassword: "",
    },
    validators: { onChange: registrationSchema },
    onSubmit: ({ value }) => {
      const {
        confirmPassword: _,
        phone,
        ...rest
      } = registrationSchema.parse(value);
      const payload: RegistrationPayload = {
        ...rest,
        ...(phone ? { phone } : {}),
      };

      registration(payload, {
        onSuccess: () => {
          setPending(payload);
          router.push(
            `${href("/register/verify-account")}?email=${encodeURIComponent(payload.email)}`,
          );
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          applyServerErrors(form, err);
        },
      });
    },
  });

  return (
    <div className="flex flex-col gap-4.5">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight">
          {t("auth.register.title")}
        </h1>
        <p className="mt-1.5 text-foreground-2">
          {t("auth.register.subtitle")}
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
          <form.AppField name="role">
            {(field) => (
              <field.RadioCardsField
                label={t("auth.register.roleLabel")}
                options={[
                  {
                    value: "MEMBER",
                    title: t("auth.register.memberTitle"),
                    description: t("auth.register.memberDescription"),
                    icon: <HomeIcon />,
                  },
                  {
                    value: "MESS_MANAGER",
                    title: t("auth.register.managerTitle"),
                    description: t("auth.register.managerDescription"),
                    icon: <ClipboardListIcon />,
                  },
                ]}
              />
            )}
          </form.AppField>
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label={t("auth.register.name")}
                autoComplete="name"
              />
            )}
          </form.AppField>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label={t("auth.register.email")}
                  type="email"
                  autoComplete="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                />
              )}
            </form.AppField>
            <form.AppField name="phone">
              {(field) => (
                <field.TextField
                  label={t("auth.register.phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("auth.register.phonePlaceholder")}
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="password">
            {(field) => (
              <field.PasswordField
                label={t("auth.register.password")}
                autoComplete="new-password"
                rules
              />
            )}
          </form.AppField>
          <form.AppField name="confirmPassword">
            {(field) => (
              <field.PasswordField
                label={t("auth.register.confirmPassword")}
                autoComplete="new-password"
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton
              isPending={isPending}
              size="lg"
              className="w-full"
              pendingLabel={t("auth.register.submitting")}
            >
              <UserPlusIcon />
              {t("auth.register.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>

      <GoogleLoginComponent />

      <p className="text-center text-foreground-2">
        {t("auth.register.haveAccount")}{" "}
        <Link
          href={href("/login")}
          className="font-medium text-primary hover:underline"
        >
          {t("auth.register.login")}
        </Link>
      </p>
    </div>
  );
}
