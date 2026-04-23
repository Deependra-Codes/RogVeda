# Features

Features own their own boundaries.

Preferred shape:

- `public/`
  route-safe entrypoints
- `ui/`
  presentation
- `client/`
  ephemeral interaction state only
- `server/`
  business logic, workflow rules, validation, and server actions
- `types/`
  feature-owned contracts

Rule:

- frontend may render and orchestrate
- server side is the business brain
