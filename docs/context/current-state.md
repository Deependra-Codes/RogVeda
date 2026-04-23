# Current State

Status: active
Last updated: 2026-04-23
Current phase: the premium UI + auth hardening + vendor form redirect hardening pass is verified locally and on the live Vercel deployment; the remaining blockers are human mobile QA plus later route-level patient auth work rather than missing product flow or repo health

## Purpose

This is the fastest handoff file for any contributor or AI.

Read this first to understand:

- what already exists
- what is enforced
- what is still missing
- what the next best step is

Update this file after non-trivial work so the next person does not need to rediscover repo state from scratch.

## Start Here

If you are starting a new session:

1. read this file fully
2. read `docs/product/trial-brief.md`
3. read `docs/product/build-tracker.md`
4. read `docs/product/ui-bible.md` before visual or route-layout work
5. read the active intent and spec for the slice you are about to build
6. then start the smallest high-value implementation slice

## Repo Snapshot

- Repo type:
  Rogveda trial repo with hard-enforced engineering OS
- Product app state:
  patient search, booking confirmation write path, and vendor login/dashboard task flow are implemented on top of the app scaffold with read/write Supabase runtime boundaries, cached patient search reads, verified database-level RLS boundaries, deterministic coverage for empty states and currency or wallet display rules, production-ready PWA basics, a canonical UI bible, a completed premium route-level UI implementation across `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`, and `/vendor/dashboard`, plus targeted auth hardening through signed vendor sessions, hashed vendor credentials, same-browser booking confirmation access, and origin-preserving vendor form POST redirects
- Git state:
  the latest production deploy was issued from this workspace; these latest local changes are not yet committed or pushed to `origin/main`
- Quality state:
  `pnpm repo:check` is green after the vendor form POST redirect hardening, the archived Vercel production deploy succeeded, and the live browser probe completed search -> booking -> confirmation -> vendor task completion on `https://project-feiuh.vercel.app`

## What Exists Today

### Canonical docs

- `AGENTS.md`
- `docs/context/current-state.md`
- `docs/product/trial-brief.md`
- `docs/product/build-tracker.md`
- `docs/product/ui-bible.md`
- `docs/process/`

### Repo automation

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm repo:doctor`
- `pnpm repo:bootstrap`
- `pnpm repo:policy`
- `pnpm repo:sync`
- `pnpm repo:quality`
- `pnpm repo:check`

### Enforcement

- hard policy for non-trivial changes
- sync checks for mirrors and indexes
- quality checks with Biome, TypeScript, Vitest, Knip, and dependency-cruiser
- pre-commit hook in `.githooks/pre-commit`
- CI workflow in `.github/workflows/ci.yml`

### Folder shape prepared

- `app/`
- `features/`
- `components/ui/`
- `lib/`
- `supabase/`
- `tests/`
- `tools/repo/`

- `features/patient-search/public`
- `features/patient-search/ui`
- `features/patient-search/server`
- `features/patient-search/client`
- `features/booking/public`
- `features/booking/client`
- `features/vendor/public`
- `features/vendor/server`

### Live app shell

- `app/layout.tsx`
- `app/manifest.ts`
- `app/page.tsx`
- `app/globals.css`
- `app/loading.tsx`
- `app/error.tsx`
- `app/booking/page.tsx`
- `app/booking/confirmation/[bookingId]/page.tsx`
- `app/vendor/login/page.tsx`
- `app/vendor/dashboard/page.tsx`
- `app/vendor/actions/complete-task/route.ts`
- `app/vendor/actions/login/route.ts`
- `app/vendor/actions/logout/route.ts`
- `app/vendor/actions/redirect-url.ts`
- `features/patient-search/public/patient-search-page.tsx`
- `features/patient-search/server/list-search-results.ts`
- `features/patient-search/client/patient-search-experience.tsx`
- `features/patient-search/client/hospital-result-interactive-panel.tsx`
- `features/patient-search/ui/hospital-result-card.tsx`
- `features/patient-search/ui/patient-search-route-sections.tsx`
- `features/patient-search/ui/hospital-result-card-overview.tsx`
- `features/patient-search/ui/hospital-result-card-actions.tsx`
- `features/booking/public/booking-review-page.tsx`
- `features/booking/public/booking-confirmation-page.tsx`
- `features/booking/ui/booking-detail-block.tsx`
- `features/booking/ui/booking-page-frame.tsx`
- `features/booking/ui/booking-review-hero.tsx`
- `features/booking/ui/booking-review-panels.tsx`
- `features/booking/ui/booking-review-action-form.tsx`
- `features/booking/ui/booking-state-panel.tsx`
- `features/booking/server/load-booking-review.ts`
- `features/booking/server/load-booking-confirmation.ts`
- `features/booking/server/confirm-booking-action.ts`
- `features/vendor/public/vendor-login-page.tsx`
- `features/vendor/public/vendor-dashboard-page.tsx`
- `features/vendor/public/vendor-form-routes.ts`
- `features/vendor/ui/vendor-dashboard-header.tsx`
- `features/vendor/ui/vendor-dashboard-layout.tsx`
- `features/vendor/ui/vendor-login-sections.tsx`
- `features/vendor/ui/vendor-summary-panel.tsx`
- `features/vendor/ui/vendor-info-panel.tsx`
- `features/vendor/ui/vendor-booking-card.tsx`
- `features/vendor/ui/vendor-booking-card-sections.tsx`
- `features/vendor/ui/vendor-state-panels.tsx`
- `features/vendor/server/vendor-form-flow.ts`
- `components/ui/service-worker-register.tsx`
- `public/sw.js`
- `public/favicon.svg`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon-maskable-512.png`
- `public/apple-touch-icon.png`
- `tools/repo/runtime-checks.mjs`
- `tools/repo/supabase-access-checks.mjs`
- `lighthouserc.json`
- `.vercel/project.json` via Vercel CLI link in the ignored local project metadata

