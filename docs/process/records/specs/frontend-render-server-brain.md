# Spec: Frontend Render Server Brain

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/frontend-render-server-brain.md`

## Problem Statement

The repo needs an explicit and enforceable rule that frontend code cannot own authoritative business logic, especially for booking, wallet, pricing, workflow, and permission-sensitive behavior.

## Scope

- standards updates
- AGENTS and CONTRIBUTING contract updates
- boundary documentation updates
- folder responsibility updates
- dependency boundary enforcement updates

## Non-Goals

- eliminating all frontend logic
- banning local interaction state
- forcing every UI derivation onto the server

## Behavioral Requirements

1. Frontend and render layers may contain rendering, ephemeral interaction state, optimistic display state, and presentation derivations only.
2. Frontend and render layers must not own pricing authority, booking eligibility, wallet math, booking status transitions, vendor task state transitions, auth decisions, persistence logic, or permission-sensitive filtering.
3. If the UI mirrors a business rule for UX, the server must still own and revalidate it.
4. Standards and readmes must describe this rule explicitly.
5. Boundary enforcement should make it harder for client-facing code to import server-brain modules directly.

## Acceptance Examples

1. A selected room or doctor dropdown state may live in the UI, but final price validity must be checked on the server.
2. A booking confirm button may show a pending state in the UI, but wallet updates and booking creation must be server-owned.
3. A vendor dashboard may locally expand and collapse rows, but task completion rules and status updates must be server-owned.

## Invariants

- Must always hold:
  important business decisions remain authoritative on the server side
- Must always hold:
  the UI may mirror but not own critical workflow rules
- Must not regress:
  boundary docs should not imply that frontend must be completely logic-free

## Contract And Data Model Changes

- API changes:
  none
- Database changes:
  none
- Type or validation changes:
  boundary contract is strengthened in docs and dependency rules
- Illegal states to remove:
  client-owned pricing, wallet, and workflow rules

## Test Strategy

- Unit:
  none beyond existing repo policy tests
- Integration:
  repo quality should continue passing with updated boundary rules
- Regression:
  dependency-cruiser config should still allow current empty app skeleton
- Manual verification:
  inspect standards and boundary docs for clarity and consistency

## Verification Notes

- Commands:
  `pnpm repo:check`
- Artifacts:
  standards updates, readme updates, and dependency boundary rules
