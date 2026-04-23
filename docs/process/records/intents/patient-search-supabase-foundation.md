# Intent: Patient Search Supabase Foundation

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

The app shell exists, but the patient search flow still has no real data model, no persisted source of truth, and no safe server-owned path for hospital search results.

## Why Now

The first meaningful product slice after scaffold is to prove that the root search experience can be backed by a real database shape without leaking business authority into the frontend.

## Goals

- add Supabase project structure, migration, and seed data for the trial brief
- add environment and server-client boundaries for backend reads
- render the patient search route from server-owned hospital data, not hardcoded frontend data
- keep client code limited to browsing interactions such as currency and selection state
- avoid a broken `Book Now` path by adding a lightweight booking review preview route

## Non-Goals

- booking confirmation transaction logic
- vendor login or dashboard implementation
- deployment or PWA completion
- real-time sync between patient and vendor flows

## Constraints

- Product:
  the experience should feel warm and trustworthy, not like an admin panel
- Technical:
  frontend cannot become the business brain and public entrypoints must stay route-safe
- Performance:
  patient search should stay server-first with low client overhead
- Environment:
  local Supabase verification depends on Docker Desktop being available

## User Impact

- Primary user:
  international patient browsing treatment options
- User-visible outcome:
  the home route becomes a real search experience shape instead of a scaffold placeholder
- Trust or UX risk if done badly:
  the flow could look polished but still rely on fake frontend state or broken links

## System Impact

- Affected pages or flows:
  root patient search route and booking preview route
- Affected APIs:
  server-owned Supabase read access for hospitals, doctors, and pricing
- Affected tables or collections:
  vendors, hospitals, doctors, pricing, patients, bookings, wallet_transactions, booking_tasks

## Success Metrics

- root route builds and renders a live-search-ready UI
- patient search data shape is backed by Supabase schema and seed files
- missing env state does not crash the app
- repo quality and build checks stay green
- the next slice can focus on booking transaction logic instead of refactoring foundations

## Risks Of Inaction

- the repo remains visually improved but still backend-empty
- booking and vendor flows would be built on shaky or duplicated data assumptions

## Acceptance Shape

- Primary outcomes:
  Supabase foundation and patient search UI are wired into the app
- Invariants that must stay true:
  no hardcoded frontend product data, no client-owned business logic, and thin route shells
- Verification targets:
  `pnpm repo:quality`, `pnpm build`, and local Supabase startup if the Docker daemon is available
