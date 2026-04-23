# Intent: Supabase RLS Access Hardening

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The trial schema currently leaves all core tables readable or mutable through the public Supabase roles, and the booking RPCs are `security definer` functions that could still be called directly unless execution is restricted.

## Why Now

The connected workflow is already working locally, so the next highest-value hardening step is to close the database exposure before hosted sync or production-style work builds on an unsafe default.

## Goals

- enable RLS on all trial tables
- allow only the minimal public reads needed for guest hospital search
- require service-role-backed access for private booking, patient, wallet, vendor, and task data
- restrict the booking RPCs so public Supabase keys cannot call them directly
- make repo verification fail if public data boundaries drift

## Non-Goals

- redesigning product auth or adding real patient accounts
- changing the patient-to-vendor workflow semantics
- replacing the current vendor demo session model

## Constraints

- Product:
  guest search must stay low-friction and the patient-to-vendor happy path must keep working
- Technical:
  all current Supabase access is server-side, but public and private boundaries still need to be truthful at the database layer
- Time / team:
  prefer a small schema-and-boundary slice over a larger auth redesign

## User Impact

- patients keep the same guest search and booking flow
- vendors keep the same login and dashboard workflow
- contributors stop shipping against an open-by-default schema

## System Impact

- affected runtime boundaries:
  `lib/env.ts`, `supabase/clients/server.ts`, booking loaders, vendor dashboard loader, repo runtime checks, and new Supabase migration
- affected data boundaries:
  `vendors`, `hospitals`, `doctors`, `pricing`, `patients`, `bookings`, `wallet_transactions`, `booking_tasks`

## Success Metrics

- public Supabase keys can read hospitals, doctors, and pricing
- public Supabase keys cannot read seeded vendor or patient rows
- public Supabase keys cannot execute booking confirmation or task-completion RPCs
- `pnpm repo:check` stays green while enforcing the new access boundaries

## Risks Of Inaction

- the anon or publishable key can remain a direct path into trial data
- RLS can appear enabled later while `security definer` RPCs still bypass the intended boundary
- hosted parity work would inherit an unsafe access model
