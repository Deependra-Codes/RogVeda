# Research: Repo-Wide Performance Hardening

Status: active
Date: 2026-04-22
Owner: workspace

## Context

This change touches performance, Supabase runtime boundaries, repo automation, and architecture-visible feature refactors, so it needs a written tradeoff record.

## Key Findings

### 1. Truthful RPC preflight should be non-mutating

Options considered:

- skip the happy path when booking RPCs are missing
- issue a dedicated non-mutating parity check before Playwright
- let the browser test fail late inside the booking flow

Recommendation:
Use a repo-tooling preflight that calls each RPC with all-zero UUIDs and expects the function-specific validation error, which proves the function is in the schema cache without changing persisted data.

Why:

- catches `PGRST202` before the browser flow starts
- keeps the check non-mutating because no rows match the sentinel IDs
- gives a clearer failure reason than a later booking redirect

### 2. Supabase access needs explicit read and write contracts

Options considered:

- keep one universal server client with fallback behavior
- split read and write env resolution plus client construction

Recommendation:
Split the runtime contract.

- reads may use service role, publishable, or anon fallback
- writes and authoritative workflows require service role

Why:

- the old single helper hid whether a path depended on privileged credentials
- explicit write access prevents mutation code from silently running on weaker keys

### 3. Route budgets should come from Next client-reference manifests

Options considered:

- estimate client cost from file size heuristics in source
- parse Next build output and gzip the actual route entry chunks

Recommendation:
Read the route client-reference manifests after `next build`, measure the referenced entry chunks, gzip them, and compare against the canonical budgets in `tools/repo/repo-os.config.mjs`.

Why:

- enforces the shipped asset shape, not a guess
- stays dependency-light by using Node `vm` and `zlib`
- works cleanly inside the existing repo-tooling pattern

### 4. Search caching should be decoupled from booking and vendor mutations

Options considered:

- keep `/` dynamic and revalidate it after every mutation
- cache patient search reads with a dedicated tag and stop invalidating unrelated routes

Recommendation:
Cache patient search reads under `patient-search-results` and remove blanket `revalidatePath` calls from booking and vendor actions.

Why:

- hospital shortlist data does not depend on wallet or task mutations
- blanket invalidation added cost without improving correctness
- this keeps the home route cheaper while preserving live booking and vendor behavior

### 5. Large feature pages should split into feature-local presentation modules

Options considered:

- keep the large page files with inline helper components
- extract reusable sections into `features/<feature>/ui`

Recommendation:
Extract state panels, detail blocks, headers, summary blocks, and booking cards into feature-local UI modules.

Why:

- reduces file size without inventing new cross-feature abstractions
- keeps route-safe public entrypoints focused on state branching
- matches the repo file-responsibility rules

## Recommendation

Implement the hardening slice in this order:

1. runtime split and truthful repo checks
2. search caching and stale invalidation removal
3. large-file refactors and stale client-file deletion
4. Lighthouse activation and final verification
