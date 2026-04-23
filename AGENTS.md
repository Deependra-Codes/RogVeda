# AGENTS.md

## Mission

Build Rogveda as a fast, trustworthy, mobile-first medical travel app with an engineering system that stays clean under heavy AI assistance.

The default behavior in this repo is:

- understand before editing
- write less code, not more
- choose structure before convenience
- keep client JavaScript and memory use low
- keep the product flow connected end to end
- verify important behavior before calling work done

## Session Start

Start every non-trivial session in this order:

1. read `docs/context/current-state.md`
2. read `docs/product/trial-brief.md`
3. read `docs/product/build-tracker.md`
4. read the relevant intent, spec, and standards files
5. confirm the next smallest high-value slice before editing

If the current-state file and deeper docs disagree, fix the docs before proceeding with broad implementation.

## Source Of Truth

Read these before non-trivial work:

1. `docs/README.md`
2. `docs/context/current-state.md`
3. `docs/product/trial-brief.md`
4. `docs/product/build-tracker.md`
5. `docs/process/README.md`
6. the relevant files in `docs/process/records/` and `docs/process/standards/`

Canonical truth lives in:

- `docs/context/current-state.md` for the fastest current-state handoff to any contributor or AI
- `docs/product/` for product context and delivery state
- `docs/process/standards/` for durable engineering rules
- `docs/process/records/` for intent, research, spec, and validation artifacts
- `tools/repo/repo-os.config.mjs` for repo-enforced thresholds and policy settings
- code, tests, and schema for actual runtime behavior

## Default Working Loop

For non-trivial work, follow:

`Intent -> Research -> Spec -> Types/Data Model -> Tests -> Implementation -> Verification`

Use progressive discipline:

- trivial work stays lightweight
- bounded feature work can complete several steps in one run
- architecture-visible work must leave durable artifacts

## Kickoff Rule

This repo is now ready to start the actual product build.

Default build order:

1. scaffold the Next.js app
2. add base route shells and stack config
3. set up Supabase schema and seed strategy
4. implement the patient search slice first
5. implement booking transaction flow
6. implement vendor login and dashboard flow

Do not jump to polish or side features before the connected patient-to-vendor workflow exists.

## Less Code Rule

Before adding code, prefer this order:

1. delete dead code
2. simplify an existing boundary
3. strengthen a type, schema, or contract
4. reuse an existing abstraction
5. add new code only if still necessary

Do not create broad dumping-ground files or speculative abstractions.

## Performance Rule

This repo treats performance, memory use, and client overhead as first-class quality goals.

Defaults:

- server components first
- client components only for actual interactivity
- validate once at boundaries
- avoid duplicate data copies across layers
- avoid unbounded caches
- avoid unnecessary dependencies
- prefer the smallest clean path that stays fast

For scale-sensitive or user-visible paths, record what is measured vs inferred.

## Client And Server Rule

Frontend is not the business brain.

Client and render layers may contain:

- rendering and layout logic
- ephemeral UI state
- interaction state such as open, close, select, loading, pending, and optimistic display state
- display formatting and presentation-only derivations

Client and render layers must not own:

- pricing authority
- booking eligibility rules
- wallet math
- booking status transitions
- vendor task workflow rules
- auth or permission decisions
- direct persistence logic
- security-sensitive filtering

Authoritative business logic belongs in server-side feature modules, route handlers, or server actions and must be revalidated there even if the UI mirrors part of the flow.

## Product Guardrails

- Patient and vendor flows must hit the same persisted source of truth.
- Browsing must stay low-friction and trustworthy.
- Booking, wallet, and vendor task behavior must stay transactionally coherent.
- Mobile quality, loading states, empty states, and error states are required.
- No hardcoded frontend product data when backend truth is required.

## Boundary Guardrails

- `app/` owns route shells only.
- `features/` owns feature boundaries.
- `features/*/ui` owns feature presentation.
- `features/*/client` owns ephemeral interaction logic only.
- `features/*/server` owns business logic, workflow rules, and authoritative validation.
- `features/*/public` owns route-safe public entrypoints.
- `components/ui/` owns reusable primitive UI only.
- `lib/` owns shared infrastructure utilities and validation.
- `supabase/` owns schema, seed, generated types, and clients.
- `tools/repo/` owns engineering OS automation only.

Do not mix responsibilities because the agent was "already in the file."

## Verification Guardrail

Before finishing non-trivial work, record:

- what changed
- what was verified
- what remains risky, assumed, or still inferred
- update `docs/context/current-state.md` so the next contributor can start fast
- update `docs/product/build-tracker.md` when milestone status materially changes

Use the repo-native commands:

- `pnpm repo:doctor`
- `pnpm repo:bootstrap`
- `pnpm repo:policy`
- `pnpm repo:sync`
- `pnpm repo:quality`
- `pnpm repo:check`
