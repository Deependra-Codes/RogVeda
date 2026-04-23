# Engineering Quality Baseline

Status: active
Date: 2026-04-22

## Hard Gates

These should be machine-enforced where practical:

- formatting
- linting
- typechecking
- tests
- dead-code checks
- dependency boundary checks
- repo policy and sync checks

## Repo Commands

- `pnpm repo:doctor`
- `pnpm repo:bootstrap`
- `pnpm repo:policy`
- `pnpm repo:sync`
- `pnpm repo:quality`
- `pnpm repo:check`

## File Rules

- one responsibility per file
- no mixed route, domain, and infra logic in one file
- no unchecked generated blobs dropped into owned source folders
- no god files over repo thresholds unless explicitly exempted

## Acceptance Rule

AI-generated code gets no free pass. If it weakens structure, types, or performance, it should be rejected even if it technically works.
