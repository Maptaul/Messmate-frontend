"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useReviewManagerRequest } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { ManagerRequest } from "@/types";
import { getErrorMessage } from "@/utils";
import { rejectRequestSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

/** Rejecting needs a reason: the applicant reads it in their email. */
export default function RejectRequestForm({
  request,
  handleClose,
  handleCancel,
}: {
  request: ManagerRequest;
  handleClose: () => void;
  handleCancel: () => void;
}) {
  const t = useT();

  const { mutate: review, isPending } = useReviewManagerRequest();

  const form = useAppForm({
    defaultValues: { rejectionReason: "" },
    validators: { onChange: rejectRequestSchema },
    onSubmit: ({ value }) => {
      const { rejectionReason } = rejectRequestSchema.parse(value);
      review(
        { requestId: request.id, status: "REJECTED", rejectionReason },
        {
          onSuccess: () => {
            toast.success(
              t("admin.toast.requestRejected", { name: request.user.name }),
            );
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
      <FieldGroup className="gap-3">
        <form.AppField name="rejectionReason">
          {(field) => (
            <field.TextareaField
              label={t("admin.managerRequests.reasonLabel")}
              description={t("admin.managerRequests.reasonHint")}
              rows={3}
              maxLength={500}
            />
          )}
        </form.AppField>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t("admin.managerRequests.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton
              variant="destructive"
              isPending={isPending}
              pendingLabel={t("admin.managerRequests.rejecting")}
            >
              {t("admin.managerRequests.confirmReject")}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </FieldGroup>
    </form>
  );
}
