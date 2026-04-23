# Spec: Premium UI Auth Hardening Redeploy Pass

Status: active
Date: 2026-04-23
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/premium-ui-auth-hardening-redeploy-pass.md`

## Problem Statement

Rogveda needs a single, truthful pass that raises the visible route quality, closes the targeted auth gaps, updates the env contract, and leaves the hosted deployment ready to refresh.

## Scope

- push the verified baseline to GitHub before the riskier refactor continues
- rebuild current route UI around the stronger teal/brass system and swappable local media
- harden vendor sessions with signed, expiring cookies
- require hashed vendor credential verification instead of plaintext storage/checking
- protect booking confirmation with a same-browser signed confirmation cookie
- add a submission-ready root `README.md`
- update current-state, build tracker, record set, env docs, CI env contract, hosted envs, and redeploy truthfully

## Non-Goals

- full patient auth
- shareable patient confirmation links
- Supabase Auth migration
- new business features outside the current brief

## Behavioral Requirements

1. The homepage hero must use repo-local configurable imagery and must not rely on hardcoded remote image URLs.
2. The homepage first viewport must fit within the UI bible constraints: one dominant visual, one narrow text column, and no oversized floating trust card dominating the composition.
3. Mobile homepage layout must avoid the current dark/black readability failure and must be readable at common widths such as `360`, `390`, `400`, and `430`.
4. Hospital comparison rows must continue to expose the same workflow and data, while using the updated local media map and refined surface styling.
5. Booking review and booking confirmation routes must keep the same workflow semantics while reflecting the updated visual system.
6. Vendor login and vendor dashboard must keep the same workflow semantics while reflecting a calmer operational visual hierarchy.
7. `ROGVEDA_SESSION_SECRET` must be part of the app env contract.
8. Vendor session tokens must be signed, expiring, and rejected when tampered with or expired.
9. Vendor authentication must fetch by demo username and verify the submitted password against a stored hash using Node crypto and constant-time comparison.
10. The external demo login stays `apollo / apollo123`.
11. Booking confirmation access must require a valid signed confirmation cookie that matches the booking ID.
12. If confirmation access is missing, expired, or invalid, the route must render a clear unauthorized or expired state instead of revealing booking details.
13. `.env.example`, `supabase/README.md`, and `.github/workflows/ci.yml` must include the signing-secret requirement.
14. A root `README.md` must exist and include product summary, setup, envs, live URL, vendor route, demo credentials, and explicit submission answers.
15. `docs/context/current-state.md` and `docs/product/build-tracker.md` must describe the finished state truthfully after verification.

## Acceptance Examples

1. A user can browse the homepage on desktop or mobile and see a balanced, image-led first viewport rather than the current oversized type plus large frosted panel.
2. A vendor session cookie copied and altered by one character is rejected.
3. Opening `/booking/confirmation/<id>` in a fresh browser without the matching signed cookie yields the expired/unauthorized state.
4. GitHub Actions configuration clearly fails fast when `ROGVEDA_SESSION_SECRET` is missing.
5. Another evaluator can open the root `README.md` and immediately find the deployed URL, vendor route, credentials, and submission note.

## Invariants

- public patient search stays guest-accessible
- authoritative pricing and booking rules remain server-owned
- the patient-to-vendor workflow semantics do not change
- route-level patient auth remains later work

## Contract And Data Model Changes

- API changes:
  none
- Data model changes:
  vendor credential storage moves to `password_hash`
- Env contract changes:
  add `ROGVEDA_SESSION_SECRET`

## Test Strategy

- Unit:
  signed-token tests, vendor password-hash tests, booking confirmation access tests, env tests
- Integration:
  `pnpm repo:policy`
  `pnpm repo:sync`
  `pnpm repo:quality`
  `pnpm build`
  `pnpm repo:check`
- Regression:
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
  focused mobile viewport checks for `/` and `/vendor/login`
- Manual verification:
  human mobile QA on `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`, `/vendor/dashboard`
  production probe after redeploy

## Verification Notes

- Commands:
  `pnpm repo:policy`
  `pnpm repo:sync`
  `pnpm repo:quality`
  `pnpm build`
  `pnpm repo:check`
  `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- Artifacts:
  updated route UI files, auth/session helpers, migration, root `README.md`, env docs, and the current record set
