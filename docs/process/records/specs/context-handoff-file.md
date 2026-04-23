# Spec: Context Handoff File

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/context-handoff-file.md`

## Problem Statement

The repo needs one short, canonical file that captures current repo state and is kept fresh after non-trivial work.

## Scope

- add `docs/context/current-state.md`
- add `docs/context/README.md`
- update AGENTS and docs reading order
- require the context file to be updated for non-trivial changes
- update repo records and contributor surfaces

## Non-Goals

- replacing deep product or process docs
- storing exhaustive implementation detail in the context file

## Behavioral Requirements

1. `docs/context/current-state.md` must exist and be readable as the first fast-start file.
2. `AGENTS.md` must point contributors to the context file before non-trivial work.
3. `docs/README.md` must include the context directory and file in the reading order.
4. Non-trivial changes must include an update to `docs/context/current-state.md`.
5. The context file must summarize current repo state, what exists, what is missing, and the next best step.

## Acceptance Examples

1. A new AI session opens the repo and reads `docs/context/current-state.md` first to understand current status quickly.
2. A non-trivial change to `features/` without a context-file update causes policy to fail.
3. After a meaningful repo change, the context file reflects the new current phase and next step.

## Invariants

- Must always hold:
  the context file stays short and current-state focused
- Must always hold:
  the context file is part of the default reading order
- Must not regress:
  context updates must not be optional for non-trivial work

## Contract And Data Model Changes

- API changes:
  none
- Database changes:
  none
- Type or validation changes:
  repo policy gains a context-update requirement
- Illegal states to remove:
  stale or missing current-state handoff for non-trivial changes

## Test Strategy

- Unit:
  helper test for context update detection
- Integration:
  repo policy should fail when non-trivial changes omit the context file
- Regression:
  context-only updates should not break policy
- Manual verification:
  read the context file and confirm it accurately describes repo state

## Verification Notes

- Commands:
  `pnpm repo:check`
- Artifacts:
  context file, docs updates, policy updates, and tests
