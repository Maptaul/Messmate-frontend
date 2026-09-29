import z from "zod";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import { todayInDhaka } from "@/utils";

// --- Profile ---------------------------------------------------------------

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "validation.nameMin")
    .max(120, "validation.nameMax"),
  phone: z
    .string()
    .trim()
    .max(20, "validation.phoneMax")
    .refine((value) => value === "" || /^[0-9+\-\s]{6,20}$/.test(value), {
      message: "validation.phoneInvalid",
    }),
});

// --- Personal finance -------------------------------------------------------

const CATEGORIES_BY_TYPE = {
  INCOME: INCOME_CATEGORIES as readonly string[],
  EXPENSE: EXPENSE_CATEGORIES as readonly string[],
};

export const financeEntrySchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"], { message: "validation.selectType" }),
    category: z.string().min(1, "validation.selectCategory"),
    amount: z
      .string()
      .transform(Number)
      .pipe(
        z
          .number("validation.amountPositive")
          .positive("validation.amountPositive")
          .multipleOf(0.01, "validation.amountDecimals")
          .max(10_000_000, "validation.amountMax"),
      ),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "validation.dateRequired")
      // The API rejects future dates in Dhaka time.
      .refine((date) => date <= todayInDhaka(), "validation.noFutureDate"),
    note: z.string().trim().max(300, "validation.noteMax"),
  })
  .refine((entry) => CATEGORIES_BY_TYPE[entry.type].includes(entry.category), {
    message: "validation.categoryMismatch",
    path: ["category"],
  });
