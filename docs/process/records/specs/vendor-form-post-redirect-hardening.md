# Spec: Vendor Form Post Redirect Hardening

Status: active
Date: 2026-04-23
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/vendor-form-post-redirect-hardening.md`

## Requirements

1. Vendor forms submit to route handlers with normal POST semantics.
2. Login sets the signed vendor-session cookie on the redirect response.
3. Redirects preserve the submitting page origin so cookies are not lost between `127.0.0.1` and `localhost`.
4. Secure cookies remain enabled for HTTPS production traffic and disabled for localhost HTTP smoke tests.
5. Task completion remains server-owned and still updates the persisted booking/task state through the existing RPC.

## Acceptance Checks

- `pnpm repo:quality`
- `pnpm build`
- `pnpm exec playwright test tests/e2e/patient-to-vendor.smoke.spec.ts --workers=1`
