# Spec: Engineering OS Bootstrap

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/engineering-os-bootstrap.md`

## Problem Statement

The repo needs a hard-enforced coding OS that keeps architecture, quality, performance, and documentation discipline aligned during fast implementation work.

## Scope

- canonical doc layout
- standards set
- mirrors for AI tools
- repo-native command surface
- hook and CI setup
- policy and sync automation
- basic automation tests

## Non-Goals

- scaffolding the product app
- activating production app runtime checks before the app exists

## Behavioral Requirements

1. `AGENTS.md` must be the canonical engineering contract.
2. The repo must expose `pnpm repo:doctor`, `repo:bootstrap`, `repo:policy`, `repo:sync`, `repo:quality`, and `repo:check`.
3. `repo:policy` must detect non-trivial protected changes and require intent, spec, and validation artifacts.
4. `repo:policy` must require research artifacts for auth, Supabase, external API, deployment, PWA, performance, or architecture-boundary changes.
5. `repo:policy` must fail on undocumented dependencies, forbidden folder names, and file or function size violations.
6. `repo:sync` must fail when indexes or AI instruction mirrors drift from canonical docs.
7. `repo:quality` must run formatting, linting, typechecking, tests, dead-code checks, and boundary checks.
8. `repo:check` must run policy, sync, quality, and conditionally run build and smoke checks when app tooling exists.

## Acceptance Examples

1. A change to `features/` without updated intent, spec, and validation records causes `pnpm repo:policy` to fail.
2. A new dependency added to `package.json` without a justification entry causes `pnpm repo:policy` to fail.
3. A standard file added without its index being updated causes `pnpm repo:sync` to fail.

## Invariants

- Must always hold:
  `AGENTS.md` is the canonical instruction surface
- Must always hold:
  process records use slug-based names without dated prefixes
- Must not regress:
  quality and structure rules cannot be left as docs-only suggestions

## Contract And Data Model Changes

- API changes:
  repo-native `pnpm repo:*` command surface
- Database changes:
  none
- Type or validation changes:
  repo policy config becomes the canonical policy contract
- Illegal states to remove:
  undocumented non-trivial changes, god files, and careless dependency drift

## UI States

- Loading:
  not applicable
- Empty:
  not applicable
- Error:
  repo commands should fail with actionable error messages
- Success:
  repo commands should print clear pass status and next steps

## Test Strategy

- Unit:
  policy helpers for path classification, dependency checks, and file-size checks
- Integration:
  repo command scripts running against the real workspace
- Regression:
  research-trigger detection and sync drift detection
- Manual verification:
  run bootstrap, doctor, policy, sync, quality, and check locally

## Verification Notes

- Commands:
  to be filled after toolchain install
- Artifacts:
  repo command scripts, CI workflow, hook, and validation record
