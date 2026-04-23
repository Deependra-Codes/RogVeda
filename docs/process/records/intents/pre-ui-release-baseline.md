# Intent: Pre-UI Release Baseline

Status: active
Date: 2026-04-23
Owner: workspace

## Problem Statement

Rogveda still had real backlog before a deep UI pass could start cleanly: `repo:policy` was failing, PWA basics were missing, the smoke flow did not explicitly prove currency continuity or negative wallet outcomes, and the hosted release path was still mostly tribal knowledge.

## Why Now

The next planned phase is a deep route-level UI implementation. That work should not begin while core repo truth, submission checks, and deployment prerequisites are still half-done or only implied.

## Goals

- restore a truthful green local baseline before UI work continues
- add deterministic coverage for currency formatting, negative wallet display, and no-data states
- add installable PWA basics without caching transactional booking or vendor workflows offline
- make the shared env contract explicit for local, CI, and hosted Vercel or Supabase use
- document the remaining credential-bound blockers instead of pretending hosted release work is complete

## Non-Goals

- route-level patient auth hardening
- eliminating the current Lighthouse `/` warning baseline
- shipping the final premium UI pass from the UI bible
- inventing a second env contract for hosted deployment

## Constraints

- Product:
  keep the connected patient-to-vendor behavior unchanged
- Technical:
  keep the existing four Supabase runtime env keys and avoid new runtime dependencies
- Time / team:
  hosted Supabase linkage, Vercel deployment, and mobile QA may be blocked by missing platform access outside this workspace

## User Impact

- contributors get a cleaner, more truthful repo before the UI phase
- patients now have explicit automated proof that currency context survives into booking and that the wallet can go negative
- the app now has manifest, icons, and production-only service-worker registration for installability

## System Impact

- affected routes:
  `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`
- affected tooling:
  `playwright.config.mjs`, `.github/workflows/ci.yml`, `.env.example`, `supabase/README.md`
- affected platform assets:
  `app/manifest.ts`, `public/sw.js`, `public/*icon*`

## Success Metrics

- `pnpm repo:policy`, `pnpm repo:quality`, `pnpm build`, `pnpm repo:check`, and the focused Playwright smoke file pass locally
- PWA basics are present and build correctly
- CI is ready to consume hosted Supabase secrets using the existing env contract
- remaining hosted or deploy blockers are explicitly documented as external access gaps

## Risks Of Inaction

- UI work would start while repo truth is still unstable
- submission requirements would still be partly missing or unproven
- hosted deployment would remain under-documented and dependent on rediscovery
