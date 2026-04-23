# Process OS

This directory holds the engineering operating system for the repo.

## Reading Order

1. `standards/README.md`
2. `records/README.md`
3. `templates/README.md`

## Core Rule

For non-trivial work:

`Intent -> Research -> Spec -> Types/Data Model -> Tests -> Implementation -> Verification`

## Handoff Rule

`docs/context/current-state.md` is the fast-start handoff file.

Before and after non-trivial work:

- read it first to understand current repo state quickly
- update it so the next contributor or AI can resume without re-discovering everything

This is enforced through:

- canonical docs
- AI instruction mirrors
- repo-native commands
- git hooks
- CI
