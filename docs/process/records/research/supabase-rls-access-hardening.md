# Research: Supabase RLS Access Hardening

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

What is the smallest clean way to enable Supabase RLS for the trial schema without breaking guest search, booking confirmation, or the vendor dashboard flow?

## Candidate Options

1. Enable RLS and add broad public policies across all trial tables.
2. Enable RLS only on public-search tables and leave private tables open for now.
3. Enable RLS on all tables, keep only explicit public-search policies, move private server reads to service-role-backed loaders, and restrict RPC execution to `service_role`.

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| broad public policies | quickest path to “passing” RLS | keeps most data exposed | private data still queryable through public keys | low | reject |
| partial RLS | least app churn | leaves high-risk tables open | false sense of security and advisory remains valid | low | reject |
| full RLS + narrow public policies + service-role private reads | closes direct exposure while preserving guest search | requires loader updates and a verification pass | trial routes still rely on app-layer trust, not full auth | medium | choose |

## Sources

- Primary:
  current local schema, runtime loaders, repo verification tooling, and Supabase advisory output from the local database
- Secondary:
  none

## Recommendation

Enable RLS on every trial table, expose only `hospitals`, `doctors`, and `pricing` to public roles, revoke public execution on the two `security definer` RPCs, and move private read loaders to the service-role client. Add a repo-native public-access probe so the boundary stays truthful over time.

## Direct Evidence Vs Inference

- Direct:
  the local database advisory reports RLS disabled on all eight trial tables
  both booking RPCs are defined as `security definer`
  patient search is the only route that genuinely needs guest-readable table access
  booking review, confirmation, vendor login, and vendor dashboard touch private patient, vendor, booking, wallet, or task data
- Inferred:
  least-privilege reads are cleaner if the generic read helper prefers publishable or anon keys when available
  app-layer route auth remains a separate concern from database-layer exposure

## Engineering Impact

- add a new migration for RLS, public policies, grants, and RPC execute restrictions
- switch booking review, booking confirmation, and vendor dashboard loaders to the write client
- keep patient search on the read client and make the read helper prefer public keys when they exist
- extend repo runtime checks to verify public tables stay visible and private tables or RPCs stay hidden from public keys

## Unknowns / Follow-Ups

- the booking confirmation route is still public by booking ID and may need signed-route or session hardening later
- vendor session state is still trial-minimal and not a replacement for real Supabase auth
- a later hosted pass should verify the same RLS behavior outside the local stack
