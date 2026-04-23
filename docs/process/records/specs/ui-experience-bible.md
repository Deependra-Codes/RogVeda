# Spec: UI Experience Bible

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/ui-experience-bible.md`

## Problem Statement

Rogveda needs one canonical, implementation-ready UI reference so future route redesign work can move fast without visual drift, generic output, or confusion about future patient-auth scope.

## Scope

- add `docs/product/ui-bible.md` as the canonical product design reference
- add matching `intent`, `research`, `spec`, and `validation` records under the `ui-experience-bible` slug
- update `docs/context/current-state.md`, `docs/product/build-tracker.md`, `docs/README.md`, and `docs/process/records/README.md` so the new document is discoverable
- define design rules for current routes and future patient-auth surfaces

## Non-Goals

- visual implementation in route code
- runtime or API changes
- auth hardening work
- deployment or hosted Supabase work

## Behavioral Requirements

1. `docs/product/ui-bible.md` must exist and be marked as the canonical visual and interaction reference.
2. The UI bible must define the product's brand and UX thesis, including premium meaning, trust posture, emotional targets, and anti-goals.
3. The UI bible must translate the requested research sources into explicit Rogveda design rules.
4. The UI bible must specify the exact typography system using `Newsreader` and `Manrope`, including role sizes, usage rules, minimum text sizes, large-text behavior, and truncation rules.
5. The UI bible must specify the exact color and material system using the required token values and role mapping.
6. The UI bible must define the layout system, spacing scale, imagery rules, and motion rules with concrete implementation guidance.
7. The UI bible must include full route blueprints for `/`, `/booking`, `/booking/confirmation/[bookingId]`, `/vendor/login`, and `/vendor/dashboard`.
8. The UI bible must include a future patient-auth chapter for patient login, patient dashboard, and patient booking detail or timeline, clearly labeled as `design-ready, security-later`.
9. The UI bible must include component and state contracts, copy and tone guidance, and accessibility and quality requirements.
10. The UI bible must include a short AI implementation appendix with a one-shot brief, route-specific mini-prompts, and hard bans against generic output.
11. `docs/context/current-state.md` and `docs/product/build-tracker.md` must point contributors to the UI bible as the new canonical design reference.
12. The record set and doc indexes must reflect the new durable documentation.

## Acceptance Examples

1. A contributor can open `docs/product/ui-bible.md` and know exactly which fonts, sizes, colors, layouts, and route compositions to ship.
2. Another AI can implement the next UI pass without inventing a new visual direction or accidentally introducing purple SaaS styling.
3. The future patient-auth chapter is explicit enough to guide later work, but explicit enough about scope that nobody mistakes it for current implementation approval.
4. Fast-start docs mention the UI bible so a new contributor finds it without repo archaeology.

## Invariants

- Must always hold:
  - product workflow truth stays in `docs/product/trial-brief.md`
  - runtime and risk truth stay in `docs/context/current-state.md`
  - route-level patient auth remains future work in this slice
- Must not regress:
  - no auth wall on public search
  - no documentation that implies patient-auth implementation is approved right now
  - no runtime behavior changes hidden inside the documentation pass

## Contract And Data Model Changes

- API changes:
  none
- Data model changes:
  none
- Documentation contract changes:
  one new canonical product design doc plus a full supporting record set

## Test Strategy

- Unit:
  none
- Integration:
  `pnpm repo:policy`
  `pnpm repo:sync`
- Regression:
  manual review against the requested section list and route coverage
- Manual verification:
  verify that all future patient-auth surfaces are clearly marked design-only and that the AI appendix is concise but actionable

## Verification Notes

- Commands:
  `pnpm repo:policy`
  `pnpm repo:sync`
- Artifacts:
  `docs/product/ui-bible.md`, updated handoff docs, and the `ui-experience-bible` record set
