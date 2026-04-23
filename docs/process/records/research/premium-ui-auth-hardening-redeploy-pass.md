# Research: Premium UI Auth Hardening Redeploy Pass

Status: active
Date: 2026-04-23
Owner: workspace

## Research Question

What is the smallest integrated way to improve the visible route quality, harden the trial auth surface, and keep deployment truth aligned without turning this slice into a full patient-auth rewrite?

## Candidate Options

1. Patch the broken homepage and mobile bug only, then leave auth and deploy gaps for later.
2. Run one integrated pass: premium route rebuild, signed vendor sessions, hashed vendor credential verification, same-browser confirmation access, docs and CI updates, and redeploy.
3. Stop UI work and focus only on auth hardening first, leaving the visible route issues untouched.

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Verdict |
|---|---|---|---|---|
| Homepage-only patch | Fastest visual recovery | Leaves auth/docs/deploy debt behind | User still blocked by the same unfinished backlog | Reject |
| Integrated pass | Solves the visible, backend, and ops gaps together | Larger slice with more verification work | Requires disciplined file splitting and truthful docs | Recommend |
| Auth-only first | Improves security posture | Leaves the main route visibly weak | User explicitly asked for the big UI pass now | Reject |

## Sources

- Primary repo truth:
  - `docs/context/current-state.md`
  - `docs/product/trial-brief.md`
  - `docs/product/build-tracker.md`
  - `docs/product/ui-bible.md`
- Runtime and implementation context:
  - current route UI files in `features/patient-search/ui`, `features/booking/ui`, and `features/vendor/ui`
  - current session/auth files in `features/vendor/server`
  - current confirmation loader/action files in `features/booking/server`
  - current env and CI wiring in `lib/env.ts`, `.env.example`, `supabase/README.md`, `.github/workflows/ci.yml`
- Visual evidence:
  - user-provided screenshot of the broken homepage hero
  - local media review of current repo assets

## Recommendation

Use option 2, but keep the security scope targeted:

- visual direction:
  tighten the homepage around one calmer hero image, one narrower text column, and a low trust ribbon instead of a giant floating panel
- imagery strategy:
  keep media repo-local and swappable through a single config map, but replace the current homepage asset because it violates the UI bible text-safe-zone rule
- auth strategy:
  use one shared signing secret for both vendor sessions and same-browser confirmation access
- credential strategy:
  store the demo vendor password as a derived hash, fetch by username, and verify with constant-time comparison
- CI strategy:
  teach GitHub Actions about `ROGVEDA_SESSION_SECRET` alongside the hosted Supabase envs

## Direct Evidence Vs Inference

- Direct:
  - the current homepage screenshot shows the hero typography and trust panel are over-scaled and compositionally broken
  - `repo:policy` already proved the new slice needs updated records and smaller UI functions
  - current auth code was moving toward signed cookies and hashed credentials, but plaintext credential gating still existed in the login path
  - booking confirmation was historically public by raw `bookingId`
- Inferred:
  - the homepage needs both a better asset and a smaller, calmer composition; layout-only fixes would not be enough
  - a same-browser confirmation cookie is the right trial-scope compromise because it hardens the route without inventing full patient auth
  - the CI failure surface will widen unless the new signing secret becomes part of the documented env contract

## Engineering Impact

- add one new migration for vendor password hashing and hosted parity
- update env docs and CI to include the signing secret
- keep the route UI split into feature-local modules to satisfy repo policy
- reverify local, hosted, and production flows after the auth changes because session and confirmation behavior are no longer passive

## Unknowns / Follow-Ups

- final hero image quality still depends on the selected asset and crop after implementation
- GitHub Actions secrets still require external dashboard access even after workflow updates
- route-level patient auth remains later work; this pass only hardens vendor session and booking confirmation access
