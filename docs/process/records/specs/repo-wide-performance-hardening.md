# Spec: Repo-Wide Performance Hardening

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/repo-wide-performance-hardening.md`

## Problem Statement

Rogveda needs stricter runtime truthfulness, explicit Supabase privilege boundaries, and enforced performance budgets before later hosted and deployment work.

## Scope

- explicit Supabase read and write env resolution plus client helpers
- runtime RPC preflight before Playwright in `pnpm repo:check`
- route-entry JS budget enforcement from Next build artifacts
- Lighthouse activation for `/` and `/vendor/login`
- patient search caching and removal of unrelated route invalidations
- booking, confirmation, and vendor dashboard file-splitting into feature-local UI modules
- deletion of stale client files left from the earlier preview shape

## Non-Goals

- hosted Supabase sync
- deployment target setup
- production auth hardening
- changing search, booking, wallet, or vendor workflow behavior

## Behavioral Requirements

1. `lib/env.ts` must expose explicit read and write env helpers.
2. `supabase/clients/server.ts` must expose explicit read and write client helpers.
3. Patient search and booking confirmation read paths must use the read helper.
4. Booking confirmation writes, vendor auth, and vendor task completion must use the write helper.
5. `pnpm repo:check` must fail when the booking RPCs are not discoverable in the active schema cache.
6. The patient-to-vendor smoke test must no longer skip when the booking RPC is missing.
7. `pnpm repo:check` must fail when any measured route entry exceeds its configured gzip budget.
8. `pnpm repo:check` must run Lighthouse when `lighthouserc.json` is present.
9. `/` must stop forcing request-scoped rendering and patient search reads must be cached under a dedicated tag.
10. Booking and vendor mutations must not invalidate the patient search route.
11. `features/booking/public/booking-review-page.tsx`, `features/booking/public/booking-confirmation-page.tsx`, and `features/vendor/public/vendor-dashboard-page.tsx` must delegate presentation sections into feature-local UI files.
12. `features/booking/client/booking-intake-shell.tsx` and `features/patient-search/client/hospital-result-card-controller.tsx` must be removed.

## Acceptance Examples

1. When the RPCs are available locally, `pnpm repo:check` reaches Playwright instead of failing the preflight.
2. When `create_booking_transaction` is absent from the schema cache, `pnpm repo:check` fails with a parity-specific error before browser tests run.
3. A booking confirmation or task completion no longer revalidates `/`.
4. The patient search route still supports instant currency, doctor, and room interaction after the client-layer reduction.

## Invariants

- business authority remains server-owned
- local Supabase remains the canonical runtime for this slice
- no new cross-feature shared UI abstractions are added unless truly reused
- route budgets are measured from built assets, not guessed from source structure

## Contract And Data Model Changes

- API changes:
  none at the user-facing route contract level
- runtime contract changes:
  explicit read and write env plus client helpers
- repo automation changes:
  route-budget enforcement, RPC preflight, and Lighthouse activation in `repo:check`
- illegal states to remove:
  mutation paths using fallback read credentials and green checks that still hide missing RPCs

## Test Strategy

- Unit:
  env helper tests and repo runtime-check tests
- Integration:
  `pnpm repo:quality`, `pnpm build`, and `pnpm repo:check`
- End-to-end:
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- Manual verification:
  mobile layout pass on `/`, `/booking`, `/vendor/login`, and `/vendor/dashboard`

## Verification Notes

- Commands:
  `pnpm repo:quality`
  `pnpm build`
  `pnpm repo:check`
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- Artifacts:
  env and Supabase helpers, route budget tooling, Lighthouse config, booking and vendor UI refactors, and updated context or tracker docs
