import assert from "node:assert/strict";
import { test } from "node:test";

import { pageWindow } from "../src/components/shared/table-pagination";
import { localePath, splitLocale } from "../src/i18n/locale-path";
import { createTranslator, type Dictionary } from "../src/i18n/translate";
import { todayInDhaka } from "../src/lib/format";
import {
  cashPaymentSchema,
  dutySchema,
  financeEntrySchema,
  mealCountRule,
} from "../src/validation";

const firstMessage = (result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}) => (result.success ? null : result.error?.issues[0]?.message);

test("English paths carry no prefix; Bangla ones do", () => {
  assert.equal(localePath("en", "/manager/bills"), "/manager/bills");
  assert.equal(localePath("bn", "/manager/bills"), "/bn/manager/bills");
  assert.equal(localePath("bn", "/"), "/bn");
  assert.deepEqual(splitLocale("/bn/manager"), {
    locale: "bn",
    path: "/manager",
    explicit: true,
  });
  assert.deepEqual(splitLocale("/bn"), {
    locale: "bn",
    path: "/",
    explicit: true,
  });
  assert.deepEqual(splitLocale("/manager"), {
    locale: "en",
    path: "/manager",
    explicit: false,
  });
  // "bnx" is a path, not a locale.
  assert.equal(splitLocale("/bnx").explicit, false);
});

test("meals come in whole or half steps between 0 and 10", () => {
  assert.equal(mealCountRule.safeParse("1.5").success, true);
  assert.equal(mealCountRule.safeParse(0).success, true);
  assert.equal(
    firstMessage(mealCountRule.safeParse("1.3")),
    "validation.mealStep",
  );
  assert.equal(
    firstMessage(mealCountRule.safeParse(11)),
    "validation.mealRange",
  );
  assert.equal(
    firstMessage(mealCountRule.safeParse(-0.5)),
    "validation.mealRange",
  );
});

test("cash can be partial but never more than what is due", () => {
  const schema = cashPaymentSchema(5228.98);
  assert.equal(schema.safeParse({ amount: "2000", note: "" }).success, true);
  assert.equal(schema.safeParse({ amount: "5228.98", note: "" }).success, true);
  assert.equal(
    firstMessage(schema.safeParse({ amount: "5229", note: "" })),
    "validation.cashOverDue",
  );
  assert.equal(
    firstMessage(schema.safeParse({ amount: "0", note: "" })),
    "validation.amountPositive",
  );
});

test("a bazar duty can't end before it starts", () => {
  const duty = { memberId: "m1", note: "" };
  assert.equal(
    dutySchema.safeParse({
      ...duty,
      startDate: "2026-09-12",
      endDate: "2026-09-12",
    }).success,
    true,
  );
  assert.equal(
    firstMessage(
      dutySchema.safeParse({
        ...duty,
        startDate: "2026-09-15",
        endDate: "2026-09-12",
      }),
    ),
    "validation.endBeforeStart",
  );
});

test("a finance entry needs a past date and a category of its own type", () => {
  const entry = {
    type: "EXPENSE",
    category: "FOOD",
    amount: "120.50",
    date: "2026-09-01",
    note: "",
  };
  assert.equal(financeEntrySchema.safeParse(entry).success, true);
  assert.equal(
    firstMessage(
      financeEntrySchema.safeParse({ ...entry, category: "SALARY" }),
    ),
    "validation.categoryMismatch",
  );
  assert.equal(
    firstMessage(financeEntrySchema.safeParse({ ...entry, amount: "1.005" })),
    "validation.amountDecimals",
  );
  const tomorrow = new Date(`${todayInDhaka()}T00:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  assert.equal(
    firstMessage(
      financeEntrySchema.safeParse({
        ...entry,
        date: tomorrow.toISOString().slice(0, 10),
      }),
    ),
    "validation.noFutureDate",
  );
});

test("pagination shows both ends, the neighbours and gaps", () => {
  assert.deepEqual(pageWindow(1, 1), [1]);
  assert.deepEqual(pageWindow(1, 3), [1, 2, 3]);
  assert.deepEqual(pageWindow(5, 12), [1, "…", 4, 5, 6, "…", 12]);
  assert.deepEqual(pageWindow(12, 12), [1, "…", 11, 12]);
});

test("the translator fills placeholders and passes unknown text through", () => {
  const dict = {
    common: { showingRange: "Showing {from}–{to} of {total}" },
  } as unknown as Dictionary;
  const t = createTranslator(dict);
  assert.equal(
    t("common.showingRange", { from: 1, to: 10, total: 57 }),
    "Showing 1–10 of 57",
  );
  assert.equal(t.dynamic("Invalid Credentials"), "Invalid Credentials");
});
