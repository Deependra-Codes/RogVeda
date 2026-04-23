# Spec: Next App Scaffold

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/next-app-scaffold.md`

## Problem Statement

The repo needs a working Next.js runtime baseline that respects the engineering OS and becomes the launch point for patient search implementation.

## Scope

- install Next.js, React, and Tailwind runtime packages
- add base Next config and App Router files
- add a thin home route that delegates to a feature public entrypoint
- add global styles
- keep repo checks green after the scaffold

## Non-Goals

- live hospital search
- backend integration
- wallet or booking logic
- vendor dashboard implementation

## Behavioral Requirements

1. The repo must expose `dev`, `build`, and `start` scripts.
2. The home route must render through `features/patient-search/public`.
3. The initial feature shell must remain presentation-only and must not fake backend-owned business logic.
4. Tailwind CSS 4 must be wired through PostCSS and global styles.
5. `pnpm repo:check` must pass after the scaffold.

## Acceptance Examples

1. `pnpm build` completes successfully using Next.js.
2. Visiting `/` renders the patient search scaffold shell through a feature public entrypoint.
3. The root route file stays tiny and does not absorb feature implementation logic.

## Invariants

- Must always hold:
  route shells stay thin
- Must always hold:
  the scaffold does not introduce frontend-owned business logic
- Must not regress:
  repo policy, sync, and quality checks

## Contract And Data Model Changes

- API changes:
  `dev`, `build`, and `start` package scripts
- Database changes:
  none
- Type or validation changes:
  Next.js TypeScript config and App Router baseline
- Illegal states to remove:
  product repo without a runnable app shell

## Test Strategy

- Unit:
  existing repo OS tests remain green
- Integration:
  `repo:check` should execute Next build
- Regression:
  route shell should import only from feature public entrypoints
- Manual verification:
  run the dev server and inspect the home shell if needed

## Verification Notes

- Commands:
  `pnpm repo:check`
- Artifacts:
  app files, feature shell, package updates, and current-state update
