# Validation Record: Patient Search Supabase Foundation

Status: active
Date: 2026-04-22
Owner: workspace

## Scope

Add the first real Supabase-backed foundation and patient search route implementation after the Next.js scaffold.

## Intent / Spec References

- Intent: `docs/process/records/intents/patient-search-supabase-foundation.md`
- Spec: `docs/process/records/specs/patient-search-supabase-foundation.md`

## Checks Run

- `pnpm exec biome check --write app features lib supabase tests tools package.json dependency-cruiser.cjs knip.json tsconfig.json .env.example`
- `pnpm exec tsc --noEmit`
- `pnpm exec vitest run tests/patient-search/search-model.test.ts --passWithNoTests`
- `pnpm build`
- `pnpm exec depcruise --config dependency-cruiser.cjs .`
- `pnpm exec knip --config knip.json`
- `pnpm repo:quality`
- `pnpm repo:check`
- `pnpm dlx supabase start`
- `docker info`
- local Supabase hospitals query via `@supabase/supabase-js`
- hosted Supabase hospitals query via `@supabase/supabase-js`

## Environment

- OS: Windows
- Toolchain: Node, pnpm, git
- Docker CLI: installed
- Docker daemon: unavailable during validation

## Results Summary

- Supabase foundation files, env template, and canonical DB types are in place
- patient search route now renders a real search experience shape with loading, empty, error, and unconfigured states
- hospital cards support doctor, room, and currency browsing interactions with server-provided pricing data
- booking preview route prevents `Book Now` from dead-ending while confirmation logic remains pending
- repo policy, sync, quality, typechecks, tests, boundaries, dead-code checks, and production build all pass
- local Supabase startup, migration, seed, and hospitals query now succeed
- the hosted Supabase project remains a later parity task; local Supabase is the canonical runtime target after the performance-hardening pass

## Pass / Fail Against Expectations

- pass with hosted-backend follow-up

## What Was Verified

- Happy path:
  `pnpm build` succeeds and statically generates `/` and `/booking`
- Happy path:
  `pnpm repo:quality` passes after adding Supabase, search feature, and booking preview files
- Happy path:
  `pnpm repo:check` passes with policy, sync, quality, and build all green
- Happy path:
  unit tests confirm lowest-price defaults and PRD currency conversion rates
- Happy path:
  local Supabase returns 3 seeded hospitals for `Total Knee Replacement`
- Error path:
  the search route can build without env values because the server query returns an explicit unconfigured state
- Error path:
  missing or invalid local env still produces an explicit unconfigured state instead of crashing the route
- Regression:
  dependency-cruiser passes after allowing public feature entrypoints to compose server modules while still blocking client/server leaks

## Residual Risks

- local Supabase remains the canonical verified runtime until hosted parity is completed
- this validation is now superseded by later booking, vendor, and performance-hardening slices
- hosted Supabase parity and deployment are still follow-up work
