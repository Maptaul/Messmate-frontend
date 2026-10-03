"use client";

import { SendIcon } from "lucide-react";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useJoinCodePreview, useRequestToJoin } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatNumber, getErrorMessage } from "@/utils";
import {
  JOIN_CODE_PATTERN,
  normalizeJoinCode,
  requestToJoinSchema,
} from "@/validation";
import { applyServerErrors, useAppForm } from ".";

/** The mess a typed code belongs to, so nobody asks the wrong one. */
function JoinCodePreview({ code }: { code: string }) {
  const t = useT();
  const locale = useLocale();
  const { data, isFetching, isError } = useJoinCodePreview(code);

  if (!JOIN_CODE_PATTERN.test(code)) return null;
  if (isFetching) return <Skeleton className="h-16 rounded-lg" />;

  if (isError || !data) {
    return (
      <p className="tone-r rounded-lg border px-3 py-2 text-[13px]">
        {t("membership.codeNotFound")}
      </p>
    );
  }

  const mess = data.data;

  return (
    <div className="tone-g flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-[13px]">
      <p className="font-medium">{mess.name}</p>
      <p>{mess.address}</p>
      <p className="text-xs opacity-80">
        {t("membership.previewMeta", {
          manager: mess.manager.name,
          count: formatNumber(mess._count?.members ?? 0, locale),
        })}
      </p>
    </div>
  );
}

export default function JoinMessForm({ onDone }: { onDone?: () => void }) {
  const t = useT();

  const { mutate: request, isPending } = useRequestToJoin();

  const form = useAppForm({
    defaultValues: { joinCode: "", note: "" },
    validators: { onChange: requestToJoinSchema },
    onSubmit: ({ value }) => {
      const { joinCode, note } = requestToJoinSchema.parse(value);
      request(
        { joinCode, ...(note ? { note } : {}) },
        {
          onSuccess: (res) => {
            toast.success(
              t("toast.joinRequestSent", { mess: res.data.mess.name }),
            );
            form.reset();
            onDone?.();
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
      <FieldGroup className="gap-4">
        <form.AppField name="joinCode">
          {(field) => (
            <field.TextField
              label={t("membership.joinCode")}
              description={t("membership.joinCodeHint")}
              autoComplete="off"
              maxLength={9}
              className="font-mono tracking-[0.2em] uppercase"
            />
          )}
        </form.AppField>
        <form.Subscribe
          selector={(state) => normalizeJoinCode(state.values.joinCode)}
        >
          {(code) => <JoinCodePreview code={code} />}
        </form.Subscribe>
        <form.AppField name="note">
          {(field) => (
            <field.TextareaField
              label={t("membership.note")}
              description={t("membership.noteHint")}
              rows={2}
              maxLength={300}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton
            size="sm"
            className="self-start"
            isPending={isPending}
            pendingLabel={t("membership.sending")}
          >
            <SendIcon />
            {t("membership.send")}
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
