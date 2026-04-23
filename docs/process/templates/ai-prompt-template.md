# AI Prompt Template

Use this when you want a coding model to follow the repo OS instead of defaulting to fast code dumping.

```text
Read AGENTS.md first.

For non-trivial work, follow:
Intent -> Research -> Spec -> Types/Data Model -> Tests -> Implementation -> Verification

Rules:
- write less code by default
- prefer server-first, low-client-JS solutions
- keep files focused and small
- do not create dumping-ground helpers
- explain what changed, what was verified, and what remains risky
```
