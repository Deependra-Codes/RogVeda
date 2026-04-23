# Agent Guardrail System

Status: active
Date: 2026-04-22

## Goals

AI agents in this repo should:

- research before big claims
- write less code by default
- protect performance and memory
- preserve clean boundaries
- leave durable records behind for non-trivial work

## Guardrails

### Understand Before Editing

- inspect current docs and code first
- do not invent repo facts
- do not guess architecture when it can be specified or discovered

### Less Code First

Ask in this order:

1. can code be deleted?
2. can a boundary be simplified?
3. can a type or schema remove ambiguity?
4. can an existing abstraction be reused?
5. is new code still necessary?

### Performance First

- prefer server-first data flow
- avoid avoidable client state and client fetches
- keep repeated work off hot paths
- treat memory and query count as part of quality

### Honest Uncertainty

Always distinguish:

- confirmed
- inferred
- unknown
- still unverified
