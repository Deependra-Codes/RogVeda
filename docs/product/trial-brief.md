# Rogveda Trial Brief

## Goal

Build a connected mini product for international patients booking treatment in India.

This is not a static UI exercise. The system must support:

- patient search and selection
- booking confirmation with BNPL-style negative wallet support
- booking persistence in a real database
- vendor visibility into the same booking
- vendor task completion updating booking state

## Product Summary

The demo should show one complete workflow:

1. Patient browses hospitals for `Total Knee Replacement in Delhi`
2. Patient changes doctor and room selections and sees live price updates
3. Patient clicks `Book Now`
4. Patient confirms booking even with `$0` wallet balance
5. Wallet goes negative after booking
6. Booking is saved with status `Confirmed`
7. Vendor logs in and sees that booking
8. Vendor completes a task such as `Visa Invite Letter Sent`
9. Booking status changes to `In Progress`

## What Must Exist

### Patient Search

- 3 hospital cards rendered from backend data
- each card shows hospital, procedure, doctor selector, room selector, price
- lowest valid price combination selected by default
- currency toggle for `USD`, `INR`, `NGN`
- mobile-first responsive UI
- `Book Now` CTA

### Booking Flow

- booking confirmation screen
- selected hospital, doctor, room, and price summary
- patient wallet shown before confirmation
- wallet starts at `$0`
- booking allowed even if wallet becomes negative
- booking record created in database
- wallet transaction recorded in database
- vendor task created in database
- confirmation screen shows booking ID and updated negative wallet balance

### Vendor Dashboard

- separate vendor login
- hardcoded credentials: `apollo` / `apollo123`
- list of bookings from the same database
- booking details view
- task completion action
- task completion updates booking status to `In Progress`

### Backend

- real database
- real API calls from frontend
- input validation and error handling
- persistent records for hospitals, doctors, pricing, patients, bookings, wallet transactions

### PWA

- installable app shell
- manifest
- service worker support via framework tooling
- responsive mobile behavior

## Key Interpretations

These decisions keep the build fast while staying aligned with the brief.

- Source price should be stored in `USD`, with `INR` and `NGN` derived using static conversion.
- `Lowest price by default` means the cheapest valid doctor + room combination for each hospital card should be preselected.
- Browsing should be guest-friendly. Minimal auth can happen only at booking time.
- The vendor demo can use one hardcoded vendor account that sees all demo bookings.
- Real-time updates are optional because the brief allows `real time or on refresh`.

## UX Direction

The UI should feel warm, reassuring, and operationally trustworthy.

### Trust Signals To Include

- verified hospital partner badge or partner copy
- international patient coordinator support
- visa and travel assistance task visibility
- transparent pricing with no hidden coordination fee
- doctor experience shown clearly
- fast response or booking confirmation SLA

### UX Guardrails

- no auth wall during search
- no long forms before intent is clear
- clear loading states for search and booking
- useful empty states and retry states
- patient-first copy, not hospital-admin copy

## Suggested Architecture

### Recommended Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Next.js route handlers or server actions

### Why This Stack

- fast to ship in 12 hours
- easy deployment on Vercel
- clean backend + database integration
- good fit for PWA support

## Proposed Data Model

### `vendors`

- `id`
- `username`
- `password_hash` or hardcoded validation strategy
- `display_name`

### `hospitals`

- `id`
- `name`
- `city`
- `procedure_name`
- `image_url`
- `trust_badge`

### `doctors`

- `id`
- `hospital_id`
- `name`
- `experience_years`

### `pricing`

- `id`
- `hospital_id`
- `doctor_id`
- `room_type`
- `amount_usd`

### `patients`

- `id`
- `full_name`
- `email` or `phone`
- `wallet_balance_usd`

### `bookings`

- `id`
- `patient_id`
- `hospital_id`
- `doctor_id`
- `room_type`
- `procedure_name`
- `price_usd`
- `status`
- `created_at`

### `wallet_transactions`

- `id`
- `patient_id`
- `booking_id`
- `amount_usd`
- `type`
- `balance_after_usd`
- `created_at`

### `booking_tasks`

- `id`
- `booking_id`
- `vendor_id`
- `title`
- `status`
- `completed_at`

## Booking Transaction Rules

On booking confirm, the backend should do all of this together:

1. validate hospital, doctor, room, and price combination
2. create or fetch patient
3. subtract booking amount from patient wallet balance
4. allow resulting balance to go negative
5. create booking with status `Confirmed`
6. create wallet transaction record
7. create vendor task such as `Visa Invite Letter Sent`

If any step fails, the transaction should not partially save.

## API Contract

### `GET /api/hospitals`

Returns hospitals, doctors, and pricing matrix for the search page.

### `POST /api/bookings`

Creates booking, wallet transaction, and vendor task.

Expected request fields:

- `patientName`
- `patientEmail` or another minimal identifier
- `hospitalId`
- `doctorId`
- `roomType`
- `currency` for display only

Expected response fields:

- `bookingId`
- `status`
- `walletBalanceUsd`
- `priceUsd`

### `POST /api/vendor/login`

Validates vendor credentials and creates a session.

### `GET /api/vendor/bookings`

Returns vendor booking list with patient, doctor, room, price, and task state.

### `PATCH /api/vendor/tasks/:taskId`

Marks task complete and updates booking status to `In Progress`.

## Screen Map

### `/`

Patient search results page

### `/booking/[hospitalId]`

Booking review and confirmation

### `/booking/confirmation/[bookingId]`

Booking success state

### `/vendor/login`

Vendor login screen

### `/vendor/dashboard`

Vendor bookings list and detail view

## Sample Data Notes

Use the PRD data exactly for:

- Apollo Spectra
- Max Saket
- Fortis Gurgaon

Fortis Gurgaon can still appear for the Delhi search because it is a nearby NCR option. That should be explained subtly in UI copy if needed.

## Definition Of Done

The build is ready only if all of the following are true:

- search page data comes from API, not frontend hardcoding
- lowest-price defaults are correct
- doctor and room changes update price immediately
- currency toggle works across search and booking flow
- booking works with `$0` wallet balance
- wallet becomes negative after booking
- booking is persisted
- wallet transaction is persisted
- vendor task is created
- vendor sees the booking
- vendor can complete a task
- booking status updates to `In Progress`
- mobile UI is clean
- loading, empty, and error states exist
- app is deployable
- PWA basics are configured

## Non-Goals

Do not overbuild these unless time remains:

- full patient authentication
- live chat
- payment gateway
- full hospital profile pages
- advanced vendor roles
- notifications
- analytics

## Risks To Watch

- pricing mismatch between frontend state and backend validation
- partial booking writes without transaction safety
- forgetting `booking_tasks`
- making search beautiful but not connected
- hardcoding frontend data, which would fail the brief
- spending too much time on visuals instead of workflow completion

## Delivery Requirements

Need to submit:

- live deployed URL
- code repository link
- vendor dashboard route
- short note on AI tool used, approach, and hardest part

## Suggested Build Order

1. scaffold app and routes
2. create schema and seed data
3. build hospitals API
4. build patient search UI
5. build booking transaction API
6. build confirmation flow
7. build vendor login and dashboard
8. build task completion update
9. add PWA setup
10. test happy path and failure states
