"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/i18n/i18n-provider";
import { useFieldContext, useFormContext } from "./form-context";

/**
 * Zod messages in this app are dictionary keys ("validation.emailInvalid");
 * API field messages are plain text. `t.dynamic` handles both.
 */
function TranslatedErrors({ errors }: { errors: unknown[] }) {
  const t = useT();

  return (
    <FieldError
      errors={errors.map((error) => {
        const message =
          typeof error === "string"
            ? error
            : (error as { message?: string } | undefined)?.message;
        return { message: message ? t.dynamic(message) : undefined };
      })}
    />
  );
}

interface FieldShellProps {
  label: string;
  description?: ReactNode;
  children: (props: { id: string; invalid: boolean }) => ReactNode;
}

/** Label, control, then the first error — once the field has been touched. */
function FieldShell({ label, description, children }: FieldShellProps) {
  const field = useFieldContext<unknown>();
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {children({ id: field.name, invalid })}
      {description && !invalid && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {invalid && <TranslatedErrors errors={field.state.meta.errors} />}
    </Field>
  );
}

type TextFieldProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "onBlur" | "id" | "name"
> & {
  label: string;
  description?: ReactNode;
};

export function TextField({
  label,
  description,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <FieldShell label={label} description={description}>
      {({ id, invalid }) => (
        <Input
          id={id}
          name={field.name}
          value={field.state.value}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          {...inputProps}
        />
      )}
    </FieldShell>
  );
}

export function PasswordField({
  label,
  description,
  autoComplete = "current-password",
}: {
  label: string;
  description?: ReactNode;
  autoComplete?: string;
}) {
  const field = useFieldContext<string>();
  const t = useT();
  const [visible, setVisible] = useState(false);

  return (
    <FieldShell label={label} description={description}>
      {({ id, invalid }) => (
        <div className="relative">
          <Input
            id={id}
            name={field.name}
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
            aria-invalid={invalid}
            className="pr-9"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
            onClick={() => setVisible((shown) => !shown)}
            aria-label={t(
              visible ? "common.hidePassword" : "common.showPassword",
            )}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </div>
      )}
    </FieldShell>
  );
}

export function TextareaField({
  label,
  description,
  ...props
}: Omit<
  ComponentProps<typeof Textarea>,
  "value" | "onChange" | "onBlur" | "id" | "name"
> & { label: string; description?: ReactNode }) {
  const field = useFieldContext<string>();

  return (
    <FieldShell label={label} description={description}>
      {({ id, invalid }) => (
        <Textarea
          id={id}
          name={field.name}
          value={field.state.value}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export interface SelectOption {
  label: string;
  value: string;
}

export function SelectField({
  label,
  description,
  options,
  placeholder,
}: {
  label: string;
  description?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const t = useT();

  return (
    <FieldShell label={label} description={description}>
      {({ id, invalid }) => (
        <Select
          items={options}
          value={field.state.value || null}
          onValueChange={(value) => {
            field.handleChange(value ?? "");
            field.handleBlur();
          }}
        >
          <SelectTrigger id={id} aria-invalid={invalid} className="w-full">
            <SelectValue placeholder={placeholder ?? t("common.select")} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldShell>
  );
}

export interface RadioCardOption {
  value: string;
  title: string;
  description: string;
}

/** A radio group drawn as selectable cards, for small either/or choices. */
export function RadioCardsField({
  label,
  options,
}: {
  label: string;
  options: RadioCardOption[];
}) {
  const field = useFieldContext<string>();
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={invalid}>
      <FieldTitle>{label}</FieldTitle>
      <RadioGroup
        aria-label={label}
        value={field.state.value}
        onValueChange={(value) => {
          field.handleChange(String(value));
          field.handleBlur();
        }}
        className="grid-cols-1 sm:grid-cols-2"
      >
        {options.map((option) => {
          const id = `${field.name}-${option.value}`;
          return (
            <FieldLabel key={option.value} htmlFor={id}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{option.title}</FieldTitle>
                  <FieldDescription>{option.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  id={id}
                  value={option.value}
                  aria-invalid={invalid}
                />
              </Field>
            </FieldLabel>
          );
        })}
      </RadioGroup>
      {invalid && <TranslatedErrors errors={field.state.meta.errors} />}
    </Field>
  );
}

export function OtpField({
  label,
  length = 6,
}: {
  label: string;
  length?: number;
}) {
  const field = useFieldContext<string>();

  return (
    <FieldShell label={label}>
      {({ id, invalid }) => (
        <InputOTP
          id={id}
          maxLength={length}
          inputMode="numeric"
          pattern="[0-9]*"
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          containerClassName="justify-center"
        >
          <InputOTPGroup>
            {Array.from({ length }, (_, position) => position).map((slot) => (
              <InputOTPSlot
                key={slot}
                index={slot}
                className="size-11 text-lg"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )}
    </FieldShell>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
  isPending,
  ...props
}: Omit<ComponentProps<typeof Button>, "type"> & {
  pendingLabel?: string;
  /** Extra busy state from outside the form, e.g. a demo-login mutation. */
  isPending?: boolean;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting || isPending} {...props}>
          {isSubmitting || isPending ? (
            <>
              <Spinner />
              {pendingLabel ?? children}
            </>
          ) : (
            children
          )}
        </Button>
      )}
    </form.Subscribe>
  );
}
