# Intent: UI Experience Bible

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

Rogveda now has a verified patient-to-vendor workflow and stronger runtime guardrails, but it still lacks one canonical visual system document that turns the product into a premium, research-backed healthcare experience without leaving design decisions scattered across code, chat history, or individual taste.

## Why Now

The next meaningful product shift is in the UI domain. Before route-level redesign work starts, the repo needs a single design source of truth that another AI or contributor can implement quickly without rediscovering brand direction, typography, route hierarchy, motion rules, or healthcare-trust constraints.

## Goals

- create one canonical UI system document at `docs/product/ui-bible.md`
- back that document with durable `intent`, `research`, `spec`, and `validation` records
- define a premium "medical concierge" visual direction that stays warm, trustworthy, and operationally clear
- make every current route design-ready with explicit desktop and mobile layout decisions
- include future patient-auth surfaces as design-ready, security-later references only
- give another AI enough instruction to implement the UI fast without inventing its own style system

## Non-Goals

- implementing the visual redesign in code during this slice
- changing runtime logic, route contracts, or Supabase behavior
- adding route-level patient auth in the current product build
- changing the patient search, booking, wallet, or vendor workflow semantics

## Constraints

- Product:
  public search must remain guest-friendly and patient-first
- Technical:
  the document must be practical for the current `Next.js + Tailwind + Supabase` stack and current feature boundaries
- Time / team:
  another AI should be able to act on the document quickly without deep repo rediscovery

## User Impact

- patients should eventually get a calmer, more premium, more legible experience that feels credible during a high-stakes healthcare decision
- vendors should eventually get a cleaner operational surface that is easier to scan and act on
- contributors should stop wasting cycles on visual drift and generic UI output

## System Impact

- affected docs:
  `docs/product/ui-bible.md`, `docs/context/current-state.md`, `docs/product/build-tracker.md`, `docs/README.md`, and `docs/process/records/README.md`
- affected future implementation areas:
  `app/globals.css`, route-safe feature public entrypoints, and feature-local UI modules for patient search, booking, and vendor surfaces

## Success Metrics

- `docs/product/ui-bible.md` exists and is decision-complete
- the record set exists under the `ui-experience-bible` slug
- fast-start docs point contributors at the UI bible as the canonical design reference
- the document covers typography, color, spacing, imagery, motion, component contracts, copy, accessibility, current routes, and future patient-auth surfaces
- the AI appendix is short enough to hand off quickly and specific enough to prevent generic SaaS output

## Risks Of Inaction

- future UI work will drift into inconsistent, generic, or overbuilt design choices
- different AIs or contributors will repeatedly re-litigate fonts, hierarchy, spacing, and route composition
- premium healthcare trust signals will remain implied instead of explicitly designed
- future patient-auth work may start without a design direction and create more rework later

## Acceptance Shape

- one master UI bible becomes the visual truth source for the product
- the design system stays compatible with the existing product flow and repo boundaries
- future patient-auth surfaces are clearly marked as design-only so they are not mistaken for implementation approval
