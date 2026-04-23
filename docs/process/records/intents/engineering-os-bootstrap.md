# Intent: Engineering OS Bootstrap

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The repo has early planning docs but does not yet have a hard-enforced coding operating system. That makes it too easy for AI or humans to skip process, create weak structure, add unnecessary code, or drift away from performance-first behavior.

## Why Now

The product app will be built under time pressure with heavy AI assistance. The repo needs enforcement before feature work grows.

## Goals

- make the engineering workflow hard to ignore
- enforce less code by default
- enforce quality, structure, and dependency discipline
- tune standards for `Next.js + TypeScript + Supabase`
- prepare repo-native commands, hooks, and CI

## Non-Goals

- scaffold the product app itself
- copy RepoBrain product code
- create final Next.js app logic during this bootstrap

## Constraints

- Product:
  must preserve the Rogveda trial's mobile-first and trustworthy product requirements
- Technical:
  should be Node-based and lightweight for this repo
- Time / team:
  should be enforceable without introducing unnecessary ceremony

## User Impact

- Primary user:
  repo contributors and coding agents
- User-visible outcome:
  faster, cleaner implementation with less structural drift
- Trust or UX risk if done badly:
  the app could still ship, but the repo would become chaotic and harder to scale

## System Impact

- Affected pages or flows:
  none directly; this changes repo process and future implementation quality
- Affected APIs:
  repo-native `pnpm repo:*` commands
- Affected tables or collections:
  none

## Success Metrics

- repo has canonical docs, mirrors, hooks, CI, and automation commands
- policy can detect undocumented non-trivial changes
- sync can detect doc and mirror drift
- quality can run lint, typecheck, tests, and boundary checks

## Risks Of Inaction

- god files
- mixed responsibilities
- careless dependency sprawl
- performance regressions hidden behind "it works"
- AI-generated churn with no durable reasoning trail

## Acceptance Shape

- Primary outcomes:
  non-trivial work becomes visibly documented, checked, and harder to merge without evidence
- Invariants that must stay true:
  `AGENTS.md` stays canonical and mirrors stay derivative
- Verification targets:
  repo commands run, hooks install, CI config exists, and automation tests pass
