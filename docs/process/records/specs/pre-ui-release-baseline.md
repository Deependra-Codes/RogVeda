# Spec: Pre-UI Release Baseline

Status: active
Date: 2026-04-23
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/pre-ui-release-baseline.md`

## Problem Statement

Before the deep UI slice starts, Rogveda needs a truthful local repo baseline, deterministic coverage for still-open PRD checks, installable PWA basics, and explicit hosted-release wiring that does not rely on rediscovery.

## Scope

- fix the remaining repo-policy blockers and keep the smaller feature-local boundaries
- extend automated coverage for empty states, currency formatting, negative wallet display, and booking-to-vendor smoke behavior
- add `app/manifest.ts`, public icons, `public/sw.js`, and production-only registration from the root layout
- update shared env and hosted-release docs plus GitHub Actions secret wiring
- document any hosted or deploy tasks that remain blocked by missing credentials or manual QA

## Non-Goals

- patient auth implementation
- final route-level UI bible implementation
- live deployment without access to the hosted project or Vercel account

## Behavioral Requirements

1. `repo:policy` must pass without loosening file or function limits.
2. The smoke flow must prove that booking can proceed in INR context and that the wallet display becomes negative after confirmation.
3. Deterministic non-browser tests must cover patient-search empty-state guidance, vendor empty-state guidance, and currency formatting rules.
4. The app must expose a valid web manifest, public app icons, and a narrow service worker that does not cache booking or vendor transactional routes offline.
5. The root layout must register the service worker only in production builds.
6. `.env.example`, `supabase/README.md`, and `.github/workflows/ci.yml` must all describe or consume the same four Supabase env keys.
7. If hosted deployment cannot be completed from this workspace, the reason must be documented concretely.

## Acceptance Examples

1. Running `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts` passes and includes explicit assertions for INR continuity and negative wallet output.
2. Running `pnpm exec vitest run tests/lib/currency.test.ts tests/ui/state-panels.test.ts` passes without requiring database mutation.
3. Building the app produces `/manifest.webmanifest`, includes icon metadata, and compiles the root layout with the production-only service-worker registration hook.

## Invariants

- Must always hold:
  - booking, wallet, and vendor workflow semantics remain server-owned and unchanged
  - the service worker must stay narrow and same-origin only
  - transactional routes must not be cached for offline mutation flows
- Must not regress:
  - current repo quality and policy checks
  - the existing connected patient-to-vendor smoke flow
  - the single shared Supabase env contract

## Contract And Data Model Changes

- No database schema changes
- No user-facing API changes
- Operational contract change:
  GitHub Actions and hosted deployment now expect the shared Supabase env names instead of relying on local `.env.local`

## Test Strategy

- Unit:
  `tests/lib/currency.test.ts`, `tests/ui/state-panels.test.ts`, existing search-model tests
- Integration:
  `pnpm repo:quality`, `pnpm build`
- Regression:
  `pnpm repo:check`, `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- Manual verification:
  hosted Supabase push, Vercel deployment, and mobile QA once external access is available

## Verification Notes

- A local green baseline is expected in this slice.
- Hosted Supabase push and live deployment are only verifiable if the existing hosted project access is actually available in the environment.
