# Intent: Vendor Dashboard Task Flow

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The app has a patient search and booking write path, but vendor-facing routes are empty. Without a vendor login and dashboard, the required patient-to-vendor connected workflow remains incomplete.

## Why Now

The trial brief requires a real handoff from patient booking into vendor operations. This is the next smallest high-value slice after booking confirmation writes.

## Goals

- implement vendor login with the demo credential rule (`apollo` / `apollo123`)
- add a vendor session strategy suitable for the trial demo
- render vendor bookings from the same persisted database used by patient flow
- allow task completion that updates booking status to `In Progress`
- preserve route-shell and server-brain boundaries

## Non-Goals

- production-grade auth, password hashing, or multi-vendor RBAC
- real-time dashboard subscriptions
- advanced vendor filtering, sorting, or workflow automation

## Constraints

- Product:
  must satisfy trial brief vendor expectations with shared persistence
- Technical:
  business logic and mutations stay server-owned
- Process:
  maintain repo policy, quality, and context/records discipline

## User Impact

- Primary user:
  vendor operations user for demo account
- User-visible outcome:
  vendor can sign in, view bookings, and complete a booking task
- Trust or UX risk if done badly:
  workflow looks connected visually but data state remains disconnected

## System Impact

- Affected pages or flows:
  `/vendor/login`, `/vendor/dashboard`, booking task transition
- Affected APIs:
  server action login flow, server dashboard read, RPC task completion
- Affected tables or collections:
  `vendors`, `bookings`, `booking_tasks`, joined patient/hospital/doctor data

## Success Metrics

- vendor login works for demo credentials
- dashboard lists live bookings from persisted data
- task completion updates booking state to `In Progress`
- patient and vendor views remain on one source of truth

## Risks Of Inaction

- brief remains incomplete despite implemented booking writes
- no vendor proof for operational coherence
- reduced confidence in end-to-end flow

## Acceptance Shape

- Primary outcomes:
  connected vendor login, dashboard read path, and task completion write path
- Invariants that must stay true:
  route shells remain thin and server owns authoritative workflow updates
- Verification targets:
  focused vendor tests plus `pnpm repo:quality` and `pnpm repo:check`
