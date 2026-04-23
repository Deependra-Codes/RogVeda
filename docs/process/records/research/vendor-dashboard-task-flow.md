# Research: Vendor Dashboard Task Flow

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

What is the smallest implementation that satisfies trial vendor requirements while preserving server authority and repo boundaries?

## Candidate Options

1. client-managed pseudo-session with in-memory state and frontend filtering
2. server-side cookie session with server-rendered dashboard and RPC task mutation
3. full auth stack with hashed credentials, DB-backed sessions, and middleware guards

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| client pseudo-session | very fast | weak persistence and trust | easy to bypass, not durable | low | reject |
| server cookie + server reads/mutations | meets brief quickly and cleanly | basic session only | limited hardening for production | medium | choose |
| full auth stack | strongest auth posture | over-scope for trial | timeline and complexity risk | high | reject |

## Sources

- Primary:
  `docs/product/trial-brief.md`
  `AGENTS.md`
  `docs/process/standards/next-supabase-boundaries.md`
  existing Supabase RPC contract in `supabase/migrations/20260422220000_booking_vendor_rpcs.sql`
- Secondary:
  existing booking confirmation and server-action patterns in the repo

## Recommendation

Use a server-side cookie session for the demo vendor account, keep vendor dashboard reads server-owned, and call the existing `complete_booking_task` RPC for authoritative status updates.

## Direct Evidence Vs Inference

- Direct:
  the trial brief explicitly allows hardcoded vendor credentials and requires status transition on task completion
- Direct:
  existing RPC already updates task state and booking status in one server-owned flow
- Inferred:
  server-rendered dashboard with cookie session is the fastest clean route to connected workflow completion without overbuilding auth

## Engineering Impact

- UI / UX impact:
  vendor sees live operational list and task action feedback
- API or schema impact:
  no new schema required; uses existing booking and task tables with existing RPC
- Testing impact:
  add vendor-focused contract/model tests and keep repo quality gates green
- Runtime / deployment impact:
  adds cookie-based session behavior on vendor routes

## Unknowns / Follow-Ups

- whether demo should remain single-vendor visibility or split by vendor in later phases
- whether refresh-only updates are sufficient or real-time becomes required in later product scope
