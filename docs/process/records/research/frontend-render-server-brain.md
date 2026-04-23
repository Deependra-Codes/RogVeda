# Research: Frontend Render Server Brain

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

Should this repo hard-enforce the rule that frontend is render and orchestration only while backend or server-side code owns business logic?

## Candidate Options

1. allow mixed frontend and business logic
2. prefer server ownership but leave it mostly to review
3. hard-enforce server ownership for business logic while allowing presentation and interaction state on the client

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| mixed ownership | fastest to prototype | logic spreads easily | high drift, duplicated rules, security mistakes | low | reject |
| review-only preference | flexible | weak enforcement | still easy for AI to leak business logic into UI | medium | reject |
| hard-enforced server ownership | consistent, safer, easier to reason about | needs clearer boundaries and tooling | some added discipline | medium | choose |

## Sources

- Primary:
  `RepoBrainOs/docs/standards/ENGINEERING_EXECUTION_POLICY.md`
  `RepoBrainOs/docs/standards/AGENT_GUARDRAIL_SYSTEM.md`
  `RepoBrainOs/docs/standards/CODE_QUALITY_CONSTITUTION.md`
- Secondary:
  current Rogveda engineering OS docs and the product requirement that pricing, booking, wallet, and vendor workflow remain coherent across frontend and backend

## Recommendation

Adopt a hard rule:

- frontend may render, format, and manage ephemeral interaction state
- authoritative business logic must live on the server side
- if a business rule is mirrored in the UI for UX, it must still be revalidated server-side

## Direct Evidence Vs Inference

- Direct:
  RepoBrainOs emphasizes explicit boundaries, less code, and durable architectural discipline.
- Inferred:
  For a booking product with money-like wallet behavior and state transitions, client-owned business rules would create avoidable correctness and trust risks.

## Engineering Impact

- UI / UX impact:
  UI stays responsive but cannot be the source of truth for pricing or workflow decisions
- API or schema impact:
  none directly, but APIs remain the authoritative control surface
- Testing impact:
  future business-rule tests should target server modules first
- Runtime / deployment impact:
  lower risk of client-server logic divergence and unnecessary client bundles

## Unknowns / Follow-Ups

- once the product app exists, add more explicit server/client import conventions inside each feature
