# Less Code Performance Policy

Status: active
Date: 2026-04-22

## Decision Order

For non-trivial work, prefer this order:

1. delete dead code
2. simplify an existing boundary
3. strengthen a type, schema, or contract
4. reuse an existing abstraction
5. add new code only if still necessary

## Performance Defaults

- server components by default
- client components only for actual interactivity
- no client-side fetch when server fetch is enough
- no global client state without written justification
- no unbounded caches
- no duplicate copies of the same data across layers
- no unnecessary dependencies when platform features are enough

## Enforcement

- dead-code checks
- dependency justification gate
- file and function size limits
- boundary checks
- validation records for performance-affecting work
