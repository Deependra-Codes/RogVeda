# Intent: Homepage Hero Spacing Tune

Status: active
Date: 2026-04-23
Owner: workspace

## Problem Statement

The homepage hero still needs a small spacing pass so the first viewport reads cleanly and the trust band sits with the intended breathing room without clipping or crowding the hero content.

## Why Now

This is a fast, low-risk UI tune that improves mobile and desktop readability without touching any patient-search, booking, or vendor workflow semantics.

## Goals

- adjust hero vertical spacing so the content column and trust band feel balanced
- keep the same content, imagery system, and interaction boundaries

## Non-Goals

- change any business logic, pricing, booking, wallet, or auth behavior
- add new UI components or restructure feature boundaries

## Constraints

- keep the change limited to Tailwind class adjustments
- preserve server-first rendering and existing client boundaries

## User Impact

- cleaner first-impression layout on mobile and desktop
- lower risk of perceived "crowded" or "broken" hero composition

## System Impact

- affected files:
  `features/patient-search/ui/search-hero.tsx`
  `features/patient-search/public/patient-search-page.tsx`

