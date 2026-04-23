# Intent: Next App Scaffold

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The repo has a hard-enforced engineering OS but no actual product runtime yet. We need a clean Next.js scaffold that proves the app can boot inside the repo boundaries without weakening quality, structure, or performance discipline.

## Why Now

The next meaningful step is to move from process-only readiness into a real application baseline so patient and vendor feature work can begin immediately.

## Goals

- scaffold the Next.js app inside the current repo structure
- keep route shells thin and feature entrypoints explicit
- preserve repo policy, sync, quality, and check passing state
- prepare the project for the patient search slice

## Non-Goals

- live API integration
- Supabase schema creation
- final patient search implementation
- booking flow implementation

## Constraints

- Product:
  the first route should stay warm and trustworthy, not admin-like
- Technical:
  App Router, React 19, and Tailwind CSS 4 should fit the existing repo OS
- Time / team:
  minimal but solid scaffold, no speculative extra layers

## User Impact

- Primary user:
  contributors and coding agents starting actual product work
- User-visible outcome:
  the app boots with a clean shell and clear next step
- Trust or UX risk if done badly:
  route shells could start absorbing feature logic too early

## System Impact

- Affected pages or flows:
  root route and base app runtime
- Affected APIs:
  `dev`, `build`, and `start` scripts
- Affected tables or collections:
  none

## Success Metrics

- Next build succeeds
- home route renders through a feature public entrypoint
- repo checks still pass
- scaffold is ready for live search slice implementation

## Risks Of Inaction

- the repo stays process-ready but product-empty
- every next feature would start from setup friction instead of feature work

## Acceptance Shape

- Primary outcomes:
  app runtime exists and respects the repo boundaries
- Invariants that must stay true:
  no business logic in route shells and no quality gate regressions
- Verification targets:
  `pnpm repo:check`, successful Next build, and updated context
