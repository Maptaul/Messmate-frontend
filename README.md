# MessMate — Smart Mess & Shared Housing Management Platform (Frontend)

The web app for MessMate. Residents of a shared mess plan their meals, the manager
keeps the ledger (meals, groceries, bills, deposits, bazar duty), closing the month
turns all of it into one bill per member, and members pay by card (Stripe) or bKash.
English by default, Bangla at `/bn`, light and dark.

**Live app:** <https://meassmate.vercel.app> ·
**Live API:** <https://messmatebackend.vercel.app> ·
**Backend repo:** <https://github.com/Maptaul/Messmate-Backend> ·
**API reference:** [docs/API.md](https://github.com/Maptaul/Messmate-Backend/blob/main/docs/API.md)

---

## Demo accounts

One click on `/login` signs in as any of them. They hold demo data only.

| Role         | Email                  | Password                |
| ------------ | ---------------------- | ----------------------- |
| Admin        | `admin@messmate.app`   | `Admin@messmate12345`   |
| Mess manager | `manager@messmate.app` | `Manager@messmate12345` |
| Member       | `member@messmate.app`  | `Member@messmate12345`  |

The demo manager runs **Shanti Niloy Bachelor Mess** with four members and three
closed months; the demo member lives there with the newest closed month still
unpaid, so the card and bKash buttons have something to pay. Two more messes and their members
sit beside it (`*@messmate.test`, same passwords as the demo member, managers as
the demo manager). The API's `pnpm seed:demo --write` resets all of it.

Paying in test mode:

| Method | What to enter |
| ------ | ------------- |
| Card (Stripe) | `4242 4242 4242 4242`, any future date, any CVC |
| bKash sandbox | wallet `01770618575`, OTP `123456`, PIN `12121` |

Both are also printed under the pay buttons.

---

## Tech Stack

| Tech                                          | Purpose                                              |
| --------------------------------------------- | ---------------------------------------------------- |
| Next.js 16 (App Router, Turbopack)            | Server components, `proxy.ts`, route-level loading   |
| React 19.2 + React Compiler                   | UI                                                   |
| TypeScript (strict)                           | Type safety                                          |
| Tailwind CSS v4 + shadcn/ui (base-nova)       | Design system on Base UI primitives                  |
| TanStack Query v5                             | Server state, caching, optimistic updates            |
| TanStack Form v1 + Zod v4                     | Forms with real-time validation                      |
| ofetch                                        | API client                                           |
| jose                                          | Verifies the access token in `proxy.ts`              |
| Zustand                                       | Client state (create-mess wizard draft)              |
| Recharts (shadcn charts)                      | Dashboard charts                                     |
| sonner                                        | Toasts                                               |
| next-themes                                   | Light / dark mode                                    |
| `@react-oauth/google`                         | Google sign-in                                       |
| Roboto + Anek Bangla (`next/font`)            | English and Bangla type                              |
| Biome, `node:test`                            | Lint + format, unit tests                            |

---

## What each role gets

| Role             | Pages                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**        | `/admin` platform overview with weekly trends and charts, `/admin/manager-requests` (pending, approved, rejected; approve, or reject with a reason; a sidebar badge counts what waits), `/admin/users` (search, filters, role change, block/unblock) and each user's detail, `/admin/messes` (filter by manager) and each mess's detail (cycles, members, activity, reopen a closed month), `/admin/audit-logs` with a change sheet |
| **Mess manager** | `/manager` month at a glance (rate, bazar, shared, outstanding with trends, tomorrow's headcount, meals per day), meal register (record a day or browse every entry), month headcount, expenses with receipt upload and payer filter, deposits with who hasn't paid, bazar duty calendar, billing cycles with an expandable settlement table and close, bills with cash payments, a breakdown sheet and a PDF of each bill (a balance moved into the next month shows as carried), members (the mess's join code to copy or renew, invite by email, requests to approve or decline with a sidebar badge, default meals, plan for them), activity timeline, mess settings, a four-step create-mess wizard prefilled from the approved request, whose draft survives a reload |
| **Member**       | `/dashboard` today (plan tomorrow until 11 PM, running bill), meal plan calendar (day, several days, "I'm away", defaults), the read-only mess ledger in tabs, bills with Stripe or bKash and a PDF of each bill, payment history with a detail sheet, activity with new changes marked. Without a mess, the dashboard asks for a join code — showing the mess before you ask — and lists invitations to accept or decline |
| **Everyone**     | `/profile` (photo, details, memberships with leave and join another, invitations and requests, a request to run a mess and its answer, password reset link), `/finance` personal income and spending by day, week, month or year, with charts, filters and CSV export |
| **Public**       | Home (with a bill estimator), features, about us, FAQ with search, contact, login (three demo accounts + Google), register with email OTP and live password rules — choosing to run a mess asks for its name and address and sends a request to the admin — forgot password |

A manager also eats and pays like a member, so the manager sidebar carries the
member pages too. A manager runs one mess, so once it exists the create entry
disappears. Nobody is put into a mess without agreeing: a member asks with the
join code and the manager approves, or the manager invites and the member
accepts. Managers and members get an activity bell in the header with the
number of changes since they last opened the feed. The header also has a jump-to
menu (⌘K), the open month and its meal rate, the 11 PM countdown and quick actions
(N) that open the create forms directly (`?new=1`).

---

## How it fits together

- **Same-origin API.** `next.config.ts` rewrites `/api/v1/*` to `BACKEND_URL`, so the
  auth cookies the API sets belong to this app and `proxy.ts` can read them.
- **Route protection.** `src/proxy.ts` verifies the access token, sends each role to
  its own area (`/admin`, `/manager`, `/dashboard`), renews an expired token with the
  refresh token, and keeps the language prefix.
- **Server prefetch.** Each page prefetches the queries its first render needs on the
  server and hands them to the client through `HydrationBoundary`; the client reads the
  same query keys with `useSuspenseQuery`.
- **URL state.** Filters, search, dates and pages live in the query string, so any view
  can be bookmarked or shared.
- **Bilingual.** Every route sits under `app/[lang]`. English has no prefix, Bangla is
  `/bn/...`; a `NEXT_LOCALE` cookie remembers the choice. Strings live in
  `src/i18n/dictionaries/en.json` and `bn.json`.
- **Exports.** A bill's PDF is the browser's own "Save as PDF" of a print-only invoice,
  so Bangla keeps its conjuncts. Every table has an Export CSV button that fetches every
  page matching the current filters, with a BOM so Excel opens Bangla correctly.
- **Payments.** Card payments open Stripe Checkout; `/payment/success` confirms the
  session with the API on the server before showing a result. bKash returns to the same
  page with its own status.

```text
src/
├── app/[lang]/
│   ├── (public)/(marketing)/        home, features, about-us, faq, contact
│   ├── (public)/(authentication)/   login, register, register/verify-account, forgot-password
│   └── (dashboard)/                 admin/, manager/, dashboard/, (account)/  — one layout per role
├── api/            one function per endpoint
├── hooks/          TanStack Query hooks (useX / useSuspenseX, mutations invalidate)
├── components/
│   ├── dashboard/  dashboard shell, sidebar, mess switcher, user menu
│   ├── form/       every form, built on a shared useAppForm
│   ├── layout/     public header and footer
│   ├── modules/    one folder per feature: *-list, *-table, *-table-loading, *-actions, dialogs
│   └── ui/         shadcn components and shared ones (data table, stat card, pagination…)
├── routes/         sidebar links per role
├── lib/            API clients, session, active mess / month
├── validation/     Zod schemas that mirror the API's rules
├── i18n/           dictionaries and helpers
└── proxy.ts
```

---

## Setup

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env.local   # then fill in the values below

# 3. Run — with the MessMate API running locally on port 5000
pnpm dev                     # http://localhost:3000
```

**Which API?** The backend URL is picked by mode, from two committed files that hold
nothing secret:

| Mode                                  | File               | `BACKEND_URL`                        |
| ------------------------------------- | ------------------ | ------------------------------------ |
| `pnpm dev`                            | `.env.development` | `http://localhost:5000` (local API)  |
| `pnpm build`, `pnpm start`, Vercel    | `.env.production`  | `https://messmatebackend.vercel.app` |

To develop against the live API without running the backend, put
`BACKEND_URL=https://messmatebackend.vercel.app` in `.env.local`; it overrides both.

| Variable (`.env.local`)        | Value                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `JWT_ACCESS_SECRET`            | the API's `JWT_ACCESS_SECRET` — used only on the server, by `proxy.ts`        |
| `NEXT_PUBLIC_APP_URL`          | this app's origin, e.g. `http://localhost:3000`                              |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | the API's Google OAuth client id; the Google button hides when it is empty   |
| `NEXT_PUBLIC_CONTACT_EMAIL`    | the inbox the contact page writes to                                         |

### Scripts

| Command                  | Does                                |
| ------------------------ | ----------------------------------- |
| `pnpm dev`               | Dev server                          |
| `pnpm build`             | Production build                    |
| `pnpm start`             | Serve the production build          |
| `pnpm lint`              | Biome check                         |
| `pnpm format`            | Biome format                        |
| `pnpm test`              | Unit tests (`tests/*.test.ts`)      |
| `pnpm exec tsc --noEmit` | Typecheck                           |

CI (`.github/workflows/ci.yml`) runs install, typecheck, lint, tests and a build on
every push.

---

## Deployment (Vercel)

Import the repository in Vercel and set the four variables above (`BACKEND_URL`
comes from `.env.production`), with
`NEXT_PUBLIC_APP_URL` set to the deployed origin. Then, on the API:

| API variable         | Value                                   | Why                                     |
| -------------------- | --------------------------------------- | --------------------------------------- |
| `FRONTEND_URL`       | this app's origin                       | Stripe returns the payer to `/payment/success` or `/payment/cancel` |
| `PAYMENT_RESULT_URL` | this app's origin + `/payment/success`  | bKash returns the payer here with `?status=` |
| `STRIPE_SECRET_KEY`  | a Stripe test key (`sk_test_…`)         | card payments                           |

Finally add this origin to the Google OAuth client's authorised JavaScript origins.
