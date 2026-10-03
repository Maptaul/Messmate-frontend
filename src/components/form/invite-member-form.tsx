"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useInviteMember } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { getErrorMessage } from "@/utils";
import { inviteMemberSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function InviteMemberForm({
  messId,
  handleClose,
}: {
  messId: string;
  handleClose: () => void;
}) {
  const t = useT();

  const { mutate: invite, isPending } = useInviteMember();

  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onChange: inviteMemberSchema },
    onSubmit: ({ value }) => {
      invite(
        { messId, email: value.email.trim() },
        {
          onSuccess: (res) => {
            // Only the address they typed: the name stays private until they accept.
            toast.success(t("toast.invitationSent", { email: res.data.email }));
            handleClose();
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label={t("manager.members.email")}
              description={t("manager.members.mustHave")}
              type="email"
              autoComplete="off"
              placeholder="name@example.com"
            />
          )}
        </form.AppField>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("manager.members.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton isPending={isPending}>
              {t("manager.members.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
