# Next And Supabase Boundaries

Status: active
Date: 2026-04-22

## Route And Feature Ownership

- `app/`
  route shells, metadata, and route-level composition
- `features/`
  feature-owned UI, client interaction logic, public entrypoints, server actions, and domain logic
- `components/ui/`
  reusable presentation primitives only
- `lib/`
  shared infrastructure such as env, formatting, validation, and low-level utilities
- `supabase/`
  migrations, seed data, generated types, and clients

## Core Principle

Frontend renders and orchestrates. Server-side code decides.

That means:

- UI may own interaction state and presentation derivations
- server-side feature modules, route handlers, and server actions own authoritative business rules
- critical behavior must not depend on client honesty

## What Is Allowed In Client And Render Layers

- rendering and composition
- local UI state
- transient interaction state
- optimistic display state
- formatting and display-only derivations

## What Must Stay Server-Side

- pricing authority
- wallet math
- booking eligibility and confirmation rules
- booking status transitions
- vendor task workflow rules
- auth and permission decisions
- persistence logic
- security-sensitive filtering
- source-of-truth validation

## Boundary Rules

- do not place core business logic in `app/**/page.tsx`
- do not treat client components as the source of truth for business decisions
- keep Supabase access in server-side boundaries unless a public-read exception is documented
- validate all external inputs with Zod
- keep workflow states explicit
- do not leak raw database shapes through the UI without an intentional boundary
- if a client flow mirrors a server rule for UX, the server must still revalidate it
