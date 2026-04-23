# Research: Repo Readme Deployment Handoff Cleanup

Status: complete
Date: 2026-04-23
Owner: workspace

## Research Question

What is the smallest, lowest-risk way to make Rogveda's first-clone setup and Vercel deployment reproducible and self-explanatory without changing runtime behavior?

## Candidate Options

1. Do nothing and leave the current drift ("four keys" phrasing, missing quickstart/deploy runbook) as-is.
2. Docs-only: fix the env wording drift, add a clear README quickstart and deployment section.
3. Docs + small config hardening: docs-only plus a minimal Node engine floor in `package.json` matching Next.js requirements.
4. Add a `vercel.json` build config to force Next.js detection in all projects.

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Verdict |
|---|---|---|---|---|
| 1 | No work | Repeated setup confusion persists | High churn during evaluation | Reject |
| 2 | Fixes the human-facing confusion immediately | Still leaves Node-version errors to happen late | Medium | Acceptable |
| 3 | Fixes docs and fails earlier on unsupported Node versions | Small `package.json` touch that triggers policy + records | Low | Recommend |
| 4 | Could reduce the chance of a mis-detected Vercel framework | Adds config surface that may diverge from Vercel's default Next.js behavior | Medium | Defer |

## Sources

- Local runtime evidence:
  - `require("next/package.json").engines` in this workspace reports `node: \">=20.9.0\"`.
- Repo evidence:
  - `.env.example`, `supabase/README.md`, and `.github/workflows/ci.yml` are the shared env contract surfaces.
  - `docs/process/records/validations/pre-ui-release-baseline.md` records a real Vercel `framework: null` pitfall.

## Recommendation

Choose option 3: fix the README + env docs drift and add a minimal Node engine floor (`>=20.9.0`) in `package.json`. Do not add `vercel.json` in this slice; keep Vercel defaults and document the known 404/framework misconfiguration as troubleshooting instead.

## Direct Evidence Vs Inference

- Direct:
  - Next.js in this repo advertises a minimum Node floor via its `engines` field.
  - The env-doc surfaces contained inconsistent wording about how many keys are required and where they come from.
- Inferred:
  - Encoding the Node engine floor in `package.json` reduces avoidable Vercel/local setup failures without requiring additional tooling.

## Unknowns / Follow-Ups

- Whether a future, separate slice should add an explicit `vercel.json` if the "framework null" issue repeats in new projects.
