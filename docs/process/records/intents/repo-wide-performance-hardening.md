# Intent: Repo-Wide Performance Hardening

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The connected patient-to-vendor flow exists, but the repo still has trust gaps around runtime parity, route-budget enforcement, oversized feature files, and stale client layers.

## Why Now

The app is at the point where performance and verification guardrails need to become real release constraints before hosted sync, deployment, or PWA work can be trusted.

## Goals

- make `pnpm repo:check` truthful for the local Supabase runtime
- split Supabase access into explicit read and write contracts
- reduce request and hydration overhead without changing the product workflow
- shrink large feature files by moving presentation-only sections into feature-local UI modules
- enforce route-level JS budgets and Lighthouse checks for public routes

## Non-Goals

- hosted Supabase parity or deployment completion
- production auth hardening
- changing patient, wallet, booking, or vendor workflow semantics

## Constraints

- local Supabase remains the canonical runtime for this pass
- read paths may use publishable or anon fallback; authoritative writes must require service role access
- search data should be cached independently from booking and vendor mutations
- new dependencies are out of scope unless platform features cannot support the check

## User Impact

- contributors get truthful repo checks instead of silent skips
- patients and vendors keep the same product flow with lower structural risk
- future optimization and hosted-parity work starts from cleaner boundaries

## System Impact

- affected pages or flows:
  `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`, `/vendor/dashboard`
- affected repo commands:
  `pnpm repo:check`
- affected runtime boundaries:
  `lib/env.ts`, `supabase/clients/server.ts`, server feature loaders and actions, and repo tooling

## Success Metrics

- booking smoke flow no longer skips when RPCs are missing
- route JS budgets are enforced from build artifacts
- Lighthouse runs during `repo:check` for `/` and `/vendor/login`
- local Supabase remains the canonical verified runtime in docs and checks

## Risks Of Inaction

- green checks can still hide missing booking RPCs
- route budgets stay aspirational instead of enforced
- stale client layers and oversized files keep compounding
- hosted work would build on a runtime contract that is still too loose
