"use client";

import { CheckIcon, CircleIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { type ComponentProps, Fragment, type ReactNode, useState } from "react";
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
import { cn } from "@/lib/utils";
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
  action?: ReactNode;
  /** Shown under the control instead of errors: it already says what is wrong. */
  checklist?: ReactNode;
  children: (props: { id: string; invalid: boolean }) => ReactNode;
}

function FieldShell({
  label,
  description,
  action,
  checklist,
  children,
}: FieldShellProps) {
  const field = useFieldContext<unknown>();
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={invalid}>
      {action ? (
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {action}
        </div>
      ) : (
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      )}
      {children({ id: field.name, invalid })}
      {description && !invalid && (
        <FieldDescription>{description}</FieldDescription>
      )}
      {checklist}
      {invalid && !checklist && (
        <TranslatedErrors errors={field.state.meta.errors} />
      )}
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

/** An amount in taka: a ৳ inside the box, decimals allowed, the value stays a string. */
export function MoneyField({
  label,
  description,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string>();

  return (
    <FieldShell label={label} description={description}>
      {({ id, invalid }) => (
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          >
            ৳
          </span>
          <Input
            id={id}
            name={field.name}
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
            aria-invalid={invalid}
            inputMode="decimal"
            className="pl-6.5 tabular-nums"
            {...inputProps}
          />
        </div>
      )}
    </FieldShell>
  );
}

const PASSWORD_RULES = [
  ["min", (value: string) => value.length >= 8],
  ["lower", (value: string) => /[a-z]/.test(value)],
  ["upper", (value: string) => /[A-Z]/.test(value)],
  ["number", (value: string) => /[0-9]/.test(value)],
  ["symbol", (value: string) => /[^A-Za-z0-9]/.test(value)],
] as const;

function PasswordRules({ value }: { value: string }) {
  const t = useT();

  return (
    <ul
      aria-label={t("auth.rules.label")}
      className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12.5px]"
    >
      {PASSWORD_RULES.map(([key, met]) => {
        const ok = met(value);
        return (
          <li
            key={key}
            className={cn(
              "flex items-center gap-1.5",
              ok ? "text-(--tone-g-fg)" : "text-muted-foreground",
            )}
          >
            {ok ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <CircleIcon className="size-3.5" />
            )}
            {t(`auth.rules.${key}`)}
          </li>
        );
      })}
    </ul>
  );
}

export function PasswordField({
  label,
  description,
  action,
  rules,
  autoComplete = "current-password",
}: {
  label: string;
  description?: ReactNode;
  action?: ReactNode;
  rules?: boolean;
  autoComplete?: string;
}) {
  const field = useFieldContext<string>();
  const t = useT();
  const [visible, setVisible] = useState(false);

  return (
    <FieldShell
      label={label}
      action={action}
      description={description}
      checklist={
        rules ? <PasswordRules value={field.state.value} /> : undefined
      }
    >
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
  icon?: ReactNode;
}

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
                {option.icon && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border bg-card [&_svg]:size-4">
                    {option.icon}
                  </span>
                )}
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
          containerClassName="gap-2"
        >
          {[0, Math.ceil(length / 2)].map((start, group) => (
            <Fragment key={start}>
              {group > 0 && (
                <span aria-hidden className="text-muted-foreground">
                  –
                </span>
              )}
              <InputOTPGroup className="gap-2">
                {Array.from(
                  {
                    length:
                      group === 0
                        ? Math.ceil(length / 2)
                        : length - Math.ceil(length / 2),
                  },
                  (_, offset) => start + offset,
                ).map((slot) => (
                  <InputOTPSlot
                    key={slot}
                    index={slot}
                    className="h-14 w-12 rounded-lg border font-mono text-2xl font-semibold first:rounded-lg last:rounded-lg"
                  />
                ))}
              </InputOTPGroup>
            </Fragment>
          ))}
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
