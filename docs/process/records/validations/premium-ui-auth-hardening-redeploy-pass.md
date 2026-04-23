# Validation Record: Premium UI Auth Hardening Redeploy Pass

Status: completed
Date: 2026-04-23
Owner: workspace

## Scope

Rebuild the route UI, harden the targeted auth surface, update the env contract, and prepare the repo for a fresh hosted redeploy and submission-ready handoff.

## Intent / Spec References

- Intent: `docs/process/records/intents/premium-ui-auth-hardening-redeploy-pass.md`
- Spec: `docs/process/records/specs/premium-ui-auth-hardening-redeploy-pass.md`

## Checks Run

- `gh secret list --repo Deependra-Codes/RogVeda`
- `gh run view 24822828821 --repo Deependra-Codes/RogVeda --json status,conclusion`
- `pnpm repo:quality`
- `pnpm build`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts`
- `pnpm repo:check`
- `pnpm dlx supabase db push --db-url <hosted-session-pooler-uri> --include-all --include-seed --yes`
- `pnpm dlx vercel deploy --prod --yes --token <redacted>`
- browser-level production probe on `https://project-feiuh.vercel.app`

## Findings

- the user’s homepage complaints were valid: the first hero iteration was too long, the image crowded the text-safe zone, and mobile readability regressed
- the route UI pass now matches the intended `Teal Brass` direction more closely, with a shorter hero headline, stronger left-side contrast, repo-local visual assets, and calmer operational vendor surfaces
- the targeted auth hardening is fully landed through signed expiring vendor-session cookies, scrypt-backed vendor password verification, and same-browser signed confirmation access for booking confirmation routes
- GitHub Actions secrets are now mirrored for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ROGVEDA_SESSION_SECRET`
- two separate verification traps were found and fixed:
  stale `next start --port 3200` processes could make the local browser path test an older build than the one just compiled
  stale `.next` artifacts after local Supabase resets could preserve old hospital or doctor IDs inside the static homepage, causing otherwise-correct booking links to fail later with `invalid_selection`
- the service worker is now safe for this repo shape: localhost no longer registers or keeps Rogveda caches, and production no longer caches Next.js scripts or styles
- hosted Supabase now includes the vendor-password migration and current seed hash, and the latest production deploy completes the full patient-to-vendor flow successfully

## Verification Outcome

- local repo gates are green again
- the latest GitHub Actions CI run on `main` is green after adding Playwright Chromium installation to the workflow
- focused Playwright smoke path passes
- responsive mobile smoke checks pass
- hosted Supabase push succeeded
- Vercel production redeploy succeeded and was aliased back to `https://project-feiuh.vercel.app`
- live production browser probe succeeded for search -> booking -> confirmation -> vendor task completion

## Residual Risks

- human mobile QA is still a manual step even after automated viewport checks are added
- route-level patient auth remains later work beyond the same-browser confirmation hardening in this slice
- Lighthouse performance on `/` still sits below the warning threshold target on this machine even though the enforced checks remain passing
