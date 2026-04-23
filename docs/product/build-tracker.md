# Build Progress Tracker

Use this file as the live tracker during implementation.

Status key:

- `[ ]` not started
- `[/]` in progress
- `[x]` done
- `[!]` blocked or needs decision

## Current Snapshot

- Overall status: `[/] The premium UI + auth hardening + redeploy pass is complete in code, green locally, and verified on the live Vercel app; the remaining blocker before fully closing the slice is human mobile QA`
- Last updated: `2026-04-23`
- Current focus: `Close the final submission-adjacent gap with human mobile QA while keeping route-level patient auth and the homepage Lighthouse warning tracked as explicit follow-up work`

## Canonical Design Reference

- `docs/product/ui-bible.md`

## Milestone Checklist

### 1. Project Setup

- [x] initialize app
- [x] choose stack and document it
- [x] add environment variables template
- [x] set up database project
- [x] connect app to database
- [x] configure deployment target
- [x] configure PWA basics

### 2. Database and Seed Data

- [x] create `vendors` data
- [x] create `hospitals` table
- [x] create `doctors` table
- [x] create `pricing` table
- [x] create `patients` table
- [x] create `bookings` table
- [x] create `wallet_transactions` table
- [x] create `booking_tasks` table
- [x] seed hospital, doctor, and pricing data
- [x] verify seed data via query

### 3. Patient Search Experience

- [x] fetch hospitals from API
- [x] render 3 hospital cards
- [x] show default lowest price on each card
- [x] doctor selector updates price
- [x] room selector updates price
- [x] add USD/INR/NGN currency toggle
- [x] make search page mobile-first
- [x] add trust signals
- [x] add loading state
- [x] add empty state
- [x] add API error state

### 4. Booking Flow

- [x] open booking review from `Book Now`
- [x] show selected hospital, doctor, room, and price
- [x] show wallet balance starting at `$0`
- [x] allow confirm with zero balance
- [x] create patient record if needed
- [x] create booking on confirm
- [x] create wallet transaction on confirm
- [x] create vendor task on confirm
- [x] show confirmation screen
- [x] show booking ID
- [x] show updated negative wallet balance
- [x] handle booking failure state

### 5. Vendor Dashboard

- [x] build vendor login page
- [x] hardcode login rule for `apollo` / `apollo123`
- [x] create vendor session strategy
- [x] fetch bookings from API
- [x] show patient name
- [x] show procedure, doctor, room, price, status
- [x] support booking details view
- [x] support task completion action
- [x] update booking status to `In Progress`
- [x] verify new patient booking appears on refresh

### 6. QA and Submission

- [x] test happy path end to end
- [x] test invalid vendor login
- [x] test no-data state
- [x] test API validation errors
- [/] test mobile layout
- [x] test currency formatting
- [x] test negative wallet math
- [x] deploy live app
- [/] prepare repo for submission
- [x] write 3 to 5 line AI usage note

## Critical Acceptance Checks

- [x] No hardcoded frontend hospital data
- [x] Booking creates real database record
- [x] Wallet can go negative
- [x] Vendor sees same booking data source
- [x] Task completion changes booking state
- [/] App works on phone
- [x] Project is deployable

## Open Decisions / Assumptions

- [x] Confirm whether one vendor account should see all demo bookings
- [x] Decide minimal patient identity fields at booking time
- [x] Decide whether vendor updates should be refresh-based or real-time
- [x] Decide image placeholder strategy for hospital cards
- [x] Decide whether app runtime should point to local Supabase or the hosted project first

## Notes Log

### 2026-04-23

- Pushed the local migrations and seed into the existing hosted Supabase project using the IPv4 session-pooler URI, then verified hosted `hospitals` reads and public/private access boundaries against the live project.
- Found that the Vercel project itself was misconfigured with `framework: null`; this caused `vercel build` to emit a 404-only output despite successful Next builds. Patched the project framework to `nextjs`, redeployed production, and restored real route output.
- Reverified the public deployment at `https://project-feiuh.vercel.app` with direct route checks for `/`, `/manifest.webmanifest`, and `/vendor/login`.
- Ran a browser-level production probe against the public URL and confirmed the hosted patient-to-vendor workflow still books successfully, shows the negative wallet state, and transitions the vendor task into `In Progress`.
- Implemented the UI bible across `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`, and `/vendor/dashboard` with a photography-led homepage, calmer booking proof surfaces, and a quieter operational vendor workspace while keeping the patient-to-vendor workflow unchanged.
- Split the new route-level UI work into smaller feature-local modules so repo policy and dependency boundaries stay green after the redesign.
- Verified the UI pass locally with `pnpm repo:policy`, `pnpm build`, `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`, and `pnpm repo:check`.
- Linked the repo to Vercel, set the production Supabase runtime envs there, and created a production deployment at `https://project-feiuh.vercel.app`.
- Restored a truthful green local baseline by refactoring the remaining oversized booking, patient-search, and vendor UI files and by documenting `framer-motion` in the repo OS config.
- Updated the focused Playwright smoke flow so it now proves INR continuity from search into booking and confirmation, plus the negative wallet outcome before vendor task completion.
- Added deterministic tests for currency formatting plus patient-search and vendor empty-state guidance without mutating seeded data.
- Added installability basics with `app/manifest.ts`, branded icons in `public/`, a narrow `public/sw.js`, production-only service-worker registration from the root layout, and a no-cache header for the service worker file.
- Rewired `.env.example`, `supabase/README.md`, and `.github/workflows/ci.yml` around the same hosted-ready Supabase env contract and made Playwright stop reusing stale local servers by default.
- Added signed vendor-session cookies, hashed vendor credential verification, and same-browser booking-confirmation access while keeping guest search and booking review public.
- Added the root `README.md` with setup, envs, live URL, vendor route, demo credentials, and direct submission-answer prompts.
- Mirrored the hosted Supabase values plus `ROGVEDA_SESSION_SECRET` into GitHub Actions secrets for `Deependra-Codes/RogVeda`.
- Fixed the homepage text-wrap and mobile dark/readability regressions, moved route imagery onto repo-local configurable assets, and made the service worker stop caching Next.js scripts or styles.
- Found two truthfulness bugs while re-verifying the redesigned UI pass:
  stale `next start --port 3200` processes could make local browser checks hit an older build than the one just compiled, and stale `.next` artifacts after local Supabase resets could preserve old hospital or doctor IDs inside the static homepage.
