"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { refreshToken } from "@/api";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { Me } from "@/types";
import { getErrorMessage } from "@/utils";
import { profileSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function ProfileForm({ me }: { me: Me }) {
  const t = useT();
  const router = useRouter();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const form = useAppForm({
    defaultValues: { name: me.name, phone: me.phone ?? "" },
    validators: { onChange: profileSchema },
    onSubmit: ({ value }) => {
      const parsed = profileSchema.parse(value);
      updateProfile(
        {
          ...(parsed.name !== me.name && { name: parsed.name }),
          ...(parsed.phone !== (me.phone ?? "") && { phone: parsed.phone }),
        },
        {
          onSuccess: async () => {
            toast.success(t("toast.profileSaved"));
            // A new name invalidates the access token; swap it before the
            // next server render reads the old one.
            if (parsed.name !== me.name) {
              await refreshToken().catch(() => null);
            }
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

  return (
    <form
      noValidate
      className="max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => (
            <field.TextField label={t("profile.name")} autoComplete="name" />
          )}
        </form.AppField>
        <form.AppField name="phone">
          {(field) => (
            <field.TextField
              label={t("profile.phone")}
              type="tel"
              autoComplete="tel"
            />
          )}
        </form.AppField>
        <div className="space-y-1.5">
          <label htmlFor="profile-email" className="text-sm font-medium">
            {t("profile.email")}
          </label>
          <Input id="profile-email" value={me.email} readOnly disabled />
          <p className="text-xs text-muted-foreground">
            {t("profile.emailHint")}
          </p>
        </div>
        <div>
          <form.AppForm>
            <form.SubmitButton
              isPending={isPending}
              pendingLabel={t("profile.saving")}
            >
              {t("profile.save")}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </FieldGroup>
    </form>
  );
}
