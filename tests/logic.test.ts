import assert from "node:assert/strict";
import { test } from "node:test";
import { FetchError } from "ofetch";
import { getButtonArray } from "../src/components/ui/table-pagination";
import { localePath, splitLocale } from "../src/i18n/locale-path";
import { createTranslator, type Dictionary } from "../src/i18n/translate";
import { toCsv } from "../src/utils/csv.util";
import { getErrorStatus } from "../src/utils/error.util";
import { formatDeadline, todayInDhaka } from "../src/utils/format.util";
import {
  billsParams,
  cyclesParams,
  expensesParams,
  financeEntriesParams,
  financePeriod,
  financeSummaryParams,
  fromSearchParams,
  managerRequestsParams,
  membersParams,
  messAuditParams,
  paymentsParams,
  registerDate,
  usersParams,
} from "../src/utils/params.util";
import {
  cashPaymentSchema,
  contactSchema,
  depositEditSchema,
  dutySchema,
  expenseSchema,
  financeEntrySchema,
  mealCountRule,
  messMoneySchema,
  openCycleSchema,
  registrationSchema,
  requestToJoinSchema,
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
  assert.deepEqual(getButtonArray(1, 1), [1]);
  assert.deepEqual(getButtonArray(3, 1), [1, 2, 3]);
  assert.deepEqual(getButtonArray(12, 5), [
    1,
    "ellipsis",
    4,
    5,
    6,
    "ellipsis",
    12,
  ]);
  assert.deepEqual(getButtonArray(12, 12), [1, "ellipsis", 8, 9, 10, 11, 12]);
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

test("list params come from the URL, and junk values are dropped", () => {
  const get = fromSearchParams({
    page: "3",
    role: "MEMBER",
    status: "NOPE",
    searchTerm: "rafi",
  });
  assert.deepEqual(usersParams(get), {
    page: 3,
    limit: 10,
    searchTerm: "rafi",
    role: "MEMBER",
    status: undefined,
  });
  // a bad or missing page falls back to 1; each list accepts only its own statuses
  assert.equal(membersParams(fromSearchParams({ page: "-2" })).page, 1);
  assert.equal(
    cyclesParams(fromSearchParams({ status: "OPEN" })).status,
    "OPEN",
  );
  // members open on the active ones; "ALL" lifts the filter, junk falls back
  assert.equal(membersParams(fromSearchParams({})).status, "ACTIVE");
  assert.equal(
    membersParams(fromSearchParams({ status: "ALL" })).status,
    undefined,
  );
  assert.equal(
    membersParams(fromSearchParams({ status: "OPEN" })).status,
    "ACTIVE",
  );
  assert.equal(cyclesParams(fromSearchParams({ year: "2026" })).year, 2026);
  assert.equal(cyclesParams(fromSearchParams({ year: "x" })).year, undefined);
});

test("the mess money step reads typed strings and rejects bad amounts", () => {
  const ok = messMoneySchema.safeParse({
    monthlyRent: "18000",
    monthlyDeposit: "0",
  });
  assert.equal(ok.success && ok.data.monthlyRent, 18000);
  assert.equal(
    firstMessage(
      messMoneySchema.safeParse({ monthlyRent: "", monthlyDeposit: "0" }),
    ),
    "validation.rentPositive",
  );
  assert.equal(
    firstMessage(
      messMoneySchema.safeParse({ monthlyRent: "abc", monthlyDeposit: "0" }),
    ),
    "validation.rentPositive",
  );
  assert.equal(
    firstMessage(
      messMoneySchema.safeParse({ monthlyRent: "500", monthlyDeposit: "-1" }),
    ),
    "validation.amountNotNegative",
  );
});

test("opening a month needs a real year and month", () => {
  assert.equal(
    openCycleSchema.safeParse({ year: "2026", month: "9" }).success,
    true,
  );
  assert.equal(
    firstMessage(openCycleSchema.safeParse({ year: "2026", month: "13" })),
    "validation.monthRange",
  );
  assert.equal(
    firstMessage(openCycleSchema.safeParse({ year: "1999", month: "1" })),
    "validation.yearRange",
  );
});

test("the meal register opens on a day inside the month", () => {
  // a valid date in the month is kept
  assert.equal(registerDate("2026-09-12", 2026, 9, "2026-09-29"), "2026-09-12");
  // outside the month, malformed, or a day that doesn't exist: today if it is in the month
  assert.equal(registerDate("2026-08-31", 2026, 9, "2026-09-29"), "2026-09-29");
  assert.equal(registerDate("nonsense", 2026, 9, "2026-09-29"), "2026-09-29");
  assert.equal(registerDate("2026-02-30", 2026, 2, "2026-02-10"), "2026-02-10");
  // viewing an old month: today isn't in it, so start at the 1st
  assert.equal(registerDate(undefined, 2026, 7, "2026-09-29"), "2026-07-01");
});

test("expense, deposit and bill params only accept known values", () => {
  assert.equal(expensesParams(fromSearchParams({ type: "GAS" })).type, "GAS");
  assert.equal(
    expensesParams(fromSearchParams({ type: "NOPE" })).type,
    undefined,
  );
  assert.equal(
    billsParams(fromSearchParams({ status: "PARTIAL" })).status,
    "PARTIAL",
  );
  assert.equal(
    billsParams(fromSearchParams({ status: "OPEN" })).status,
    undefined,
  );
  // "paidBy" in the URL becomes the API's paidByMemberId ("fund" included)
  assert.deepEqual(
    expensesParams(
      fromSearchParams({ paidBy: "fund", searchTerm: "rice", page: "2" }),
    ),
    {
      page: 2,
      limit: 10,
      type: undefined,
      paidByMemberId: "fund",
      searchTerm: "rice",
    },
  );
});

test("an expense can't be dated in the future; a deposit edit skips the member", () => {
  const base = {
    type: "GAS",
    amount: "450",
    splitMethod: "EQUAL",
    paidByMemberId: "",
    description: "",
  };
  assert.equal(
    expenseSchema.safeParse({ ...base, spentAt: todayInDhaka() }).success,
    true,
  );
  assert.equal(
    firstMessage(expenseSchema.safeParse({ ...base, spentAt: "2999-01-01" })),
    "validation.noFutureDate",
  );
  assert.equal(
    depositEditSchema.safeParse({ amount: "300", note: "" }).success,
    true,
  );
  assert.equal(
    firstMessage(depositEditSchema.safeParse({ amount: "0", note: "" })),
    "validation.amountPositive",
  );
});

test("a meal deadline is read as Dhaka time, whatever the server's zone", () => {
  // "23:00" in Dhaka is 17:00 UTC; both must show the same Dhaka clock time.
  assert.match(formatDeadline("2026-09-29 23:00"), /11:00\s?pm/i);
  assert.match(formatDeadline("2026-09-29 08:30"), /8:30\s?am/i);
});

test("payment history filters accept only real statuses", () => {
  assert.equal(
    paymentsParams(fromSearchParams({ status: "PAID" })).status,
    "PAID",
  );
  assert.equal(
    paymentsParams(fromSearchParams({ status: "PARTIAL" })).status,
    undefined,
  );
});

test("the finance page defaults to the month and ignores unknown filters", () => {
  assert.equal(financePeriod(fromSearchParams({})), "monthly");
  assert.equal(financePeriod(fromSearchParams({ period: "yearly" })), "yearly");
  assert.equal(
    financePeriod(fromSearchParams({ period: "hourly" })),
    "monthly",
  );
  const params = financeEntriesParams(
    fromSearchParams({ type: "INCOME", category: "SALARY", page: "2" }),
  );
  assert.deepEqual(
    [params.type, params.category, params.page],
    ["INCOME", "SALARY", 2],
  );
  assert.equal(
    financeEntriesParams(fromSearchParams({ category: "NOPE" })).category,
    undefined,
  );
});

test("a finance entry needs a category that belongs to its type", () => {
  const entry = {
    type: "INCOME",
    category: "SALARY",
    amount: "5000",
    date: "2026-01-05",
    note: "",
  };
  assert.equal(financeEntrySchema.safeParse(entry).success, true);
  assert.equal(
    firstMessage(financeEntrySchema.safeParse({ ...entry, category: "FOOD" })),
    "validation.categoryMismatch",
  );
});

test("the contact form checks each field before composing an email", () => {
  const ok = {
    name: "Rafi",
    email: "rafi@example.com",
    subject: "Hello",
    message: "A question about bills.",
  };
  assert.equal(contactSchema.safeParse(ok).success, true);
  assert.equal(
    firstMessage(contactSchema.safeParse({ ...ok, email: "nope" })),
    "validation.emailInvalid",
  );
  assert.equal(
    firstMessage(contactSchema.safeParse({ ...ok, message: "short" })),
    "validation.messageMin",
  );
});

test("a failed call reports its HTTP status; a dropped connection reports none", () => {
  const http = new FetchError("Bad");
  http.status = 500;
  assert.equal(getErrorStatus(http), 500);
  // offline: ofetch throws a FetchError with no response, so a retry is worthwhile
  assert.equal(getErrorStatus(new FetchError("Network")), undefined);
  assert.equal(getErrorStatus(new Error("other")), undefined);
});

test("the activity feed filters accept only real audit actions and records", () => {
  const ok = messAuditParams(
    fromSearchParams({ action: "DEPOSIT_ADDED", entity: "Deposit" }),
  );
  assert.deepEqual([ok.action, ok.entity], ["DEPOSIT_ADDED", "Deposit"]);
  const bad = messAuditParams(
    fromSearchParams({ action: "NOPE", entity: "Nothing" }),
  );
  assert.deepEqual([bad.action, bad.entity], [undefined, undefined]);
});

test("CSV cells with commas, quotes or line breaks are quoted", () => {
  const csv = toCsv([
    ["তারিখ", "Note", "Amount"],
    ["2026-09-01", 'Rice, oil and "fresh" fish', 1250.5],
    ["2026-09-02", "line one\nline two", 0],
    ["2026-09-03", null, 300],
  ]);
  assert.equal(
    csv,
    [
      "তারিখ,Note,Amount",
      '2026-09-01,"Rice, oil and ""fresh"" fish",1250.5',
      '2026-09-02,"line one\nline two",0',
      "2026-09-03,,300",
    ].join("\r\n"),
  );
});

test("the finance summary keeps a real day as its anchor and drops anything else", () => {
  const get = (date: string) => fromSearchParams({ period: "weekly", date });
  assert.deepEqual(financeSummaryParams(get("2026-09-15")), {
    period: "weekly",
    date: "2026-09-15",
  });
  assert.equal(financeSummaryParams(get("15-09-2026")).date, undefined);
});

test("signing up to run a mess asks for the mess name and address", () => {
  const account = {
    name: "Arman Hossain",
    email: "arman@messmate.test",
    phone: "",
    password: "Arman@mess123",
    confirmPassword: "Arman@mess123",
    messName: "",
    messAddress: "",
  };

  assert.equal(
    registrationSchema.safeParse({ ...account, role: "MEMBER" }).success,
    true,
  );

  const manager = registrationSchema.safeParse({
    ...account,
    role: "MESS_MANAGER",
  });
  assert.equal(manager.success, false);
  assert.deepEqual(
    manager.error?.issues.map((issue) => issue.path.join(".")).sort(),
    ["messAddress", "messName"],
  );

  assert.equal(
    registrationSchema.safeParse({
      ...account,
      role: "MESS_MANAGER",
      messName: "Green View Mess",
      messAddress: "Nasirabad",
    }).success,
    true,
  );
});

test("manager requests open on the pending queue, and All drops the filter", () => {
  const statusOf = (status?: string) =>
    managerRequestsParams(fromSearchParams(status ? { status } : {})).status;

  assert.equal(statusOf(), "PENDING");
  assert.equal(statusOf("REJECTED"), "REJECTED");
  assert.equal(statusOf("ALL"), undefined);
  assert.equal(statusOf("nonsense"), "PENDING");
});

test("a join code is read the way people paste it from a chat", () => {
  const code = (joinCode: string) =>
    requestToJoinSchema.safeParse({ joinCode, note: "" });

  assert.equal(code(" 3fa-9c2 ").data?.joinCode, "3FA9C2");
  assert.equal(firstMessage(code("3FA9C")), "validation.joinCodeInvalid");
  assert.equal(firstMessage(code("3FA9CZ")), "validation.joinCodeInvalid");
  assert.equal(
    firstMessage(
      requestToJoinSchema.safeParse({
        joinCode: "3FA9C2",
        note: "x".repeat(301),
      }),
    ),
    "validation.noteMax",
  );
});
