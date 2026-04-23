# Intent: Premium UI Auth Hardening Redeploy Pass

Status: active
Date: 2026-04-23
Owner: workspace

## Problem Statement

Rogveda needs one integrated pass that tightens the live UI, hardens the trial auth surface, fixes the mobile homepage breakage, restores repo truth, and prepares the repo for a fresh hosted redeploy without leaving submission gaps scattered across docs and infra.

## Why Now

- the user explicitly wants Git push, stronger UI, auth hardening, README submission answers, and redeploy handled as one pass
- the current homepage composition is not good enough and the latest in-progress hero broke the visual quality bar instead of improving it
- vendor session signing and booking-confirmation access were still trial-minimal
- GitHub Actions now needs to understand the new signing secret as well as the Supabase env set

## Goals

- rebuild the current public and vendor routes around a stronger premium visual system with swappable local media
- harden vendor sessions with signed cookies and replace plaintext vendor password storage/checking with hashed verification
- protect booking confirmation access with a same-browser signed confirmation cookie
- add a submission-ready root `README.md`
- update docs, records, CI env requirements, hosted runtime config, and deployment truth so the slice is resumable

## Non-Goals

- full patient authentication
- Supabase Auth adoption
- shareable signed patient confirmation links
- dark mode
- analytics or product-scope expansion beyond the existing patient-to-vendor workflow

## Constraints

- keep public patient search open and low-friction
- preserve the existing booking, negative-wallet, and vendor-task workflow semantics
- keep server-owned business rules on the server
- stay within repo policy limits for file and function size
- use the existing hosted Supabase and Vercel targets rather than provisioning a new stack

## User Impact

- patients should get a calmer, more premium, less cluttered comparison and booking flow
- vendors should get a cleaner operational workspace with the same real booking data
- raw booking IDs alone should no longer reveal confirmation details
- the demo vendor credentials stay `apollo / apollo123`, but the backend storage and verification become stronger

## System Impact

- affected routes:
  `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`, `/vendor/dashboard`
- affected backend boundaries:
  vendor auth/session, booking confirmation access, env handling, Supabase vendor seed/schema
- affected ops:
  GitHub Actions env contract, Vercel envs, hosted Supabase migration state, submission docs

## Success Metrics

- `pnpm repo:policy`, `pnpm repo:sync`, `pnpm repo:quality`, `pnpm build`, `pnpm repo:check`, and the focused Playwright smoke file pass again after the pass
- homepage mobile and desktop composition no longer show the current broken hero/trust-panel behavior
- vendor sessions reject tampering and expiry correctly
- booking confirmation rejects access without the matching signed confirmation cookie
- root README and handoff docs truthfully describe the deployed app and remaining risks

## Risks Of Inaction

- the live experience stays visually weak or broken at the most visible route
- the repo keeps claiming stronger UI/auth readiness than the code actually provides
- CI and hosted env expectations drift further as the signing secret becomes required in code
- the booking confirmation route remains easier to access than intended for even a trial flow
