# Spec: Homepage Hero Spacing Tune

Status: active
Date: 2026-04-23
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/homepage-hero-spacing-tune.md`

## Scope

- tune the homepage hero layout spacing using class changes only
- keep the same content and feature boundaries

## Behavioral Requirements

1. The hero content remains readable at common mobile widths (e.g. 360-430px).
2. The trust band remains visible and does not feel cramped against the bottom edge.
3. The hero does not clip decorative/background elements unexpectedly.
4. No changes to hospital search data, pricing selection logic, booking links, or vendor routes.

## Acceptance Checks

1. `/` renders without layout overflow artifacts on mobile and desktop.
2. The trust band is fully visible without requiring scroll to see it on common phone heights.
3. `pnpm repo:check` stays green.

## Invariants

- no API, schema, or auth changes
- no client-boundary expansion
