# Research: Engineering OS Bootstrap

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

How should RepoBrain-style engineering discipline be adapted into a lightweight but hard-enforced operating system for a `Next.js + TypeScript + Supabase` app repo?

## Candidate Options

1. docs-only process
2. docs + AI instruction mirrors
3. docs + mirrors + repo-native policy, sync, quality, hooks, and CI

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| docs-only | fastest to write | easy to ignore | low enforcement | low | reject |
| docs + mirrors | better AI behavior | still weak on humans and CI | drift risk | medium | reject |
| full repo OS | enforceable, durable, scalable | more setup effort | some early friction | medium | choose |

## Sources

- Primary:
  `RepoBrainOs/AGENTS.md`
  `RepoBrainOs/docs/standards/ENGINEERING_EXECUTION_POLICY.md`
  `RepoBrainOs/docs/standards/AGENT_GUARDRAIL_SYSTEM.md`
  `RepoBrainOs/docs/standards/ENGINEERING_QUALITY_BASELINE.md`
  `RepoBrainOs/docs/standards/PERFORMANCE_AND_COMPLEXITY_DISCIPLINE.md`
  `RepoBrainOs/docs/standards/DOCS_INTENT_RESEARCH_PATTERN.md`
  `RepoBrainOs/docs/standards/REPO_SYNC_POLICY.md`
- Secondary:
  local Rogveda trial brief and current workspace state

## Recommendation

Adopt the RepoBrain process model, not its product code. Rewrite the standards for a Next.js app, keep one canonical contract in `AGENTS.md`, and enforce the process through repo-native Node tooling, hooks, CI, and strict folder and dependency rules.

## Direct Evidence Vs Inference

- Direct:
  RepoBrainOs uses docs, mirrors, hooks, repo-native commands, and validation records to prevent process drift.
- Inferred:
  A stricter but lighter Node-based variant will fit this app repo better than porting RepoBrain's Rust-first automation.

## Engineering Impact

- UI / UX impact:
  preserves mobile-first and warm product rules as first-class quality expectations
- API or schema impact:
  requires intent/spec/research/validation artifacts for architecture-visible changes
- Testing impact:
  adds repo automation tests and future app-facing quality gates
- Runtime / deployment impact:
  adds CI and local hook enforcement, but keeps runtime app logic untouched for now

## Unknowns / Follow-Ups

- Next.js, Supabase, and Playwright app tooling will be fully activated once the product app is scaffolded.
