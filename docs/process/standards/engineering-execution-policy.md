# Engineering Execution Policy

Status: active
Date: 2026-04-22

## One-Line Policy

For non-trivial work, the repo follows:

`Intent -> Research -> Spec -> Types/Data Model -> Tests -> Implementation -> Verification`

## Change Classes

### Trivial

- typo fixes
- formatting-only changes
- copy tweaks
- comment-only updates
- safe mechanical renames

### Non-Trivial

- user-visible behavior changes
- new APIs, schemas, or workflows
- architecture or boundary changes
- dependency changes
- auth, deployment, PWA, or performance work
- anything that changes how the app or repo behaves

## Required Behavior

For non-trivial work:

1. understand the current state
2. create or update intent
3. add research when tradeoffs or external claims exist
4. create or update spec
5. shape contracts and types first
6. add tests or explicit verification targets
7. implement the smallest clean slice
8. record validation

## Anti-Patterns

- giant code drops first and explanation later
- undocumented architecture changes
- mixing docs, scripts, and runtime logic into one blurred layer
- skipping validation because the code "looks right"
