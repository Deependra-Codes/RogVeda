# Contributing

Rogveda uses a hard-enforced engineering OS so AI-assisted work stays fast without turning messy.

## Default Flow

For non-trivial work:

1. understand the product context and current code
2. write or update an intent record
3. add research when tradeoffs or external claims exist
4. write or update a spec
5. shape contracts, types, and validation first
6. add tests or explicit verification targets
7. implement the smallest clean slice
8. add a validation record and run repo checks

## Less Code Rule

Prefer this order:

1. delete dead code
2. simplify an existing boundary
3. strengthen a type or schema
4. reuse an existing abstraction
5. add new code only if still necessary

## Client And Server Responsibility

- Treat frontend as render and interaction orchestration, not the business brain.
- UI may hold ephemeral interaction state and presentation-only derivations.
- Authoritative business rules, validation, persistence, wallet math, status transitions, and permission decisions must live on the server side.
- If the UI mirrors a business rule for UX, the server must still own and revalidate it.

## Non-Negotiable Rules

- Do not bypass policy or quality gates for AI-generated code.
- Do not introduce undocumented non-trivial behavior.
- Do not add dependencies without updating the dependency justification map.
- Do not create god files, broad dumping-ground folders, or mixed-responsibility files.
- Do not move product logic into scripts or Markdown.
- Do not hardcode frontend product data when backend truth is required.
- Do not make performance claims without stating what was measured vs inferred.

## Repo Commands

- `pnpm repo:doctor`
- `pnpm repo:bootstrap`
- `pnpm repo:policy`
- `pnpm repo:sync`
- `pnpm repo:quality`
- `pnpm repo:check`

## Artifact Contract

Non-trivial changes should update:

- `docs/context/current-state.md`
- `docs/process/records/intents/<slug>.md`
- `docs/process/records/specs/<slug>.md`
- `docs/process/records/validations/<slug>.md`

And must also update:

- `docs/process/records/research/<slug>.md`

when the change touches auth, Supabase schema or security, external APIs, deployment, PWA behavior, performance, or architecture boundaries.