### Data foundation

- `.env.example`
- `.env.local` configured to the verified local Supabase URL, publishable key, and secret key
- `supabase/config.toml`
- `supabase/migrations/20260422193000_rogveda_trial_foundation.sql`
- `supabase/migrations/20260422220000_booking_vendor_rpcs.sql`
- `supabase/migrations/20260422231500_complete_booking_task_return_ambiguity_fix.sql`
- `supabase/migrations/20260422234500_supabase_rls_access_hardening.sql`
- `supabase/migrations/20260422235500_restrict_public_rpc_execution.sql`
- `supabase/migrations/20260422235800_reload_postgrest_schema_after_acl_changes.sql`
- `supabase/migrations/20260423103607_vendor_password_hash_hardening.sql`
- `supabase/seed.sql`
- `supabase/types.ts`
- `supabase/clients/server.ts`
- `lib/env.ts`
- `lib/cookie-security.ts`
- `lib/signed-token.ts`
- `lib/currency.ts`
- `lib/experience-visuals.ts`
- `features/booking/server/confirmation-access.ts`
- `features/vendor/server/password-hash.ts`
- `tests/lib/currency.test.ts`
- `tests/lib/cookie-security.test.ts`
- `tests/ui/state-panels.test.ts`

## Engineering Rules That Matter Most

- workflow is:
  `Intent -> Research -> Spec -> Types/Data Model -> Tests -> Implementation -> Verification`
- write less code by default
- frontend is render and interaction orchestration only
- server side is the business brain
- no god files, dumping-ground folders, or casual dependency sprawl
- performance, memory, query count, and client overhead matter from day one
- every non-trivial change should leave the repo easier for the next contributor to resume

## Ready-To-Build Status

The repo is ready for product work because:

