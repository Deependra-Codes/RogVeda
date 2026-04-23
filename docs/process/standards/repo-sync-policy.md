# Repo Sync Policy

Status: active
Date: 2026-04-22

## One-Line Policy

Every important repo surface must have one canonical source of truth, clearly derived mirrors, and a sync check that fails when they drift.

## Canonical Surfaces

- `AGENTS.md`
  canonical engineering contract
- `docs/process/standards/`
  canonical durable rules
- `docs/process/templates/`
  canonical artifact templates
- `docs/process/records/`
  canonical change records
- `tools/repo/repo-os.config.mjs`
  canonical automation policy and thresholds

## Derived Surfaces

- `CLAUDE.md`
- `.github/copilot-instructions.md`
- README indexes

## Sync Rule

If a canonical file changes, its derived mirror or index must also change before the check passes.
