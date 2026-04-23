# Copilot Instructions

- Read `AGENTS.md` first.
- For non-trivial work, follow:
  `Intent -> Research -> Spec -> Types/Data Model -> Tests -> Implementation -> Verification`
- Write less code by default.
- Prefer server-first, low-client-JS solutions.
- Do not create god files or broad dumping-ground folders.
- Keep feature logic in `features/`, route shells in `app/`, primitive UI in `components/ui/`, and shared infra in `lib/`.
- End with what changed, what was verified, and what remains risky.
