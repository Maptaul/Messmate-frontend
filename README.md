# MessMate — Smart Mess & Shared Housing Management Platform (Frontend)

The web app for MessMate. Residents of a shared mess plan their meals, the manager
keeps the ledger (meals, groceries, bills, deposits, bazar duty), closing the month
turns all of it into one bill per member, and members pay by card (Stripe) or bKash.
English by default, Bangla at `/bn`, light and dark.

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
| **Admin**        | `/admin` platform overview with charts, `/admin/users` (search, filters, role change, optimistic block/unblock) and each user's detail, `/admin/messes` and each mess's detail (members, recent months, reopen a closed month), `/admin/audit-logs` |
| **Mess manager** | `/manager` month at a glance, meal register (edit or delete a single entry), headcount, expenses with receipt upload, deposits, bazar duty, billing months with settlement preview and close, bills with cash payments and a PDF of each bill, members, activity log, mess settings, a four-step create-mess wizard |
| **Member**       | `/dashboard` today, meal plan (optimistic, locks at the 11 PM cutoff), the mess ledger, bills with Stripe or bKash and a PDF of each bill, payment history, activity |
| **Everyone**     | `/profile` (photo upload with progress), `/finance` personal income and spending with charts and CSV export                                         |
| **Public**       | Home, features, about us, FAQ, contact, login (three demo accounts + Google), register with email OTP, forgot password               |

A manager also eats and pays like a member, so the manager sidebar carries the
member pages too. Managers and members get an activity bell in the header with the
number of changes since they last opened the feed.

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
  so Bangla keeps its conjuncts; the finance CSV holds every entry for the current
  filters, with a BOM so Excel opens Bangla correctly.
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
