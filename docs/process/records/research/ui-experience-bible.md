# Research: UI Experience Bible

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

What kind of design artifact and design direction will let Rogveda move into a premium healthcare UI pass quickly, consistently, and truthfully?

## Candidate Options

1. Write a lightweight moodboard-style note with only visual adjectives and a few screenshots to imitate.
2. Write one complete master UI bible with route blueprints, token systems, research translation, and an AI implementation appendix.
3. Skip the canonical doc and redesign the routes directly in code.

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| Lightweight moodboard note | Fast to draft | Leaves many decisions unresolved | High risk of design drift and generic implementation | Low | Reject |
| Complete master UI bible | One source of truth, fast AI handoff, durable reasoning | More writing up front | Requires disciplined scope to stay decision-complete | Medium | Recommend |
| Code-first redesign without doc | Immediate visual output | No durable rationale or reuse | High rework risk, harder handoff, style drift across routes | High | Reject |

## Sources

- Primary:
  - Apple Human Interface Guidelines - Typography: <https://developer.apple.com/design/human-interface-guidelines/typography>
  - Apple Human Interface Guidelines - Accessibility: <https://developer.apple.com/design/human-interface-guidelines/accessibility>
  - Consumers' Evaluation of Web-Based Health Information Quality: <https://pmc.ncbi.nlm.nih.gov/articles/PMC9100526/>
  - Trust between patients and health websites: <https://pmc.ncbi.nlm.nih.gov/articles/PMC3266366/>
  - The Role of Aesthetics in Intentions to Use Digital Health Interventions: <https://pmc.ncbi.nlm.nih.gov/articles/PMC10286978/>
- Secondary:
  - current shipped route surfaces in `features/patient-search/public`, `features/booking/public`, and `features/vendor/public`
  - current global tokens in `app/globals.css`
  - `docs/product/trial-brief.md` and `docs/context/current-state.md`

## Recommendation

Use option 2: a single master UI bible backed by the normal record set.

Recommended design direction:

- visual mode:
  `Medical Concierge`
- font strategy:
  open-source webfonts so the system is easy to ship in Next.js
- hero anchor:
  photography-led on the public homepage
- route stance:
  public routes feel editorial and reassuring; vendor routes feel cleaner and more operational
- future-auth treatment:
  include patient-auth surfaces now, but mark them as `design-ready, security-later`

## Direct Evidence Vs Inference

- Direct:
  - Apple's typography guidance emphasizes legibility, hierarchy, consistent type use, and minimum readable sizes.
  - Apple's accessibility guidance explicitly calls for larger-text support, sufficient contrast, and reduced-motion handling.
  - `Consumers' Evaluation of Web-Based Health Information Quality` identifies design as one of the major antecedent categories in how consumers evaluate online health information quality.
  - `Trust between patients and health websites` shows that trust in health websites is not a trivial single-variable problem and that design and implementation choices shape perceived trust.
  - `The Role of Aesthetics in Intentions to Use Digital Health Interventions` reports that simplicity and craftsmanship most strongly influence perceived usefulness, ease of use, enjoyment, and trust.
- Inferred:
  - Rogveda should favor a calm, crafted, low-noise aesthetic over a flashy or feature-dense one because that is more likely to support healthcare trust and intention to use.
  - A healthcare UI for cross-border treatment needs visible provenance and next-step clarity, not just attractive imagery.
  - A full route-by-route document is more useful than a generic design-system note because the current product is small enough for decision-complete coverage.

## Engineering Impact

- no runtime API or database changes are needed
- doc indexes and handoff files should be updated so future contributors discover the UI bible immediately
- the future implementation pass should mostly touch `app/globals.css` and feature-local public or UI files, not server logic
- the AI appendix should respect existing repo boundaries so visual work does not leak business logic into client components

## Unknowns / Follow-Ups

- final photography sourcing and licensing still need to be decided at implementation time
- the implementation pass should validate the font-loading cost of `Newsreader` and `Manrope`
- manual mobile QA is still needed after the eventual visual implementation
- route-level patient auth remains a separate security decision and must not be smuggled into the UI slice
