# Intent: Trial Build System

Status: active
Date: 2026-04-22
Owner: workspace

## Problem Statement

We need to deliver a mini but real booking platform for international medical travelers that proves product sense, frontend quality, backend persistence, and connected workflow thinking within a short trial window.

## Why Now

The trial explicitly evaluates whether we can turn a brief into a working full-stack system quickly, cleanly, and with AI-assisted discipline.

## Goals

- ship one connected patient-to-vendor workflow
- use a real backend and database
- make the patient flow feel warm and trustworthy
- keep scope tight enough to complete confidently within the deadline

## Non-Goals

- full patient auth platform
- real payments
- broad hospital marketplace features
- advanced admin systems

## Constraints

- Product: must satisfy the given PRD and sample data
- Technical: frontend data must come from APIs, not hardcoded state
- Time / team: fast solo-style implementation with AI support

## User Impact

- Primary user: international patient seeking treatment coordination in India
- User-visible outcome: clear search, confident booking, visible confirmation
- Trust or UX risk if done badly: the app will feel fake, unsafe, or disconnected

## System Impact

- Affected pages or flows: search, booking confirmation, booking success, vendor login, vendor dashboard
- Affected APIs: hospitals fetch, booking create, vendor login, vendor bookings fetch, task update
- Affected tables or collections: hospitals, doctors, pricing, patients, bookings, wallet_transactions, booking_tasks, vendors

## Success Metrics

- booking can be created from patient UI
- wallet goes negative correctly
- booking appears in vendor dashboard
- vendor task completion updates booking status
- mobile flow feels coherent and trustworthy

## Risks Of Inaction

- building disconnected screens instead of a system
- wasting time on polish while core persistence remains incomplete
- leaving key PRD assumptions undocumented

## Acceptance Shape

- Primary outcomes:
  patient can book with zero balance and vendor can act on that booking
- Invariants that must stay true:
  booking, wallet transaction, and vendor task reflect the same transaction
- Verification targets:
  end-to-end booking, vendor refresh path, task status update, mobile sanity check
