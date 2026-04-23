# Rogveda Master UI Bible

Status: active
Date: 2026-04-22
Owner: workspace

## Purpose

This is the canonical visual and interaction source of truth for Rogveda.

Use this document when designing or refactoring:

- `/`
- `/booking`
- `/booking/confirmation/[bookingId]`
- `/vendor/login`
- `/vendor/dashboard`
- future patient-auth surfaces

If documents disagree:

- `docs/product/trial-brief.md` controls workflow and product requirements
- `docs/context/current-state.md` controls runtime truth, risk, and current gaps
- this file controls visual direction, layout, typography, motion, and copy style

Patient-auth chapters in this document are `design-ready, security-later`. They are not approval to implement route-level patient auth in the current slice.

## Working Model

- Visual thesis:
  Rogveda should feel like a premium medical concierge service: clinically trustworthy, calm, editorial, warm, and polished enough to feel high-value without drifting into spa, luxury hotel, or generic SaaS.
- Content plan:
  poster-like public trust first, then concrete treatment comparison, then booking reassurance, then calm vendor operations
- Interaction thesis:
  use one strong photography-led hero on `/`, restrained state transitions for selectors and confirmations, and calm operational motion on vendor surfaces

## Implementation Target Map

| Route | Current file targets | Visual job |
|---|---|---|
| `/` | `features/patient-search/public/patient-search-page.tsx`, `features/patient-search/ui/*`, `features/patient-search/client/*`, `app/globals.css` | Premium patient discovery and comparison |
| `/booking` | `features/booking/public/booking-review-page.tsx`, `features/booking/ui/*`, `app/globals.css` | Booking review checkpoint with wallet clarity |
| `/booking/confirmation/[bookingId]` | `features/booking/public/booking-confirmation-page.tsx`, `features/booking/ui/*`, `app/globals.css` | Confirmation, reassurance, and next-step handoff |
| `/vendor/login` | `features/vendor/public/vendor-login-page.tsx`, `features/vendor/ui/*`, `app/globals.css` | Calm operational access point |
| `/vendor/dashboard` | `features/vendor/public/vendor-dashboard-page.tsx`, `features/vendor/ui/*`, `app/globals.css` | Clean booking operations workspace |
| Future patient auth | future route files only after security work | Design-ready reference only |

Implementation guardrails:

- keep route shells in `app/`
- keep visual implementation in `features/*/public`, `features/*/ui`, and `app/globals.css`
- do not move business rules into client components
- do not add an auth wall to public patient search
- do not implement patient-auth routes in this slice

## Brand And UX Thesis

### Product Mood

Rogveda should feel:

- calm
- premium
- credible
- human
- guided
- warm without being soft or vague

### Trust Posture

Trust comes from visible clarity, not decorative medical styling.

The interface must constantly answer:

1. What am I looking at?
2. Why should I trust it?
3. What happens next?
4. What changes if I take this action?

### User Emotion Targets

Patients should feel:

- less overwhelmed
- more informed
- more guided
- respected, not processed
- safe enough to continue

Vendors should feel:

- immediately oriented
- in control
- clear on the next action
- unburdened by visual noise

### What Premium Means Here

Premium in Rogveda means:

- fewer surfaces, better hierarchy
- stronger photography, less chrome
- excellent spacing and typography
- transparent price and workflow language
- material quality that feels crafted, not flashy
- operational confidence without admin coldness

### Anti-Goals

Do not let Rogveda become:

- a hospital admin portal
- a dashboard-card mosaic
- a fintech-style KPI wall
- a purple-on-white SaaS template
- a wellness brand with vague luxury language
- a glossy travel site that hides clinical seriousness
- a fake medical dashboard with ornamental charts

## Research Backbone

These sources are inputs for real design rules, not bibliography filler.

