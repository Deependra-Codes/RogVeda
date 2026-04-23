# Spec: Trial Build System

Status: active
Date: 2026-04-22
Owner: workspace

## Intent Reference

- Intent: `docs/process/records/intents/trial-build-system.md`

## Problem Statement

The trial requires a connected mini platform where patient browsing, booking confirmation, wallet logic, and vendor operations are backed by real persisted data.

## Scope

- patient search results for the provided procedure and hospitals
- dynamic doctor and room-based pricing
- currency toggle for display
- booking review and confirmation
- negative wallet support
- vendor login and bookings dashboard
- vendor task completion updating booking status

## Non-Goals

- advanced auth flows
- payment gateway integration
- real hospital media library
- real-time websockets if refresh solves the brief cleanly

## Behavioral Requirements

1. The patient search page must fetch hospitals, doctors, and pricing from the backend.
2. Each hospital card must default to the cheapest valid doctor + room combination.
3. Changing doctor or room must update displayed price immediately.
4. Currency toggle must update price display for `USD`, `INR`, and `NGN`.
5. Booking review must show selected hospital, doctor, room, price, and wallet balance.
6. Patient must be able to confirm booking even when wallet is zero.
7. Booking confirmation must create:
   - a booking with status `Confirmed`
   - a wallet transaction reflecting a negative debit
   - a vendor task
8. Booking success screen must show booking ID and updated wallet balance.
9. Vendor login must allow the hardcoded vendor credentials.
10. Vendor dashboard must fetch bookings from the same data source.
11. Completing a vendor task must update booking status to `In Progress`.
12. Loading, error, empty, and success states must exist in the main flows.

## Acceptance Examples

1. A patient opens the search page and sees Apollo, Max, and Fortis cards populated from the API.
2. A patient books Apollo with a zero wallet balance and receives a booking ID while wallet becomes negative.
3. The vendor logs in, sees that booking, marks `Visa Invite Letter Sent` complete, and the booking status becomes `In Progress`.

## Invariants

- Must always hold:
  booking price must match a valid hospital + doctor + room combination from persisted pricing data
- Must always hold:
  booking creation must leave a matching wallet transaction and vendor task
- Must not regress:
  patient browsing should not require auth before booking

## Contract And Data Model Changes

- API changes:
  hospitals fetch, booking create, vendor login, vendor bookings fetch, vendor task update
- Database changes:
  hospitals, doctors, pricing, patients, bookings, wallet_transactions, booking_tasks, vendors
- Type or validation changes:
  validated room types, booking payload validation, credential validation
- Illegal states to remove:
  impossible doctor-room selections and orphan booking records

## UI States

- Loading:
  search fetch, booking submit, vendor bookings fetch
- Empty:
  no hospitals found, no vendor bookings
- Error:
  hospitals fetch failure, invalid booking payload, vendor auth failure, task update failure
- Success:
  booking confirmation, task completion state

## Test Strategy

- Unit:
  currency conversion helpers, cheapest-price selection logic, validation helpers
- Integration:
  booking creation endpoint, vendor task update endpoint
- Regression:
  zero-balance booking should remain allowed
- Manual verification:
  end-to-end patient and vendor flow on mobile and desktop widths

## Verification Notes

- Commands:
  to be filled once toolchain is scaffolded
- Artifacts:
  screenshots, seeded data confirmation, deploy URL, submission note
