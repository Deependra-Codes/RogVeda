# Research: Pre-UI Release Baseline

Status: complete
Date: 2026-04-23
Owner: workspace

## Research Question

How far can Rogveda move to a trustworthy pre-UI release baseline from inside the current workspace, and which remaining hosted-release tasks are genuinely blocked by missing platform access?

## Candidate Options

1. Stop all work until hosted Supabase and Vercel credentials are provided.
2. Complete every local release-baseline task first, wire the repo for hosted secrets, and document the externally blocked steps.
3. Mark the hosted path as done in docs without actually wiring CI, PWA assets, or deterministic tests.

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| 1 | Prevents any chance of doing unreleasable work | Leaves obvious local gaps unresolved | UI work stays blocked on issues that are fixable now | Low | Reject |
| 2 | Preserves momentum, improves repo truth, and isolates the real blockers | Still cannot produce a live deployed URL without credentials | Requires careful documentation so hosted gaps stay explicit | Medium | Recommend |
| 3 | Fastest short-term appearance of progress | Leaves repo truth weak and submission readiness mostly fictional | High chance of misleading later contributors | Low | Reject |

## Sources

- Primary:
  - Next.js file-convention docs for app metadata routes and manifest behavior: `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest`
  - Next.js guide for service workers: `https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps`
  - Local `pnpm dlx supabase link --help`, `pnpm dlx supabase db pull --help`, and `pnpm dlx supabase db push --help` output gathered during implementation
- Secondary:
  - local repo state in `.env.example`, `.github/workflows/ci.yml`, `playwright.config.mjs`, `supabase/README.md`, and the existing test suite

## Recommendation

Choose option 2. Land the truthful local baseline, add installability primitives and deterministic QA coverage, wire CI and docs around the shared hosted env contract, and explicitly record that the actual hosted push or Vercel deployment still require platform credentials that are not present in this workspace.

## Direct Evidence Vs Inference

- Direct:
  - `repo:policy` was failing on oversized UI files and missing dependency justification
  - no hosted Supabase or Vercel env names were discoverable in the current environment
  - there was no `app/manifest.ts`, no service worker, no public icons, and no deterministic empty-state coverage
  - Playwright was configured to reuse an existing local server by default
- Inferred:
  - the missing hosted project ref, database password, Vercel access, and GitHub secret access are the reason live deployment cannot be completed from this session
  - a production-only service-worker registration is the safest default for this repo because it avoids dev-cache confusion while keeping the deployed app installable

## Engineering Impact

- requires new public assets and a metadata route
- requires a small client registration component in the root layout
- requires CI env injection for hosted Supabase secrets
- requires docs to shift from “local-only verified” toward “hosted-ready when credentials exist”

## Unknowns / Follow-Ups

- existing hosted Supabase project ref
- hosted database password or linked CLI session
- Vercel project linkage or token
- human mobile QA across the current five routes
