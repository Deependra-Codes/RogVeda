# Spec: Patient Search Supabase Foundation

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/patient-search-supabase-foundation.md`

## Problem Statement

Rogveda needs a real backend-connected search foundation so the patient route can stop being a scaffold and become the first true product slice.

## Scope

- add `.env.example` for Supabase configuration
- add Supabase config, migration, seed data, and canonical DB types
- add a server-only Supabase client and env validation
- add a server-owned patient search query and mapping layer
- render the root route through a patient search public entrypoint backed by that server data
- add loading, empty, error, and unconfigured states
- add a lightweight booking review preview route so `Book Now` is not a dead end
- update repo rules so public feature entrypoints may compose server-side feature modules

## Non-Goals

- booking confirmation writes
- negative-wallet transaction logic
- vendor dashboard reads or updates
- deployment verification against a hosted Supabase project

## Behavioral Requirements

1. The root route must render through `features/patient-search/public` and must not hardcode hospital data in the route shell.
2. Patient search data must be modeled in Supabase migration and seed files using the PRD entities.
3. The patient search query must stay server-side and return a data model that includes doctors, room types, pricing, and lowest-price defaults.
4. Client-side interaction may only select among server-provided options and format currency for browsing.
5. Missing or invalid Supabase env values must produce a visible unconfigured state instead of crashing the app.
6. Loading, empty, and error states must exist for the patient search route.
7. Each hospital card must support doctor selection, room selection, dynamic price updates, and a `Book Now` action.
8. The booking preview route must preserve the chosen selection context while making it clear the confirmation transaction is the next slice.

## Acceptance Examples

1. `pnpm build` succeeds even when Supabase env values are absent.
2. With valid env and seeded data, the root route can render three hospital options from Supabase.
3. Changing the selected doctor or room updates the displayed estimate instantly without a refetch.
4. Clicking `Book Now` navigates to the booking preview route with preserved selection context.

## Invariants

- Must always hold:
  route shells stay thin and import only feature public entrypoints
- Must always hold:
  client layers do not import server modules or Supabase clients directly
- Must always hold:
  frontend data remains a projection of server-owned records, not the source of truth
- Must not regress:
  repo quality, dependency boundaries, and less-code guardrails

## Contract And Data Model Changes

- API changes:
  server-owned patient search read path and booking preview route
- Database changes:
  vendors, hospitals, doctors, pricing, patients, bookings, wallet_transactions, and booking_tasks tables plus enums
- Type or validation changes:
  Supabase database types, env validation, room type and workflow enums
- Illegal states to remove:
  frontend-only search scaffold with no real data contract

## Test Strategy

- Unit:
  verify search mapping defaults and conversion rates
- Integration:
  run `pnpm repo:quality`, `pnpm build`, `depcruise`, and `knip`
- Regression:
  ensure dependency-cruiser still blocks client/server boundary violations
- Manual verification:
  start local Supabase, seed data, set `.env.local`, and confirm live search cards render

## Verification Notes

- Commands:
  `pnpm repo:quality`
  `pnpm build`
  `pnpm dlx supabase start`
- Artifacts:
  Supabase files, patient search feature files, booking preview route, and updated context/tracker docs