| Source | Direct takeaway | Rogveda rule |
|---|---|---|
| [Apple Typography HIG](https://developer.apple.com/design/human-interface-guidelines/typography) | Typography should improve legibility, hierarchy, and comprehension; too many typefaces weaken readability and consistency. | Use only two typefaces, keep hierarchy obvious, and never let styling compete with understanding. |
| [Apple Accessibility HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility) | Larger text, sufficient contrast, and reduced-motion support are first-order quality concerns. | Support large text reflow, meet contrast targets, and make motion optional. |
| [Consumers' Evaluation of Web-Based Health Information Quality](https://pmc.ncbi.nlm.nih.gov/articles/PMC9100526/) | Consumers evaluate health information quality through a mix of source, content, design, and individual factors. | UI must surface source credibility and make content easier to evaluate, not just easier to skim. |
| [Trust between patients and health websites](https://pmc.ncbi.nlm.nih.gov/articles/PMC3266366/) | Trust in health websites is multi-factor and tied to how information and systems are presented. | Rogveda must keep states, provenance, and next steps explicit on every route. |
| [The Role of Aesthetics in Intentions to Use Digital Health Interventions](https://pmc.ncbi.nlm.nih.gov/articles/PMC10286978/) | Simplicity and craftsmanship most strongly improve perceived usefulness, ease of use, enjoyment, and trust. | Prefer simple, crafted surfaces over decorative density or feature-heavy layouts. |

### Derived Design Rules

1. Navigability first.
2. Ease of understanding second.
3. Aesthetics act as a trust amplifier, not a substitute for clarity.
4. Simplicity and craftsmanship beat ornament and novelty.
5. Readable hierarchy beats dense copy.
6. Every healthcare claim needs visible credibility cues near it.
7. Public routes should feel warm and editorial; vendor routes should feel calm and operational.
8. Motion should clarify hierarchy and feedback, never perform for its own sake.

## Typography System

### Typeface Stack

- Display/editorial:
  `Newsreader`
- Interface/body:
  `Manrope`

Implementation preference:

- load both via `next/font/google`
- use variable font weights where practical
- keep the serif family out of operational UI chrome

Fallback stacks:

- `Newsreader`, `Iowan Old Style`, `Georgia`, serif
- `Manrope`, `Segoe UI`, `SF Pro Text`, `Helvetica Neue`, system-ui, sans-serif

### Type Roles

| Role | Desktop | Mobile | Family / weight | Usage |
|---|---|---|---|---|
| `display-xl` | `64/68` | `42/46` | `Newsreader 600` | Homepage hero headline only |
| `display-l` | `48/52` | `34/38` | `Newsreader 600` | Section openers, future patient dashboard welcome line |
| `heading-xl` | `36/42` | `28/34` | `Manrope 700` | Route `h1` for booking and vendor surfaces |
| `heading-l` | `28/34` | `24/30` | `Manrope 650` | Section titles and major panels |
| `body-l` | `18/30` | `17/28` | `Manrope 500` | Introductory copy and reassurance text |
| `body-m` | `16/26` | `16/26` | `Manrope 500` | Default body copy and control text |
| `body-s` | `14/22` | `14/22` | `Manrope 500` | Helper text, metadata, secondary notes |
| `label` | `12/16` | `12/16` | `Manrope 700`, `0.18em` tracking | Eyebrows, field labels, small status labels |

### Usage Rules

Serif is allowed in:

- the homepage hero headline
- major editorial route openers on public patient-facing routes
- occasional emphasis line on confirmation or future patient dashboard surfaces

Serif is banned in:

- vendor login and vendor dashboard forms
- selectors, filters, chips, tags, and buttons
- booking IDs, prices, counts, dates, and status labels
- inputs, helper text, and dense operational detail

Minimum text sizes:

- default body text starts at `16px`
- `14px` is the lowest allowed support text
- `12px` is reserved for `label` only
- do not ship any paragraph-sized text below `14px`

Large-text behavior:

- support at least `200%` enlargement without clipping or overlapping controls
- homepage hero text must wrap instead of shrinking below its role floor
- comparison rows, forms, and confirmation layouts must stack vertically under larger text

Truncation rules:

- never truncate prices, CTAs, or clinical status labels
- hospital and doctor names may clamp to `2` lines in list views
- booking IDs may middle-truncate only when the full value remains available through selection or assistive technology
- no ellipsis on first-mention clinical or travel-critical labels

Numeric rules:

- prices, wallet balances, counts, and IDs stay in `Manrope`
- use stronger weight for numbers than surrounding helper copy
- prefer tabular figures when the implementation stack makes them available

Readable line length:

- body copy target:
  `45-75` characters
- maximum support copy line:
  `90` characters

## Color And Material System

### Canonical Palette

| Token | Value | Primary use | Do not use for |
|---|---|---|---|
| `--bg` | `#F6F1E8` | page background | CTA fills |
| `--paper` | `#FFFDF8` | elevated paper and content sheets | generic outlines |
| `--ink` | `#1E1B16` | primary text and strong icons | disabled states |
| `--accent` | `#0F766E` | primary CTA, trust emphasis, focus state | destructive messaging |
| `--accent-soft` | `#DCEEEA` | accent-tinted backgrounds and trust badges | body text fills |
| `--warm` | `#B45309` | contextual warmth, supportive warnings, hospitality cues | destructive alerts or primary CTA |
| `--border` | `rgba(112,88,53,0.14)` | dividers and quiet outlines | strong call-to-action contrast |
| `--success` | `#2F6F57` | success states and completion chips | default CTA color |
| `--danger` | `#A85632` | error states and destructive emphasis | warm reassurance copy |

### Material Rules

- Use `--bg` as the warm ambient page field across patient-facing routes.
- Place most content on `--paper` surfaces, not white.
- Use `--accent` as the only saturated primary action color.
- Use `--warm` as a support note or hospitality accent, not as a competing CTA color.
- Use `--danger` sparingly and only when there is a real error or destructive action.
- Use `--border` for quiet structure instead of heavy boxes.

### Surface And Elevation Rules

- Homepage hero may blend image + scrim + paper text plane.
- Public panels use soft elevation:
  `0 24px 70px rgba(40,24,5,0.08)`
- Operational vendor surfaces use lighter elevation:
  `0 12px 34px rgba(40,24,5,0.05)`
- Border thickness:
  `1px`
- Never stack multiple strong shadows in the same viewport.

### Radius System

- hero media or major section:
  `32px`
- content panel:
  `24px`
- control or input:
  `20px`
- button, chip, pill:
  `999px`

### Focus And Interactive Color

- focus ring:
  `2px` `--accent` with a `2px` `--paper` halo
- selected row background:
  `--accent-soft`
- selected row border:
  darker accent tint, not pure black

### Light/Dark Scope

Light mode is the canonical target for this slice. Do not add dark mode until the light experience is excellent, legible, and measured.

## Layout System

### Grid

| Breakpoint | Width | Columns | Outer gutter | Column gap | Notes |
|---|---|---|---|---|---|
| Mobile | `360-639` | `4` | `16px` | `12px` | One dominant column with careful stacking |
| Tablet | `640-1023` | `8` | `24px` | `16px` | Two-zone layouts become available |
| Desktop | `1024-1439` | `12` | `32px` | `24px` | Primary public and vendor compositions |
| Wide | `1440+` | `12` | fluid | `24px` | Content stays capped at `1280px` |

Hard limits:

- max content width:
  `1280px`
- inner reading column:
  `640px`

### Spacing Scale

Use only this scale:

- `4`
- `8`
- `12`
- `16`
- `24`
- `32`
- `48`
- `64`
- `96`

Section rhythm:

- mobile major section gap:
  `32-48`
- tablet major section gap:
  `48-64`
- desktop major section gap:
  `64-96`

### Composition Rules

- Every section gets one job, one dominant visual idea, and one primary takeaway.
- `/` must feel like a poster in the first viewport.
- Vendor surfaces must not feel like marketing pages.
- Avoid multi-card mosaics.
- Prefer long comparison rows, split workspaces, dividers, and inspector layouts over card grids.
- Do not use boxed center-column heroes for patient-facing top-level routes.

### Section Padding

- public hero inner padding:
  `24px` mobile, `40px` desktop
- standard panel padding:
  `24px` mobile, `32px` desktop
- dense operational rail padding:
  `20px` mobile, `24px` desktop

## Imagery Rules

Use imagery that does narrative work.

### Subject Matter

Use:

- doctor and patient consultation moments
- calm hospital or hotel-adjacent arrival moments
- coordinator or concierge-like support interactions
- bright waiting or recovery environments
- real human proximity and reassurance

Do not use:

- surgery-room drama
- PPE-heavy emergency scenes
- stock handshakes
- smiling call-center cliches
- glossy wellness poses
- close-up equipment glamour shots

### Crop Logic

- homepage hero:
  `16:10` desktop, `4:5` mobile
- route support banner:
  `16:7`
- comparison row media:
  `4:3`
- vendor login support image:
  `3:4` or tall crop that preserves calm negative space

### Tonal Range

- natural daylight over artificial blue light
- skin tones and materials should feel real, not retouched into plastic warmth
- avoid high saturation or high-contrast chroma
- prefer creams, stone, muted teal, and natural wood or linen tones when present

### Text-Safe Zones

- reserve at least `35%` of hero width as a calm text area
- avoid signage, faces, or bright windows behind text
- add a subtle scrim only when necessary to preserve contrast
- never place text over visually busy diagnostic equipment

### Fallback Behavior

If premium photography is unavailable:

- use layered paper surfaces with a restrained wayfinding or map-line motif
- add one thin-line illustration or textured field only if it supports the route
- keep the first viewport spatially strong even without photography
- do not replace imagery with abstract blob gradients or fake 3D objects

## Motion System

| Moment | Motion | Duration | Easing | Reduced motion fallback |
|---|---|---|---|---|
| Hero entrance | opacity + `16px` translate | `450ms` | `ease-out` | opacity only, `120-160ms` |
| Section reveal | opacity + subtle rise | `320ms` with `40ms` stagger | `ease-out` | no stagger, opacity only |
| CTA hover | color, shadow, or `2px` lift | `140ms` | `ease-out` | color only |
| Selection change | price or selection crossfade | `180ms` | `ease-out` | instant swap |
| Accordion or inspector open | opacity + height or translate | `220ms` | `ease-out` | instant open with no slide |
| Toast or inline success | fade with small vertical offset | `180ms` | `ease-out` | fade only |

Motion rules:

- no ornamental looping motion
- no parallax gimmicks
- no bouncing counters
- no spinner as the primary loading style when skeletons can explain layout better
- motion must reinforce trust, precision, and ease

## Route Blueprints For Current Product

### `/` Patient Search

Role:
public discovery route for international patients comparing treatment options before committing.

Desktop composition:

- full-bleed photography-led hero occupies the first viewport edge to edge
- inner hero text sits in a `max 640px` column on the calm side of the image
- a thin trust strip runs near the lower edge of the hero, not as a separate floating card
- below the hero, a control row shows result count and currency toggle
- hospital options appear as stacked comparison sheets, not a grid
- each comparison sheet uses a `12`-column layout:
  media `3`, hospital facts `4`, selectors `3`, price and CTA `2`

Mobile composition:

- hero fills `82-90svh`
- headline anchors low in the frame with a clear text-safe zone
- trust strip becomes three stacked short statements
- currency toggle and result count live in a compact sticky bar under the hero
- each comparison sheet stacks in this order:
  image, hospital facts, selectors, price and CTA

First-view hierarchy:

1. Rogveda brand label
2. `display-xl` headline
3. `body-l` reassurance sentence
4. primary scroll CTA
5. trust strip

CTA priority:

1. `Compare Hospitals`
2. `Book Now` inside each comparison sheet

Copy intent:

- reassure first
- explain that browsing is guest-friendly
- emphasize transparent pricing and travel-readiness

Trust cues:

- verified partner copy
- surgeon experience
- no hidden coordination fee
- travel coordination visibility
- subtle NCR explanation where Gurgaon appears in Delhi search

States:

- loading:
  keep the hero visible and load `3` comparison-sheet skeletons below
- empty:
  use a calm editorial empty state with one next step, not a dead admin message
- error:
  explain that the shortlist could not load and offer retry direction
- unconfigured:
  plain-language setup state for internal use only

Responsive collapse:

- selectors stack vertically below `768px`
- price and CTA stay visually coupled at every size
- no secondary right rail survives on mobile

### `/booking` Booking Review

Role:
decision checkpoint where the patient understands the exact selection, wallet impact, and booking consequence.

Desktop composition:

- a full-width intro band opens the route with `heading-xl`, one reassurance paragraph, and optional quiet support imagery
- below it, the main content becomes a `12`-column grid:
  selected treatment narrative `7`, sticky booking rail `5`
- the sticky rail contains patient profile, wallet balance, and the primary action
- detail blocks sit in a clean grid, not a stack of unrelated cards

Mobile composition:

- intro band first
- selected treatment details second
- patient and wallet panel third
- sticky bottom confirm action after the main details become visible

First-view hierarchy:

1. route eyebrow
2. `heading-xl` title
3. server-validation reassurance
4. wallet impact panel
5. `Confirm Booking`

CTA priority:

1. `Confirm Booking`
2. `Back To Search`

Copy intent:

- be calm and exact
- explain what the action writes and why the wallet can go negative in the demo
- remove all hype

Trust cues:

- final quote rechecked on the server
- wallet balance shown before the action
- vendor sees the same booking after confirmation

States:

- invalid selection:
  explain that the choice changed and the patient must return to search
- unconfigured:
  backend setup message
- temporary error:
  explain load failure and next step
- booking failure:
  inline error state above the action area

Responsive collapse:

- sticky rail becomes a stacked summary plus bottom action bar on mobile
- data points move from `2` columns to `1`
- no visual dependency on wide viewport side-by-side layout

### `/booking/confirmation/[bookingId]` Booking Confirmation

Role:
proof of successful booking plus handoff into the next coordination step.

Desktop composition:

- top success band with soft accent background and status emphasis
- below, `8/4` split:
  confirmation details `8`, next-steps panel `4`
- next-steps panel explains what changed:
  booking saved, wallet updated, vendor task created
- CTA row sits directly below the main details

Mobile composition:

- success band
- detail list in one column
- next-steps panel
- vertically stacked CTA buttons

First-view hierarchy:

1. success state
2. booking ID and hospital
3. updated wallet
4. next step
5. CTA row

CTA priority:

1. `Back To Search`
2. `Open Vendor Login`

Copy intent:

- reassure without celebration theatrics
- confirm what was saved
- make the vendor handoff obvious because this is a connected demo

Trust cues:

- booking ID
- status
- exact confirmed price
- updated wallet balance
- created vendor task

States:

- not found:
  centered not-found panel with a return path
- unconfigured:
  backend setup state
- error:
  precise load-failure state

Responsive collapse:

- details grid becomes a single list
- CTA row stacks full-width
- no secondary panel should feel optional or hidden

### `/vendor/login`

Role:
quiet operational entry point for the demo vendor.

Desktop composition:

- `12`-column split:
  support image or textured editorial plane `5`, form sheet `7`
- the visual side uses calm concierge or hospital-desk imagery with a quiet overlay
- the form side contains intro, form, demo credentials, and a return link
- avoid homepage-style hero theatrics

Mobile composition:

- image compresses to a short banner or becomes a soft backdrop behind the intro
- intro and form stay above the fold where possible
- credentials move below the primary action

First-view hierarchy:

1. `Vendor Login` label
2. `heading-xl` title
3. one-sentence route explanation
4. username and password fields
5. primary CTA
6. demo credentials

CTA priority:

1. `Sign In To Dashboard`
2. `Back To Patient Search`

Copy intent:

- clear, direct, operational
- no marketing voice
- remind the user they are entering the same booking data source

Trust cues:

- demo credential block
- same database wording
- explicit task workflow note

States:

- invalid login:
  inline error panel above the form
- backend issue:
  quiet info panel, not a modal interruption

Responsive collapse:

- demo credentials become a secondary section below the form
- return link becomes tertiary
- no dual-column dependency on mobile

### `/vendor/dashboard`

Role:
primary operational workspace for booking coordination.

Desktop composition:

- top header row with route label, vendor name, and sign-out
- summary strip below with counts and workload orientation
- main workspace is a `5/7` split:
  booking queue `5`, selected booking inspector `7`
- the queue should support status filters or grouping if added as client-only interaction
- the inspector should carry the selected booking details, patient context, task state, and completion action

If a smaller implementation pass keeps the current server-rendered stack instead of a selected inspector, preserve the same hierarchy:

- summary first
- booking sheets second
- action zone visually separated inside each sheet

Mobile composition:

- compact header
- summary strip wraps into two rows
- queue becomes accordion-like sheets
- selected detail expands inline
- task action stays easy to reach inside the active sheet

First-view hierarchy:

1. workload summary
2. selected booking or first pending booking
3. task action
4. supporting details

CTA priority:

1. `Mark Task Complete`
2. `Sign Out`

Copy intent:

- orient quickly
- state freshness and task status clearly
- keep language operational, not promotional

Trust cues:

- explicit status chips
- clear task label
- same persisted source-of-truth framing
- immediate feedback after completion

States:

- empty:
  explain that bookings appear after patient confirmation
- error:
  say the dashboard could not load and provide next-step guidance
- unconfigured:
  plain setup notice
- success:
  compact inline panel or toast after task completion

Responsive collapse:

- filters become horizontal scroll instead of wrapping into a busy cluster
- detail inspector becomes inline drawer
- summary metrics remain readable at large text sizes

## Future Patient-Auth Chapter

### Design-Ready, Security-Later

The following surfaces are intentionally future-facing. They should not be implemented until route-level patient auth and secure access rules are scheduled.

Security note:

- future patient surfaces must use a real session or signed access strategy
- raw public booking ID lookup is not the target end state for patient access

### Future `Patient Login`

Role:
retrieve a patient's journey securely without turning public search into an auth-first experience.

Layout:

- use a quiet split layout similar to vendor login, but warmer and more patient-first
- left side:
  calm consultation or arrival image
- right side:
  secure access form, reassurance copy, and help text

Required elements:

- field for email or phone
- field for booking code or secure OTP step
- reassurance about privacy and secure access
- tertiary support link for coordinator help

Tone:

- personal
- steady
- non-technical

Primary CTA:

- `Continue Securely`

### Future `Patient Dashboard`

Role:
one calm place for a patient to see booking status, wallet, and what happens next.

Desktop composition:

- welcome band with one serif display line
- next milestone panel
- booking summary
- travel and document checklist
- wallet panel
- coordinator contact block

Mobile composition:

- milestone and next action first
- timeline or checklist second
- booking and wallet details third

Key feeling:

- guided, not monitored

Do not make this a KPI dashboard.

### Future `Patient Booking Detail / Timeline`

Role:
single-booking narrative view showing treatment, travel prep, and status progression.

Layout:

- route opener with status and hospital
- vertical timeline of milestones
- detail summary blocks for doctor, room, travel support, and wallet
- compact help strip with contact path

Key states:

- pending document
- confirmed
- in progress
- completed

Interaction:

- milestone expansion is allowed as client-only UI state
- route must remain readable without interaction

## Component And State Contracts

### Shared Shape Rules

- section padding:
  `24px` mobile, `32px` desktop
- primary control height:
  `48px`
- compact control height:
  `44px`
- chip height:
  `32px`
- inter-control gap:
  `12px` or `16px`

| Component | Visual role | Allowed variants | Spacing and copy rules | Banned misuse |
|---|---|---|---|---|
| Button | Primary action or clear secondary action | `primary`, `secondary`, `tertiary`, `destructive` | Use verb-first labels. Keep to `1-4` words. Height `48px` by default. | Multiple primary buttons in one small panel, all-caps CTAs, giant marketing buttons on vendor routes |
| Input | Collect one value clearly | text, email, password, code | Label above field using `label`. Helper text below using `body-s`. | Placeholder-only labels, icon-only meaning, dense inline multi-field clusters on mobile |
| Selector | Choose currency, doctor, room, or filter | segmented, select list, pill group | Keep option labels factual. Animate value changes in `180ms`. | Nested selectors, more than one accent color, tiny hit targets |
| Trust strip | Show proof and reassurance near decision points | hero strip, inline strip | `3` items max. Each item gets a short title and one sentence. | Badge soup, decorative icons with no meaning, long paragraphs |
| Comparison row | Main hospital option container | default, highlighted recommended | Use strong media, factual details, selectors, price, CTA. Keep it as a long sheet, not a mosaic tile. | Generic card grids, floating stat pills, too many nested boxes |
| Detail block | Label/value pair inside booking or confirmation panels | default, emphasis | `8px` label-to-value gap. Value can wrap to `2` lines. | Dense paragraph dumps, unlabeled values |
| Confirmation panel | Outcome proof and reassurance | success, neutral info | Lead with outcome, then structured facts, then next step. | Celebration overload, confetti, vague "all set" without specifics |
| Vendor task surface | Operational inspector for the next action | pending, complete, disabled | Keep the task title, status chip, and action close together. | Marketing copy, ornamental metrics, oversized hero treatment |
| Alert | Communicate blocking or notable state | info, warning, error, success | Heading max `5` words, body max `2` short sentences, include next step. | Raw stack traces, modal spam, multiple stacked alerts in one panel |
| Toast | Non-blocking status feedback | success, error | One short sentence. Auto-dismiss after `4s` or on route refresh. | Long logs, multi-action UI, essential information only available in toast |
| Status chip | Show state quickly | confirmed, pending, in progress, complete, needs action | Use text plus color. Keep shape quiet and readable. | Color-only meaning, neon fills, overly rounded candy styling |
| Empty state | Explain absence of data | search empty, vendor empty, future patient empty | One sentence on what is missing, one sentence on what to do next. | Jokes, whimsical illustration overload, dead-end wording |
| Error state | Explain failure and next action | recoverable, blocking | State what failed, what remains safe, and what the user can do. | Technical jargon as the default user message, blame language |
| Skeleton | Preserve layout understanding while data loads | hero, row, detail, inspector | Match final layout shape. Use subtle pulse or static placeholders. | Generic full-screen shimmer unrelated to final structure |

## Copy And Tone

Voice:

- calm
- expert
- human
- concise

### Writing Rules

- say what the user is looking at
- say what happens next
- prefer concrete nouns over brand flourish
- keep most supporting copy to one sentence
- avoid exclamation marks unless there is a rare human reason

### Words To Prefer

- patient
- booking
- coordinator
- partner hospital
- confirmed
- next step
- travel support
- review

### Words To Avoid

- revolutionary
- frictionless
- unlock
- super app
- wellness journey
- luxury care
- transformation
- magical

### Example Headlines

| Surface | Good | Avoid |
|---|---|---|
| Homepage | `Compare trusted knee replacement options in Delhi.` | `A luxury future of healing awaits.` |
| Booking review | `Review your selected treatment before confirming.` | `You are one click away from transformation.` |
| Confirmation | `Your booking is saved and travel coordination can begin.` | `Success! Everything is perfect.` |
| Vendor login | `Access the booking operations dashboard.` | `Power your medical travel pipeline.` |
| Vendor dashboard | `Confirmed bookings ready for coordination.` | `Your growth cockpit.` |

### Example Subheads

- `Browse hospitals without logging in. Change doctor and room choices and see transparent pricing before booking.`
- `The final quote is rechecked on the server before the booking is saved.`
- `The same booking now appears in the vendor workflow for the first travel task.`

### CTA Labels

- `Compare Hospitals`
- `Book Now`
- `Confirm Booking`
- `Back To Search`
- `Sign In To Dashboard`
- `Mark Task Complete`
- `Continue Securely`

### Reassurance Copy

- `Final pricing is rechecked on the server before the booking is created.`
- `Negative wallet balances are allowed in this demo.`
- `The vendor sees the same booking record after confirmation.`
- `No login is required to compare treatment options.`

### Task And Status Language

- `Confirmed`
- `Pending`
- `In Progress`
- `Task Complete`
- `Coordination Started`
- `Action Needed`

## Accessibility And Quality Bar

| Requirement | Rule |
|---|---|
| Contrast | Minimum `4.5:1` for normal text, `3:1` for large or bold text. Prefer higher contrast for key actions and small metadata. |
| Focus visibility | Never remove focus outlines. Use a `2px` accent ring with `2px` paper halo. |
| Tap targets | Minimum target size `44x44px` for all interactive elements. |
| Keyboard order | Follow the visual reading order and keep action order predictable. |
| Reduced motion | Respect `prefers-reduced-motion` by removing translate or parallax effects and keeping fades short. |
| Large text | Support at least `200%` text enlargement with reflow, stacking, and no clipped CTA labels. |
| Readable line length | Keep body copy in the `45-75` character range where practical. |
| Error semantics | Pair errors with plain-language explanations and next steps. |
| Color usage | Never rely on color alone to convey status. Pair chips with text. |
| Form clarity | Persistent labels, clear errors, and visible submit state are required. |

Additional rules:

- do not autoplay carousels
- do not use fast blinking or looping attention effects
- do not hide key information only in hover states
- keep mobile thumb reach in mind for primary booking and task actions

## AI Implementation Appendix

### One-Shot Build Brief

Implement Rogveda as a premium medical concierge healthcare UI using `Newsreader` for editorial display moments and `Manrope` for all interface text. Make `/` photography-led and poster-like, keep booking routes clear and reassuring, and make vendor routes calmer and more operational. Use the exact warm palette and spacing system from this document. Favor long comparison sheets and split workspaces over card grids. Preserve all existing product behavior and server/client boundaries. Do not add patient auth in this slice.

### Route-Specific Mini-Prompts

- `/`:
  Redesign `features/patient-search/public/patient-search-page.tsx` and related `features/patient-search/ui/*` so the homepage becomes a full-bleed, photography-led healthcare comparison experience with stacked comparison sheets, a compact currency control bar, and strong trust cues. Keep public browsing frictionless and do not move business logic into client code.
- `/booking`:
  Redesign `features/booking/public/booking-review-page.tsx` and `features/booking/ui/*` into a calm booking checkpoint with a strong intro band, structured treatment details, a sticky summary rail on desktop, and a clear wallet-impact action area.
- `/booking/confirmation/[bookingId]`:
  Redesign `features/booking/public/booking-confirmation-page.tsx` and `features/booking/ui/*` into a premium confirmation surface with an explicit success band, structured proof of what changed, and a clear next-step panel.
- `/vendor/login`:
  Redesign `features/vendor/public/vendor-login-page.tsx` and `features/vendor/ui/*` into a quiet operational sign-in route with one support image, one strong form sheet, and restrained trust copy.
- `/vendor/dashboard`:
  Redesign `features/vendor/public/vendor-dashboard-page.tsx` and `features/vendor/ui/*` into an operational workspace with a summary strip, booking queue, and inspector-style detail area. If the implementation stays server-only, keep the same hierarchy using stacked sheets instead of a client-selected inspector.

### Hard Bans

- no generic SaaS card grid
- no more than two typefaces
- no purple drift
- no fake medical dashboards
- no auth wall on public search
- no patient-auth implementation in this slice
- no heavy ornamental gradients behind operational UI
- no hero cards floating over the homepage image
- no hype copy or startup jargon

### Implementation Order

1. `/`
2. `/vendor/login`
3. `/booking`
4. `/booking/confirmation/[bookingId]`
5. `/vendor/dashboard`

Future patient-auth routes should only move after route-level auth and secure access rules are scheduled.
