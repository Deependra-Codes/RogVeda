# Type, Test, And Spec Discipline

Status: active
Date: 2026-04-22

## Spec

The spec defines what the system must do.

For non-trivial work, the spec should define:

- scope
- behavior
- invariants
- acceptance examples
- test strategy

## Types

Types define what the system is allowed to represent.

Prefer:

- enums or unions over loose strings
- validated value objects over raw primitives when meaning matters
- parse once at boundaries, then use typed values internally

## Tests

Tests define what is proven.

Prefer:

- contract and invariant tests
- regression tests for bugs
- bounded smoke tests for critical user flows

Do not skip tests because the generated code "looks right."
