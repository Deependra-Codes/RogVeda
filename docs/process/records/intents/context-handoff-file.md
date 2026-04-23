# Intent: Context Handoff File

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The repo has product docs and process docs, but it still lacks one fast-start current-state file that any contributor or AI can read to understand the repo immediately. Without that, every new session has to reconstruct the same context from multiple files.

## Why Now

The repo is about to be used with multiple AI-assisted work sessions. Faster handoff and resumption will reduce drift, repeated discovery, and onboarding friction.

## Goals

- create one canonical current-state handoff file
- make it first-class in the reading order
- require it to stay updated after non-trivial work
- keep it short, practical, and resume-oriented

## Non-Goals

- replacing detailed intent, research, spec, or validation records
- turning the context file into a long changelog

## Constraints

- Product:
  must stay useful for future Rogveda feature work
- Technical:
  should be readable by humans and AIs quickly
- Time / team:
  should add clarity without excessive ceremony

## User Impact

- Primary user:
  contributors and coding agents
- User-visible outcome:
  faster startup and less repeated repo rediscovery
- Trust or UX risk if done badly:
  the context file could become stale or noisy

## System Impact

- Affected pages or flows:
  none directly; this is repo process and handoff behavior
- Affected APIs:
  repo policy expectations for non-trivial work
- Affected tables or collections:
  none

## Success Metrics

- any contributor can read one file and understand current repo state quickly
- AGENTS and docs reading order point to that file
- non-trivial changes require context updates

## Risks Of Inaction

- repeated rediscovery across AI sessions
- stale mental model of current repo state
- slower starts on every task

## Acceptance Shape

- Primary outcomes:
  `docs/context/current-state.md` exists, is discoverable, and stays updated
- Invariants that must stay true:
  the context file remains short and current-state oriented
- Verification targets:
  docs, AGENTS, and policy update; repo checks pass
