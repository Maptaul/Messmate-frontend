"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useActiveMembers, useAssignDuty, useUpdateDuty } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { GroceryDuty } from "@/types";
import { getErrorMessage } from "@/utils";
import { dutySchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function DutyForm({
  cycleId,
  messId,
  year,
  month,
  duty,
  handleClose,
}: {
  cycleId: string;
  messId: string;
  year: number;
  month: number;
  duty?: GroceryDuty;
  handleClose: () => void;
}) {
  const t = useT();

  const { data: members } = useActiveMembers(messId);
  const { mutate: assignDuty, isPending: assignPending } = useAssignDuty();
  const { mutate: updateDuty, isPending: updatePending } = useUpdateDuty();

  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDay = `${prefix}-01`;
  const lastDay = `${prefix}-${String(last).padStart(2, "0")}`;

  const form = useAppForm({
    defaultValues: {
      memberId: duty?.member.id ?? "",
      startDate: duty?.startDate.slice(0, 10) ?? firstDay,
      endDate: duty?.endDate.slice(0, 10) ?? firstDay,
      note: duty?.note ?? "",
    },
    validators: { onChange: dutySchema },
    onSubmit: ({ value }) => {
      const parsed = dutySchema.parse(value);
      const fields = {
        memberId: parsed.memberId,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        note: parsed.note || undefined,
      };

      const callbacks = {
        onSuccess: () => {
          toast.success(
            duty
              ? t("toast.saved")
              : t("toast.dutyAssigned", {
                  name:
                    members?.data.find(
                      (member) => member.id === parsed.memberId,
                    )?.user.name ?? "",
                }),
          );
          handleClose();
        },
        onError: (err: unknown) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          applyServerErrors(form, err);
        },
      };

      if (duty) {
        updateDuty({ dutyId: duty.id, ...fields }, callbacks);
      } else {
        assignDuty({ cycleId, ...fields }, callbacks);
      }
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
        <form.AppField name="memberId">
          {(field) => (
            <field.SelectField
              label={t("manager.duty.formMember")}
              placeholder={t("manager.duty.selectMember")}
              options={(members?.data ?? []).map((member) => ({
                value: member.id,
                label: member.user.name,
              }))}
            />
          )}
        </form.AppField>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="startDate">
            {(field) => (
              <field.TextField
                label={t("manager.duty.formStart")}
                type="date"
                min={firstDay}
                max={lastDay}
              />
            )}
          </form.AppField>
          <form.AppField name="endDate">
            {(field) => (
              <field.TextField
                label={t("manager.duty.formEnd")}
                type="date"
                min={firstDay}
                max={lastDay}
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="note">
          {(field) => (
            <field.TextareaField label={t("manager.duty.formNote")} rows={2} />
          )}
        </form.AppField>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("manager.duty.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton isPending={assignPending || updatePending}>
              {t("manager.duty.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
