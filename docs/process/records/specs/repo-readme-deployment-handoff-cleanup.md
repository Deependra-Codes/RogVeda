# Spec: Repo Readme Deployment Handoff Cleanup

Status: active
Date: 2026-04-23
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/repo-readme-deployment-handoff-cleanup.md`

## Problem Statement

The repo needs a clearer first-clone handoff and fewer deployment footguns: the root `README.md` should give a single quickstart + deploy runbook, and env docs should match the real key contract and fallback behavior.

## Scope

- update `README.md` to include:
  - canonical reading order pointers
  - a local quickstart that starts from `pnpm repo:bootstrap`
  - env contract notes (publishable vs anon key, service role, signing secret)
  - a repo tour and a minimal deployment runbook
- update `.env.example` comments to remove "four keys" drift and point to `pnpm dlx supabase status`
- update `supabase/README.md` local steps to reference `supabase status` output and clarify publishable vs anon
- add `package.json` `engines.node` matching Next.js' advertised minimum Node requirement

## Non-Goals

- runtime behavior changes
- schema or RLS changes
- new dependencies

## Acceptance Checks

1. A new contributor can open `README.md` and find:
   - what the app is and what the demo proves
   - the local quickstart path
   - the deploy path (Supabase push + Vercel envs + deploy)
2. `.env.example` no longer claims "four keys" and points to `supabase status` for local values.
3. `supabase/README.md` local workflow includes URL + key instructions that match Supabase CLI output and the repo's env fallback logic.
4. `package.json` includes `engines.node` and stays compatible with the current dependency set.

## Invariants

- no change to the patient-to-vendor workflow
- no change to server-side auth, booking confirmation access, or vendor session logic
- no change to public access boundaries or Supabase RPC behavior
