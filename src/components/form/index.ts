import {
  type AnyFieldLikeMetaBase,
  createFormHook,
} from "@tanstack/react-form";
import { getFieldErrors } from "@/utils";
import {
  OtpField,
  PasswordField,
  RadioCardsField,
  SelectField,
  SubmitButton,
  TextareaField,
  TextField,
} from "./fields";
import { fieldContext, formContext } from "./form-context";

export type { RadioCardOption, SelectOption } from "./fields";

/**
 * `useAppForm` is TanStack Form with our shadcn fields pre-wired, so a form
 * field is one line: <form.AppField name="email">{(f) => <f.TextField label="Email" />}</form.AppField>
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    TextareaField,
    SelectField,
    OtpField,
    RadioCardsField,
  },
  formComponents: { SubmitButton },
});

interface FieldMetaSetter {
  setFieldMeta: (
    field: never,
    updater: (meta: AnyFieldLikeMetaBase) => AnyFieldLikeMetaBase,
  ) => void;
}

/**
 * Puts the backend's per-field validation messages under the matching inputs.
 * They sit in the submit slot, so the next submit clears them.
 */
export function applyServerErrors(form: FieldMetaSetter, error: unknown) {
  for (const [field, message] of Object.entries(getFieldErrors(error))) {
    form.setFieldMeta(field as never, (meta) => ({
      ...meta,
      isTouched: true,
      errorMap: { ...meta.errorMap, onSubmit: message },
    }));
  }
}
