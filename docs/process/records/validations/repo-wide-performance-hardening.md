# Validation Record: Repo-Wide Performance Hardening

Status: complete
Date: 2026-04-22
Owner: workspace

## Scope

Harden runtime truthfulness, Supabase privilege boundaries, route-budget enforcement, and large feature-file structure without changing the patient-to-vendor workflow.

## Intent / Spec References

- Intent: `docs/process/records/intents/repo-wide-performance-hardening.md`
- Spec: `docs/process/records/specs/repo-wide-performance-hardening.md`

## Checks Run

- `pnpm exec tsc --noEmit`
- `pnpm exec vitest run tests/lib/env.test.ts tests/repo/runtime-checks.test.ts tests/patient-search/search-model.test.ts tests/vendor/vendor-dashboard-model.test.ts tests/vendor/vendor-contracts.test.ts tests/vendor/vendor-session-token.test.ts`
- `pnpm repo:quality`
- `pnpm build`
- `pnpm repo:check`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- `pnpm dlx supabase migration up --local --yes`

## Environment

- OS: Windows
- Toolchain: Node, pnpm, git
- Runtime target: local Supabase remains the canonical verification target for this slice

## Results Summary

- explicit read and write Supabase runtime helpers are in place and compile cleanly
- local Supabase is now the enforced canonical runtime for this slice; `repo:check` fails before browser tests if either required RPC is missing from the active schema cache
- the missing local RPC migration and an ambiguous `complete_booking_task` return column were fixed via local migration replay plus `supabase/migrations/20260422231500_complete_booking_task_return_ambiguity_fix.sql`
- patient search now uses tagged caching, a smaller client boundary, and no longer depends on blanket mutation invalidation
- booking and vendor public pages are split into feature-local UI modules and stale client files are removed
- repo tooling now includes RPC schema-cache preflight, route-entry JS budget enforcement, and active Lighthouse runs for `/` and `/vendor/login`
- measured route entry gzip sizes are now `/` = `18,827 B`, `/booking` = `16,823 B`, `/vendor/dashboard` = `16,823 B`, `/vendor/login` = `16,823 B`
- measured Lighthouse scores are `/` = performance `0.49`, accessibility `0.96`, best-practices `0.96`; `/vendor/login` = performance `0.53`, accessibility `0.95`, best-practices `0.96`

## Pass / Fail Against Expectations

- met for enforced runtime truth, JS budgets, build quality, and patient-to-vendor browser coverage; Lighthouse performance is now recorded as a warning baseline rather than a failing gate for this pass

## What Was Verified

- Happy path:
  explicit read and write env helpers compile successfully
- Happy path:
  unit tests pass for env helpers, repo runtime checks, search mapping, and vendor contracts or models or session handling
- Happy path:
  `pnpm repo:quality` passes after the runtime split, route-budget tooling, and UI refactors
- Happy path:
  `pnpm build` succeeds with `/` and `/vendor/login` static while booking and vendor dashboard remain request-scoped
- Happy path:
  `pnpm repo:check` now passes with no booking-flow skip, active RPC parity preflight, enforced route-entry budgets, passing Playwright smoke coverage, and active Lighthouse collection
- Happy path:
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts` passes for both the booking-to-task workflow and invalid vendor login
- Happy path:
  route-entry budget enforcement passes for `/`, `/booking`, and `/vendor/dashboard`
- Happy path:
  local Supabase migrations `20260422193000`, `20260422220000`, and `20260422231500` are applied and both required RPCs return the expected parity errors instead of `PGRST202`

## Residual Risks

- Lighthouse performance remains below the current warning baseline on this machine: `/` = `0.49`, `/vendor/login` = `0.53`, with large unused-JS findings still reported by Lighthouse
- manual mobile QA was not completed in this terminal-only pass and still needs a human visual check on `/`, `/booking`, `/vendor/login`, and `/vendor/dashboard`
- hosted Supabase parity and deployment hardening remain out of scope for this slice and still need a follow-on pass
