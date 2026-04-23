# Code Quality Constitution

Status: active
Date: 2026-04-22

## Principles

1. Canonical truth must be explicit.
2. Small clear boundaries beat clever abstractions.
3. Less code is usually the better default.
4. Performance, memory, and client overhead matter.
5. Quality gates should be automated where possible.
6. Docs, contracts, and code should not silently drift.

## Simplicity Rules

- no business logic in Markdown or shell snippets
- no broad `helpers` or `utils` dumping grounds
- no dependency added "just because the model used it"
- no duplicate contracts across layers when one source of truth can exist
