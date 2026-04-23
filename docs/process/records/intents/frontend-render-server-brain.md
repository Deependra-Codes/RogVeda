# Intent: Frontend Render Server Brain

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The repo already prefers server-first patterns, but it does not yet state strongly enough that frontend code must not own authoritative business logic. Without a hard rule, AI and humans may still place pricing, booking rules, wallet math, or workflow decisions into UI files because it feels convenient.

## Why Now

The Rogveda app depends on trustworthy booking, wallet, and vendor workflow behavior. Those are exactly the kinds of rules that become risky when duplicated or owned by the client.

## Goals

- make the boundary explicit: frontend renders and orchestrates, server decides
- keep business rules authoritative on the server side
- prevent drift toward client-owned pricing, booking, wallet, and status logic
- encode this rule in docs and structural enforcement

## Non-Goals

- ban all frontend logic
- forbid local interaction state or presentation derivations
- replace normal UI state management with server roundtrips for trivial interactions

## Constraints

- Product:
  the UI still needs responsive interactions and useful intermediate states
- Technical:
  Next.js server and client boundaries should stay practical, not theatrical
- Time / team:
  enforcement should be strong but lightweight enough to use every day

## User Impact

- Primary user:
  repo contributors and coding agents
- User-visible outcome:
  more trustworthy product behavior and fewer client-server mismatches
- Trust or UX risk if done badly:
  the app may look correct while making invalid or insecure business decisions

## System Impact

- Affected pages or flows:
  all future patient and vendor app flows
- Affected APIs:
  none directly; this is a boundary and enforcement rule
- Affected tables or collections:
  none

## Success Metrics

- docs clearly distinguish allowed UI logic from forbidden business logic
- dependency rules make client-to-server-brain violations harder to introduce
- future feature work defaults to server-owned pricing, wallet, and workflow logic

## Risks Of Inaction

- client-owned pricing logic
- duplicated wallet rules
- inconsistent booking status decisions
- hidden security and validation drift

## Acceptance Shape

- Primary outcomes:
  frontend is treated as render and interaction orchestration; backend/server remains authoritative
- Invariants that must stay true:
  important business decisions are server-owned and revalidated there
- Verification targets:
  standards, readmes, and boundary enforcement rules updated and quality checks passing
