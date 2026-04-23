# Spec: Supabase RLS Access Hardening

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/supabase-rls-access-hardening.md`

## Problem Statement

Rogveda needs database-level access boundaries that match the product shape: guest users can compare hospitals, but private patient, vendor, booking, wallet, and task records must not be queryable or mutable through public Supabase keys.

## Scope

- RLS enablement for all trial tables
- explicit public read policies for hospital-search tables only
- public execute restriction for booking RPCs
- server-boundary changes so private loaders require service-role-backed access
- repo-native verification for public vs private Supabase access

## Non-Goals

- adding real patient authentication
- changing the visual UI or product flow
- replacing the current vendor session cookie with Supabase Auth

## Behavioral Requirements

1. `vendors`, `hospitals`, `doctors`, `pricing`, `patients`, `bookings`, `wallet_transactions`, and `booking_tasks` must all have RLS enabled.
2. Only `hospitals`, `doctors`, and `pricing` may be publicly readable through anon or publishable Supabase access.
3. `patients`, `vendors`, `bookings`, `wallet_transactions`, and `booking_tasks` must not expose rows through public Supabase access.
4. `create_booking_transaction` and `complete_booking_task` must not be executable through public Supabase access.
5. Patient search must continue to work through the read client after RLS is enabled.
6. Booking review, booking confirmation, and vendor dashboard loaders must require service-role-backed access.
7. `pnpm repo:check` must fail if the public Supabase key can see seeded private rows or execute the restricted RPCs.

## Acceptance Examples

1. A public Supabase client can select hospitals, doctors, and pricing rows.
2. A public Supabase client cannot read the seeded `apollo` vendor row or the seeded demo patient row.
3. After the happy-path smoke test creates booking records, a public Supabase client still sees no bookings, wallet transactions, or booking tasks.
4. Booking review, confirmation, vendor login, and vendor dashboard still work through the app after RLS is enabled.

## Invariants

- Must always hold:
  public browsing remains available for patient search
  booking and vendor workflows remain server-authoritative
  the database boundary must not trust public Supabase access for private workflow state
- Must not regress:
  `pnpm repo:check` and the patient-to-vendor smoke flow

## Contract And Data Model Changes

- runtime contract changes:
  private read loaders now require the write client and service role availability
  generic read resolution prefers publishable or anon keys before service role
- data model changes:
  RLS policies, grants, and RPC execute restrictions in a new migration
- verification changes:
  repo runtime checks add public-access probes after the smoke flow

## Test Strategy

- Unit:
  env helper preference test and repo runtime-check helper tests
- Integration:
  `pnpm repo:quality`, `pnpm build`, `pnpm repo:check`
- Regression:
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- Manual verification:
  direct public-key probes against local Supabase and a quick route sanity pass

## Verification Notes

- Commands:
  `pnpm repo:quality`
  `pnpm build`
  `pnpm repo:check`
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
  `pnpm dlx supabase migration up --local --yes`
- Artifacts:
  new RLS migration, updated Supabase env and loader boundaries, repo runtime checks, and updated handoff docs
