# Folder Structure And File Responsibility

Status: active
Date: 2026-04-22

## Canonical Structure

- `app/`
- `features/`
- `components/ui/`
- `lib/`
- `supabase/`
- `tests/`
- `tools/repo/`

## Feature Shape

Within a feature, prefer this split:

- `features/<feature>/public/`
  route-safe public entrypoints
- `features/<feature>/ui/`
  feature presentation
- `features/<feature>/client/`
  ephemeral interaction logic only
- `features/<feature>/server/`
  business logic, workflow rules, server actions, and authoritative validation
- `features/<feature>/types/`
  feature-owned types and contracts

## Hard Rules

- no business logic in route shell files
- no feature logic in `components/ui/`
- no authoritative business logic in `features/*/ui` or `features/*/client`
- no cyclic feature dependencies
- no generic dumping-ground folders such as `helpers`, `misc`, or `temp`
- no file over repo limits unless exempted
- no function over repo limits without an inline justification comment

## File Size Targets

- general owned source file: `<= 300` lines
- React component file: `<= 220` lines
- function body: `<= 60` lines
