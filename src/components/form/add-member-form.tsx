"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useAddMember } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { getErrorMessage } from "@/utils";
import { addMemberSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function AddMemberForm({
  messId,
  handleClose,
}: {
  messId: string;
  handleClose: () => void;
}) {
  const t = useT();

  const { mutate: addMember, isPending } = useAddMember();

  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onChange: addMemberSchema },
    onSubmit: ({ value }) => {
      addMember(
        { messId, email: value.email.trim() },
        {
          onSuccess: (res) => {
            toast.success(t("toast.memberAdded", { name: res.data.user.name }));
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
