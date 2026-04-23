# Rogveda

Rogveda is a mobile-first medical travel trial app for international patients comparing treatment options in India. It ships one connected workflow: public hospital comparison, booking confirmation with negative-wallet support, and a vendor dashboard that reads the same saved booking and completes the first coordination task.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Postgres
- Playwright + Vitest + repo-native policy checks

## Local Setup

1. Install `pnpm`, Docker Desktop, and the Supabase CLI.
2. Start local Supabase:
   `pnpm dlx supabase start`
3. Reset migrations and seed data when needed:
   `pnpm dlx supabase db reset`
4. Create `.env.local` from `.env.example`.
5. Start the app:
   `pnpm dev`

## Env Contract

Required envs:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ROGVEDA_SESSION_SECRET`

Notes:

- Read-only patient-search paths can fall back to the publishable or anon key.
- Booking writes, vendor auth, vendor task completion, and booking-confirmation access require the service-role key plus `ROGVEDA_SESSION_SECRET`.

## Repo Commands

- `pnpm repo:policy`
- `pnpm repo:sync`
- `pnpm repo:quality`
- `pnpm build`
- `pnpm repo:check`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`

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
