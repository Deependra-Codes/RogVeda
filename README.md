# Rogveda

Rogveda is a mobile-first medical travel trial app for international patients comparing treatment options in India. It ships one connected workflow: public hospital comparison, booking confirmation with negative-wallet support, and a vendor dashboard that reads the same saved booking and completes the first coordination task.

## Start Here

- Repo context: `docs/context/current-state.md`
- Product brief: `docs/product/trial-brief.md`
- Build status: `docs/product/build-tracker.md`
- Supabase setup + hosted push notes: `supabase/README.md`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Postgres
- Playwright + Vitest + repo-native policy checks

## Quickstart (Local)

Prereqs: Node >= `20.9.0`, `pnpm`, and Docker Desktop.

1. Bootstrap deps + hooks:
   `pnpm repo:bootstrap`
2. Start local Supabase:
   `pnpm dlx supabase start`
3. Replay migrations + seed:
   `pnpm dlx supabase db reset`
4. Fetch local URL + keys:
   `pnpm dlx supabase status`
5. Create `.env.local` from `.env.example` and paste values.
6. Start the app:
   `pnpm dev`

To run the full repo gate locally:
`pnpm repo:check`

## Env Contract

Required envs:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (preferred when available)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback for older projects / local CLI output)
- `SUPABASE_SERVICE_ROLE_KEY`
- `ROGVEDA_SESSION_SECRET`

Notes:

- Read-only patient-search paths can fall back to the publishable or anon key.
- Booking writes, vendor auth, vendor task completion, and booking-confirmation access require the service-role key plus `ROGVEDA_SESSION_SECRET`.

## Repo Tour

- `app/` owns route shells only and composes feature public entrypoints.
- `features/` owns product boundaries (see `features/README.md`).
- `components/ui/` owns reusable primitive UI only.
- `lib/` owns shared infra: env, formatting, and low-level helpers.
- `supabase/` owns schema, migrations, seed, and clients.
- `tools/repo/` owns repo OS automation (`repo:*` scripts).

Key routes:

- `/` -> `app/page.tsx` -> `features/patient-search/public`
- `/booking` -> `app/booking/page.tsx` -> `features/booking/public`
- `/booking/confirmation/[bookingId]` -> `app/booking/confirmation/[bookingId]/page.tsx` -> `features/booking/public`
- `/vendor/login` + `/vendor/dashboard` -> `features/vendor/public`

## Repo Commands

- `pnpm repo:policy`
- `pnpm repo:sync`
- `pnpm repo:quality`
- `pnpm build`
- `pnpm repo:check`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`

## Deployment (Vercel + Hosted Supabase)

1. Push schema + seed to hosted Supabase (see `supabase/README.md`).
2. Set the envs in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ROGVEDA_SESSION_SECRET`
3. Deploy via Vercel Git integration, or:
   `pnpm dlx vercel deploy --prod --yes`

Troubleshooting:

- If a Vercel deploy returns only 404s even though `next build` succeeds, confirm the Vercel project framework is set to `Next.js` (not `null`).

## Demo Access

- Live app: `https://project-feiuh.vercel.app`
- Vendor route: `/vendor/dashboard`
- Vendor login: `apollo`
- Vendor password: `apollo123`

## What The Demo Shows

1. Patients compare `Total Knee Replacement in Delhi` across 3 backend-driven hospitals.
2. Doctor and room selections update the price instantly in `USD`, `INR`, and `NGN`.
3. Booking confirmation is allowed from a zero wallet balance and creates a negative-wallet result.
4. The booking, wallet transaction, and vendor task are written together in Supabase.
5. The vendor logs in, sees the same booking, and moves it from `Confirmed` to `In Progress`.

## Submission Answers

- Live deployed URL:
  `https://project-feiuh.vercel.app`
- Code repository:
  `https://github.com/Deependra-Codes/RogVeda`
- Vendor dashboard route:
  `/vendor/dashboard`
- AI tool and approach:
  OpenAI Codex was used inside the repo-native `Intent -> Research -> Spec -> Tests -> Implementation -> Verification` loop so the work stayed grounded in the real workflow, not just static UI mockups.
- Hardest part:
  Keeping the repo and deployment claims truthful while work crossed multiple layers at once: Supabase parity, Vercel project/env state, route-level UI quality, and targeted auth hardening without drifting into full patient auth.

## Current Notes

- Booking confirmation access is intentionally same-browser only in this slice and now uses a signed confirmation cookie.
- Route-level patient auth is still later work.
- Human mobile QA remains a final manual pass even though automated viewport checks are included.
