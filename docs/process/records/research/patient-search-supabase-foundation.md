# Research: Patient Search Supabase Foundation

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

What is the smallest clean architecture that gives Rogveda a real database-backed patient search slice while preserving server authority, low client JavaScript, and future booking extensibility?

## Candidate Options

1. local Supabase project with server-only reads, nested relational query, and tiny client interaction controllers
2. fake frontend data with API wiring deferred to a later slice
3. custom REST layer or multiple client-side fetches for hospitals, doctors, and pricing

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| local Supabase + server reads | real schema, real seed data, clean path to booking transactions | requires env setup and local Docker | local verification blocked if Docker daemon is unavailable | medium | choose |
| fake frontend data | fastest visual progress | violates the brief and weakens backend-first discipline | major product and evaluation risk | low | reject |
| custom REST or multi-fetch client approach | explicit APIs early | more code and more moving parts for the same slice | pushes data authority and latency concerns into the wrong layer | high | reject |

## Sources

- Primary:
  `pnpm view supabase version` -> `2.93.0`
  `pnpm view @supabase/supabase-js version` -> `2.104.0`
  `docker --version` -> `29.4.0`
  `docker info` -> Docker client available, server pipe unavailable on 2026-04-22
- Secondary:
  `AGENTS.md`
  `docs/process/standards/next-supabase-boundaries.md`
  PRD data and workflow requirements in `docs/product/trial-brief.md`

## Recommendation

Use a local Supabase project structure with migration and seed files, a canonical database type file, and a server-only Supabase client. Let the feature public entrypoint stay server-rendered and call a same-feature server module. Keep the client side limited to currency toggles and doctor/room selection derived from server-provided pricing options.

## Direct Evidence Vs Inference

- Direct:
  package versions were fetched from the registry on 2026-04-22, and Docker CLI is installed locally
- Direct:
  `docker info` and `pnpm dlx supabase start` both showed the Docker Desktop Linux engine pipe was unavailable on 2026-04-22
- Inferred:
  public feature entrypoints must be allowed to compose same-feature server logic, otherwise server-rendered feature pages become awkward or impossible
- Inferred:
  a booking preview route is better than a broken `Book Now` link while the transaction slice is still pending

## Engineering Impact

- UI / UX impact:
  patient search becomes a warm, trust-first shortlist with live-search-ready states
- API or schema impact:
  introduces the first real schema and environment contract for Supabase access
- Testing impact:
  adds mapping tests and more meaningful build verification
- Runtime / deployment impact:
  app can build without env values by rendering an explicit unconfigured state instead of crashing

## Unknowns / Follow-Ups

- live local Supabase verification still needs Docker Desktop to be running
- service-role and anon keys still need to be copied into `.env.local`
- booking confirmation writes, wallet math, and vendor dashboard are still the next major slices
