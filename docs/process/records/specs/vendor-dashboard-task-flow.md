# Spec: Vendor Dashboard Task Flow

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/vendor-dashboard-task-flow.md`

## Problem Statement

Vendor routes are currently empty, preventing completion of the required patient-to-vendor connected workflow.

## Scope

- vendor login page and server login action
- vendor cookie session read/write/clear strategy
- vendor dashboard server read path for shared booking data
- task completion action calling authoritative RPC
- dashboard and login route-level error and status messaging

## Non-Goals

- full auth platform or multi-vendor access control
- websocket real-time updates
- advanced dashboard filtering or analytics

## Behavioral Requirements

1. `/vendor/login` must render a credential form with demo account guidance.
2. Login must only allow the hardcoded trial credentials (`apollo` / `apollo123`).
3. Successful login must create a server-side vendor session cookie.
4. `/vendor/dashboard` must require session presence and redirect to login when absent.
5. Dashboard must load bookings from the same Supabase source used by patient booking flow.
6. Dashboard must show booking, patient, hospital, doctor, price, and task status details.
7. Pending task action must call `complete_booking_task` RPC with vendor and task identifiers.
8. Successful task completion must surface success feedback and reflect `In Progress` booking status on reload.
9. Login/dashboard/task failure states must display actionable error messaging.
10. Route shell files in `app/vendor/**` must remain thin and delegate to `features/vendor/public`.

## Acceptance Examples

1. Vendor signs in with `apollo` / `apollo123` and lands on dashboard.
2. Dashboard shows a booking created from patient flow and lists task as `Pending`.
3. Vendor marks task complete and booking status updates to `In Progress` after refresh.

## Invariants

- Must always hold:
  authoritative booking/task state changes remain server-owned
- Must always hold:
  vendor dashboard reads from persisted booking data, not frontend hardcoding
- Must not regress:
  app route shell boundaries and quality gates

## Contract And Data Model Changes

- API changes:
  vendor login server action, dashboard server load, task completion server action
- Database changes:
  none
- Type or validation changes:
  vendor payload schemas, route error/status contracts, dashboard mapping types
- Illegal states to remove:
  empty vendor routes with no connected data flow

## UI States

- Loading:
  server-rendered dashboard route load
- Empty:
  dashboard with no bookings
- Error:
  invalid credentials, service unavailable, task update failure
- Success:
  signed in status and task completed status banners

## Test Strategy

- Unit:
  vendor contracts parsing/messages, session token encode/decode, dashboard model mapping
- Integration:
  repo typecheck and boundary checks through quality command
- Regression:
  booking and repo policy tests stay green alongside new vendor tests
- Manual verification:
  sign in, view dashboard data, complete pending task, confirm status change on refresh

## Verification Notes

- Commands:
  `pnpm exec vitest run tests/vendor/vendor-contracts.test.ts tests/vendor/vendor-session-token.test.ts tests/vendor/vendor-dashboard-model.test.ts`
  `pnpm repo:quality`
  `pnpm repo:check`
- Artifacts:
  vendor feature server/public files, app vendor routes, updated context/tracker docs
