# Validation Record: Vendor Form Post Redirect Hardening

Status: completed
Date: 2026-04-23
Owner: workspace

## Scope

Stabilized vendor login/logout/task forms by moving browser form POSTs through route handlers, preserving redirect origin, and setting vendor cookies on the actual redirect response.

## Checks Run

- `pnpm repo:quality`
- `pnpm build`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts --workers=1`
- `pnpm repo:check`
- `pnpm dlx vercel deploy --prod --yes --archive tgz`
- live browser probe on `https://project-feiuh.vercel.app`

## Verification Outcome

- focused patient-to-vendor smoke passes again
- full repo gate passes
- Vercel production deploy completed and aliased back to `https://project-feiuh.vercel.app`
- live production probe completed search -> booking -> confirmation -> vendor task completion
- vendor login reaches dashboard with the signed session cookie present
- vendor task completion redirects to `status=task_completed` and updates the booking state

## Residual Risks

- the latest deploy was created from this workspace and still needs a commit/push if the repository should mirror production
