# Research: Context Handoff File

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

Should the repo add a dedicated current-state handoff file for faster AI and contributor startup, and should that file be enforced?

## Candidate Options

1. rely on existing docs only
2. add a context file but keep it optional
3. add a canonical context file and require it for non-trivial changes

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| existing docs only | no extra maintenance | slower startup | repeated rediscovery | low | reject |
| optional context file | useful when maintained | easy to forget | drift and inconsistency | low | reject |
| enforced context file | fast startup and consistent handoff | one more artifact to maintain | mild extra discipline | medium | choose |

## Sources

- Primary:
  current repo OS design and existing docs layout
- Secondary:
  practical need for AI handoff in multi-session implementation work

## Recommendation

Add a canonical `docs/context/current-state.md` file, point `AGENTS.md` and docs reading order to it, and require it to be updated on non-trivial changes.

## Direct Evidence Vs Inference

- Direct:
  the repo currently requires reading multiple files to reconstruct current state
- Inferred:
  a short, enforced handoff file will materially reduce startup time and repeated discovery across AI sessions

## Engineering Impact

- UI / UX impact:
  none directly
- API or schema impact:
  none
- Testing impact:
  repo policy should enforce presence of a context update for non-trivial changes
- Runtime / deployment impact:
  none

## Unknowns / Follow-Ups

- as the app grows, the context file may eventually need a tighter template or size limit
