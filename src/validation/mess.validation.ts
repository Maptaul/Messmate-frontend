import { z } from "zod";
import { EXPENSE_TYPES, SPLIT_METHODS } from "@/types";

// Every rule mirrors the API's Zod schema for the same route; messages are
// dictionary keys. Form values are strings, so numbers are coerced.

const MAX_AMOUNT = 1_000_000;

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "validation.dateRequired");

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message);

export const amountRule = z.coerce
  .number()
  .positive("validation.amountPositive")
  .max(MAX_AMOUNT, "validation.amountMax");

/** Whole or half meals, 0–10. */
export const mealCountRule = z.coerce
  .number()
  .multipleOf(0.5, "validation.mealStep")
  .min(0, "validation.mealRange")
  .max(10, "validation.mealRange");

// --- Mess (create wizard + settings) -----------------------------------

export const messDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "validation.messNameMin")
    .max(120, "validation.messNameMax"),
  address: z
    .string()
    .trim()
    .min(3, "validation.addressMin")
    .max(300, "validation.addressMax"),
});

export const messMoneySchema = z.object({
  monthlyRent: z.coerce
    .number()
    .positive("validation.rentPositive")
    .max(MAX_AMOUNT, "validation.amountMax"),
  monthlyDeposit: z.coerce
    .number()
    .min(0, "validation.amountNotNegative")
    .max(MAX_AMOUNT, "validation.amountMax"),
});

export const messSchema = messDetailsSchema.extend(messMoneySchema.shape);

// --- Members ----------------------------------------------------------------

export const addMemberSchema = z.object({
  email: z.string().trim().pipe(z.email("validation.emailInvalid")),
});

export const defaultMealsSchema = z.object({
  lunch: mealCountRule,
  dinner: mealCountRule,
});

// --- Billing cycle ----------------------------------------------------------

export const openCycleSchema = z.object({
  year: z.coerce
    .number()
    .int("validation.yearRange")
    .min(2000, "validation.yearRange")
    .max(2100, "validation.yearRange"),
  month: z.coerce
    .number()
    .int("validation.monthRange")
    .min(1, "validation.monthRange")
    .max(12, "validation.monthRange"),
});

// --- Expenses ---------------------------------------------------------------

export const expenseSchema = z.object({
  type: z.enum(EXPENSE_TYPES, { message: "validation.selectType" }),
  amount: amountRule,
  splitMethod: z.enum(SPLIT_METHODS),
  /** "" = paid from the mess fund */
  paidByMemberId: z.string(),
  description: optionalText(500, "validation.descriptionMax"),
  spentAt: ymd,
});

// --- Deposits ---------------------------------------------------------------

export const depositSchema = z.object({
  memberId: z.string().min(1, "validation.selectMember"),
  amount: amountRule,
  note: optionalText(500, "validation.noteMax"),
});

// --- Bazar duty -------------------------------------------------------------

export const dutySchema = z
  .object({
    memberId: z.string().min(1, "validation.selectMember"),
    startDate: ymd,
    endDate: ymd,
    note: optionalText(300, "validation.noteMax"),
  })
  // YYYY-MM-DD strings compare correctly as text.
  .refine((duty) => duty.endDate >= duty.startDate, {
    message: "validation.endBeforeStart",
    path: ["endDate"],
  });

// --- Cash payment (manager) -------------------------------------------

/** Cash can be partial but never more than what is still due. */
export const cashPaymentSchema = (due: number) =>
  z.object({
    amount: amountRule.max(due, "validation.cashOverDue"),
    note: optionalText(200, "validation.noteMax"),
  });
