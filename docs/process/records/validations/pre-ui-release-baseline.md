# Validation Record: Pre-UI Release Baseline

Status: complete
Date: 2026-04-23
Owner: workspace

## Scope

Close the remaining local backlog before the deep UI pass by restoring repo truth, adding deterministic PRD coverage, wiring PWA basics, and preparing then completing the hosted release path around the existing Supabase env contract.

## Intent / Spec References

- Intent: `docs/process/records/intents/pre-ui-release-baseline.md`
- Spec: `docs/process/records/specs/pre-ui-release-baseline.md`

## Checks Run

- `pnpm repo:policy`
- `pnpm repo:sync`
- `pnpm repo:quality`
- `pnpm build`
- `pnpm repo:check`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- `pnpm dlx supabase db push --db-url <hosted-session-pooler-uri> --include-all --include-seed --yes`
- production sanity check:
  - `pnpm start`
  - `GET /manifest.webmanifest`
  - direct hosted Supabase public read probe for `hospitals`
  - direct public route probe for `https://project-feiuh.vercel.app/`
  - direct public route probe for `https://project-feiuh.vercel.app/vendor/login`
  - browser-level hosted patient-to-vendor probe against `https://project-feiuh.vercel.app`

## Environment

- OS: Windows
- Toolchain: Node, pnpm, git
- Runtime target: local Supabase for code verification
- Hosted access state:
  hosted Supabase project ref, pooled database URI ingredients, and Vercel project access were supplied during the release pass; GitHub Actions secret access is still missing in this workspace

## Results Summary

- repo-policy blockers are resolved without relaxing any limits; booking, patient-search, and vendor UI boundaries are now smaller and policy-compliant
- the focused smoke flow now proves INR continuity from search into booking and confirmation, plus the negative wallet outcome before vendor task completion
- deterministic tests now cover currency formatting, patient-search empty guidance, and vendor empty guidance without mutating seeded data
- PWA basics are present and verified locally:
  `app/manifest.ts` builds to `/manifest.webmanifest`, branded install icons are in `public/`, and the production-only service worker registers successfully under `pnpm start`
- `.env.example`, `supabase/README.md`, and `.github/workflows/ci.yml` now share the same hosted-ready Supabase env contract
- Playwright now starts a fresh local server by default, removing the stale-server loophole from local verification
- hosted Supabase is now at migration and seed parity with the local verified runtime
- the live Vercel production deployment is now public and returns the expected app routes, manifest, and seeded search content
- the hidden production deploy blocker turned out to be a Vercel project misconfiguration:
  `framework: null` caused `vercel build` to emit a 404-only output bundle until the project was patched to `nextjs` and redeployed
- a browser-level hosted probe confirms the live patient-to-vendor path still books successfully, shows negative wallet state, and completes the vendor task on the public deployment

## Pass / Fail Against Expectations

- met for all locally verifiable expectations in this slice
- met for hosted Supabase parity, live Vercel deployment, and live deployed URL capture
- not yet met for human mobile QA or GitHub Actions secret mirroring because those still require external access or human interaction outside this terminal session

## What Was Verified

- Happy path:
  `pnpm repo:policy`, `pnpm repo:sync`, `pnpm repo:quality`, `pnpm build`, `pnpm repo:check`, and the focused Playwright smoke file all pass locally; the public deployment also completes the patient-to-vendor path in a browser probe against hosted Supabase
- Error path:
  invalid vendor login still returns the expected failure route and copy
- Edge case:
  currency formatting and empty-state guidance are covered by deterministic unit tests; booking review and confirmation both show the negative wallet state in both local and hosted browser coverage
- Mobile / responsive:
  installability assets and route composition build successfully, but a human mobile pass is still pending

## Residual Risks

- human mobile QA is still required on the current five routes
- GitHub Actions secrets still need to be updated outside this workspace if CI must run against the hosted runtime
- route-level patient auth hardening is still a later security slice
- Lighthouse still records warning-level performance on `/`, and LHCI upload warns locally because the repo does not yet have a resolvable `git rev-parse HEAD`