- Fixed those verification traps by cleaning `.next` before every build, keeping Playwright on a dedicated port, unregistering Rogveda service workers on localhost, and rebuilding the local release path from a clean output directory.
- Re-pushed the vendor-password migration and current seed hash to hosted Supabase, redeployed Vercel production, and re-ran a live browser probe that completed search -> booking -> confirmation -> vendor task completion on `https://project-feiuh.vercel.app`.
- Fixed the GitHub runner by installing Playwright Chromium inside `.github/workflows/ci.yml`; the latest `main` push now clears CI successfully.
- Hardened vendor form POST redirects so login/session cookies and task-completion redirects preserve the submitting origin; the focused patient-to-vendor smoke is green again locally.
- Re-ran `pnpm repo:check`, deployed production with archived Vercel upload, and confirmed the live patient-to-vendor probe on booking `94be4281-61c9-4530-9601-b16bc060f15b`.

### 2026-04-22

- Created planning and tracking docs from the PRD.
- No code implementation started yet.
- Adopted a lightweight process OS inspired by RepoBrainOs: agent contract, execution playbook, templates, and Rogveda-specific intent/spec docs.
- Started hard-enforced engineering OS bootstrap with canonical names, standards, and repo automation.
- Finished hard-enforced engineering OS bootstrap: git hooks, CI, repo commands, tests, and checks are passing.
- Added and enforced a canonical fast-start context handoff file at `docs/context/current-state.md`.
- Scaffolded the Next.js app baseline with a live root route, feature public entrypoint, and passing `pnpm repo:check`.
- Added Supabase foundation files, server-owned patient search mapping, interactive hospital cards, and a booking preview route.
- Local Supabase now boots successfully, applies the Rogveda migration, seeds all hospital data, and returns 3 hospitals on query.
- Switched `.env.local` to the verified local Supabase runtime and added the local secret key for upcoming server write slices.
- The hosted Supabase project still does not expose `public.hospitals`, so it remains a later schema-sync task.
- `pnpm repo:check` now passes after the patient search foundation slice.
- Implemented vendor login and dashboard routes with server-owned session and shared booking read path.
- Implemented vendor task completion action wired to `complete_booking_task` RPC and booking status transition feedback.
- Added vendor contract/model/session tests and kept `pnpm repo:quality` green after implementation.
- Split Supabase runtime access into explicit read and write helpers and removed fallback writes.
- Added repo-native RPC parity preflight, route-entry JS budget enforcement, and active Lighthouse config for public routes.
- Cached patient search reads under a dedicated tag and removed blanket route invalidation from booking and vendor actions.
- Refactored booking and vendor public pages into smaller feature-local UI modules and deleted stale preview-era client files.
- Replayed the missing local RPC migration, added a follow-up SQL fix for `complete_booking_task`, and made `repo:check` fail fast when the active local schema cache drifts.
- Shrunk the patient-search client boundary so the page shell and card media stay server-rendered while doctor or room or currency interaction remains client-owned.
- `pnpm repo:check` now passes with no booking-flow skip, and the focused Playwright smoke file passes for both the happy path and invalid vendor login.
- Recorded post-hardening route entry gzip sizes: `/` = `18,827 B`, `/booking` = `16,823 B`, `/vendor/dashboard` = `16,823 B`, `/vendor/login` = `16,823 B`.
- Lighthouse now runs during `repo:check`; accessibility and best-practices are enforced, while current performance warnings are recorded at `/` = `0.49` and `/vendor/login` = `0.53`.
- Enabled RLS on all trial tables, limited public Supabase reads to `hospitals`, `doctors`, and `pricing`, and moved private read loaders onto service-role-backed access.
- Restricted the privileged booking RPCs to `service_role` and added a PostgREST schema reload migration so public clients cannot execute them from stale API metadata.
- Added repo-native public-access probes so `pnpm repo:check` now verifies that the public key cannot read private rows or call the restricted RPCs.
- Latest Lighthouse pass improved to `/` = `0.54` and `/vendor/login` = `0.62`, while accessibility and best-practices remain at or above enforced thresholds.
- Added `docs/product/ui-bible.md` plus a full `ui-experience-bible` record set so future UI work now has a canonical premium healthcare design reference with route-by-route guidance and AI-ready implementation prompts.

## Draft Submission Note

- Live deployed URL: `https://project-feiuh.vercel.app`
- Vendor dashboard route: `/vendor/dashboard`
- AI usage note:
  Used OpenAI Codex in the repo-native `Intent -> Research -> Spec -> Tests -> Implementation -> Verification` loop to refactor the route UI, preserve the working booking workflow, and verify the changes end to end instead of stopping at static mockups.
  The hardest part was keeping the live-release claims truthful while hosted deployment debugging crossed two layers: Supabase parity first, then a Vercel project that was quietly set to `framework: null` and producing a 404-only bundle.
  The remaining work is human mobile QA rather than missing core product features.
