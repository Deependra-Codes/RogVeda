# Supabase

Schema, migrations, seed data, generated types, and server clients live here.

## Local Workflow

1. install Docker Desktop and keep it running
2. run `pnpm dlx supabase start`
3. copy the local API URL and publishable key into `.env.local`
4. use `pnpm dlx supabase db reset` to replay migrations and seed data

## Hosted Workflow

Hosted Supabase is the canonical runtime for deployment and submission once credentials are available.

1. link the existing hosted project:
   `pnpm dlx supabase link --project-ref <existing-project-ref>`
2. audit remote drift only if the dashboard state is unclear:
   `pnpm dlx supabase db pull supabase/migrations/<timestamp>_hosted_audit.sql`
3. push the repo schema and demo seed to the linked hosted project:
   `pnpm dlx supabase db push --linked --include-all --include-seed --yes`
4. mirror the same four runtime keys into:
   - `.env.local` for local hosted-runtime verification
   - GitHub Actions secrets for `repo:check`
   - Vercel project environment variables for the live app

## Shared Env Contract

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The app uses the same keys in local, CI, and hosted environments. Read-only server slices can fall back to the publishable key when the service-role key is absent, but booking confirmation, vendor auth, and task completion require `SUPABASE_SERVICE_ROLE_KEY`.

## Deployment Notes

- Vercel should use the hosted Supabase URL and keys, not the local Docker URL.
- GitHub Actions should expose the same env names through repository or environment secrets before running `pnpm repo:check`.
- The live app should only register the service worker in production; local development stays uncached by default.
