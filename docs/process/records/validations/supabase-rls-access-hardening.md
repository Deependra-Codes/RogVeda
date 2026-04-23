# Validation Record: Supabase RLS Access Hardening

Status: complete
Date: 2026-04-22
Owner: workspace

## Scope

Enable RLS across the trial schema, preserve guest hospital search, restrict private booking and vendor access to service-role-backed server paths, and verify that public Supabase keys cannot see private data or execute privileged RPCs.

## Intent / Spec References

- Intent: `docs/process/records/intents/supabase-rls-access-hardening.md`
- Spec: `docs/process/records/specs/supabase-rls-access-hardening.md`

## Checks Run

- `pnpm dlx supabase migration up --local --yes`
- `pnpm repo:quality`
- `pnpm repo:check`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- `pnpm dlx supabase db query "select c.relname as table_name, c.relrowsecurity as rls_enabled ..."`
- `pnpm dlx supabase db query "select grantee, routine_name, privilege_type from information_schema.routine_privileges ..."`
- `node --input-type=module` probe for `collectRouteEntryBudgetResults()`
- `node --input-type=module` probe for latest `.lighthouseci` report metrics
- `node --input-type=module` probe for `assertSupabasePublicAccessBoundaries()`
## Environment

- OS: Windows
- Runtime target: local Supabase

## Results Summary

- RLS is enabled on all eight trial tables.
- Public Supabase access is limited to `hospitals`, `doctors`, and `pricing`.
- Private booking, patient, wallet, vendor, and task loaders now require service-role-backed access.
- The generic read helper now prefers publishable or anon access before service role, so patient search stays on the least-privileged path when available.
- Public Supabase access can no longer read seeded private tables and can no longer execute the two privileged RPCs after the PostgREST schema reload migration.
- `pnpm repo:check` now verifies public/private Supabase access boundaries after Playwright, in addition to the existing RPC parity and route budget checks.
- Route entry budgets remain within limits: `/` = `18,827 B`, `/booking` = `16,823 B`, `/vendor/dashboard` = `16,823 B` gzip.
- Latest Lighthouse results from `repo:check`: `/` = performance `0.54`, accessibility `0.96`, best-practices `0.96`; `/vendor/login` = performance `0.62`, accessibility `0.95`, best-practices `0.96`.

## Pass / Fail Against Expectations

- met for schema hardening, private/public boundary enforcement, repo-native verification, and patient-to-vendor regression coverage

## What Was Verified

- Happy path:
  `pnpm repo:check` passes end to end after enabling RLS, restricting RPC execution, and reloading the PostgREST schema cache
- Happy path:
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts` passes for both booking-to-task completion and invalid vendor login
- Happy path:
  patient search still works under public-read access while booking review, booking confirmation, vendor login, and vendor dashboard keep working through service-role-backed server paths
- Error path:
  direct public Supabase access to seeded private tables is blocked, and direct public execution of `create_booking_transaction` or `complete_booking_task` is denied
- Edge case:
  private-table exposure checks account for empty tables by counting rows through the service role first and only failing when public access can see rows that actually exist
- Mobile / responsive:
  not rerun in this terminal-only pass

## Residual Risks

- the booking confirmation route is still public by booking ID and remains app-layer trust rather than real patient auth
- vendor auth and session handling are still trial-minimal and not production hardening
- manual mobile QA is still pending on `/`, `/booking`, `/vendor/login`, and `/vendor/dashboard`
- Lighthouse performance remains warning-level on `/`
