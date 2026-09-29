"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useOpenNewCycle } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import {
  formatMonth,
  formatMonthName,
  getErrorMessage,
  todayInDhaka,
} from "@/utils";
import { openCycleSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function OpenCycleForm({
  messId,
  handleClose,
}: {
  messId: string;
  handleClose: () => void;
}) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();

  const { mutate: openCycle, isPending } = useOpenNewCycle();

  const [year, month] = todayInDhaka().split("-");
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: formatMonthName(index + 1, locale),
  }));

  const form = useAppForm({
    defaultValues: { year, month: String(Number(month)) },
    validators: { onChange: openCycleSchema },
    onSubmit: ({ value }) => {
      openCycle(
        { messId, ...openCycleSchema.parse(value) },
        {
          onSuccess: (res) => {
            toast.success(
              t("toast.cycleOpened", {
                month: formatMonth(res.data.year, res.data.month, locale),
              }),
            );
            handleClose();
            // Pages pick the open month on the server.
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="month">
          {(field) => (
            <field.SelectField
              label={t("manager.cycles.month")}
              options={months}
            />
          )}
        </form.AppField>
        <form.AppField name="year">
          {(field) => (
            <field.TextField
              label={t("manager.cycles.year")}
              type="number"
              inputMode="numeric"
            />
          )}
        </form.AppField>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("manager.cycles.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton isPending={isPending}>
              {t("manager.cycles.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
