# Research: Next App Scaffold

Status: active
Date: 2026-04-22
Owner: workspace

## Research Question

What minimal app stack baseline should be installed now so the repo can start feature work cleanly without introducing unnecessary complexity?

## Candidate Options

1. manual Next.js App Router scaffold with React 19 and Tailwind CSS 4
2. `create-next-app` generated scaffold adapted afterward
3. defer app scaffold and continue with docs/process only

## Evaluation Matrix

| Option | Benefits | Costs | Risks | Complexity | Verdict |
|---|---|---|---|---|---|
| manual scaffold | clean fit with current repo OS and folder rules | a bit more setup work | small config mistakes if careless | medium | choose |
| create-next-app | fast initial generation | conflicts with existing repo files and process layout | cleanup churn | medium | reject |
| no scaffold | no immediate setup effort | blocks real product work | repo stays app-empty | low | reject |

## Sources

- Primary:
  `pnpm view next version` -> `16.2.4`
  `pnpm view react version` -> `19.2.5`
  `pnpm view react-dom version` -> `19.2.5`
  `pnpm view tailwindcss version` -> `4.2.4`
  `pnpm view @tailwindcss/postcss version` -> `4.2.4`
- Secondary:
  current repo OS standards and folder boundary rules

## Recommendation

Add a manual App Router scaffold with current package versions, a thin root route, a feature public entrypoint, and Tailwind CSS 4 styles. Keep the first route minimal and explicitly scaffold-only so no frontend business logic sneaks in early.

## Direct Evidence Vs Inference

- Direct:
  current versions were fetched from the package registry on 2026-04-22.
- Inferred:
  a manual scaffold is safer than generator cleanup because the repo already has a custom process OS and strict boundaries.

## Engineering Impact

- UI / UX impact:
  app gets a warm initial shell without pretending backend data already exists
- API or schema impact:
  adds `dev`, `build`, and `start` scripts
- Testing impact:
  `repo:check` will now run `next build`
- Runtime / deployment impact:
  establishes the Next.js runtime baseline for future slices

## Unknowns / Follow-Ups

- Supabase integration and seeded product data are still the next major slice