- the engineering OS is in place
- repo policy, sync, quality, and check commands pass
- hooks and CI are configured
- folder boundaries are prepared
- current-state handoff is now first-class
- Next.js App Router scaffold is live
- patient search feature is wired through server-owned data mapping
- patient search now keeps the hero and route shell on the server while doctor or room or currency interaction stays client-owned
- booking confirmation action writes booking, wallet transaction, and vendor task through server-owned RPC
- vendor login and dashboard are wired to shared persisted booking data
- vendor task completion updates booking status through server-owned RPC
- local Supabase startup, migration, seed, and hospitals query are verified
- Supabase runtime access is now split into explicit read and write helpers
- patient search reads now use a dedicated cache tag instead of blanket route invalidation
- repo checks now include RPC parity preflight, route-entry JS budget enforcement, and active Lighthouse config for public routes
- RLS is enabled across the trial schema, public Supabase access is limited to hospital-search tables, and privileged RPC execution is restricted to `service_role`
- repo checks now prove the public key cannot see private seeded rows or call the privileged booking RPCs
- the hardened local verification loop is green end to end, with route-entry budgets measured at `/` = `18,827 B`, `/booking` = `16,823 B`, `/vendor/dashboard` = `16,823 B`, and `/vendor/login` = `16,823 B` gzip
- `docs/product/ui-bible.md` now acts as the canonical visual and interaction source of truth for current routes and future patient-auth planning
- the UI bible is now implemented across the current product routes with a photography-led homepage, calmer booking proof surfaces, and a quieter operational vendor workspace
- the focused browser smoke path now proves INR continuity into booking and confirmation plus the negative wallet outcome before vendor task completion
- deterministic tests now cover search empty state, vendor empty state, and shared currency formatting rules without mutating seeded data
- manifest, install icons, and a narrow production-only service worker are now in place for installability basics
- GitHub Actions, `.env.example`, and `supabase/README.md` now use the same hosted-ready Supabase env contract, and the GitHub repo secrets now include `ROGVEDA_SESSION_SECRET` alongside the hosted Supabase values
- vendor sessions now use signed expiring cookies instead of unsigned base64 payloads, and vendor passwords are verified against stored scrypt hashes rather than plaintext
- vendor login, logout, and task completion now submit through origin-preserving route-handler POSTs so redirect cookies survive production-start browser flows
- booking confirmation pages now require a same-browser signed confirmation cookie instead of exposing booking details by raw `bookingId`
- the homepage hero copy and media system now use repo-local configurable visuals, and the mobile text-wrap or readability regression is fixed
- the service worker now skips localhost registration, clears old local Rogveda caches, and no longer caches Next.js scripts or styles
- the build path now starts from a clean `.next` directory so stale cached search IDs do not survive Supabase resets and poison later booking links
- the repo is now linked to the Vercel project, production Supabase envs are set on Vercel, hosted Supabase is migrated and seeded, and the public production deployment is live at `https://project-feiuh.vercel.app`
- the Vercel project framework is now explicitly set to `nextjs`; this fixed the broken `framework: null` deploy state that had been emitting a 404-only output bundle
- the current production deployment was reissued after the auth hardening and homepage refinement pass, and the live browser probe now confirms INR continuity, booking confirmation, and vendor task completion against hosted Supabase

## Current Gaps

- manual mobile QA still needs a human pass after the booking and vendor page refactors
- Lighthouse performance remains warning-level on this machine for `/`, even though accessibility and best-practices clear their enforced thresholds
- the patient-auth chapter in `docs/product/ui-bible.md` is design-only; route-level patient auth remains a later security slice

## Recommended Next Step

Finish the remaining manual and submission-adjacent blockers before calling the build fully submission-ready:

1. perform a human mobile QA pass on `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`, and `/vendor/dashboard`
2. keep route-level patient auth hardening and the `/` Lighthouse warning tracked as explicit follow-up work rather than reopening the hosted runtime slice
3. if a contributor sees dead currency switching or invalid booking links after another local Supabase reset, first confirm that no stale `next start --port 3200` process is running and then rebuild from the cleaned `.next` path before debugging app logic

## First Slice Goal

The current slice now hardens runtime truth, restores the local release baseline, and implements the UI bible across the current routes. The next slice should:

- preserve the now-working hosted runtime while moving into the next product slice
- keep business rules server-owned while preserving hosted and local parity
- preserve public guest search and current booking or vendor behavior
- keep future patient-auth surfaces design-only until security work is scheduled

## Open Assumptions

- package manager is `pnpm`
- target stack is `Next.js + TypeScript + Tailwind + Supabase`
- vendor updates can be refresh-based unless the product build later chooses real-time
- local Supabase is healthy on this machine and remains the active development runtime
- hosted Supabase is now the canonical deployment or submission runtime, while local Supabase remains the fastest developer loop

## Update Protocol

After non-trivial work, update at least:

- `Last updated`
- `Current phase`
- `Repo Snapshot`
- `What Exists Today`
- `Current Gaps`
- `Recommended Next Step`
- anything newly risky, blocked, or changed in direction
