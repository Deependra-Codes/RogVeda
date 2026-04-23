# Intent: Repo Readme Deployment Handoff Cleanup

Status: active
Date: 2026-04-23
Owner: workspace

## Problem Statement

Rogveda's handoff surfaces had small but costly drift: `.env.example` and `supabase/README.md` still referenced "four keys" even though the runtime contract includes an additional signing secret, and the root `README.md` did not provide one clean quickstart + deploy runbook aligned with the repo OS.

## Why Now

This repo is meant to be cloned and evaluated quickly. Setup and deployment ambiguity wastes time, increases the risk of broken Vercel deployments due to missing envs, and creates avoidable "works locally" inconsistencies around Node version requirements.

## Goals

- make the root `README.md` a first-clone and submission-ready guide (quickstart, repo tour, deploy steps)
- align `.env.example` + `supabase/README.md` language with the actual env contract and key fallback behavior
- encode Next.js' minimum Node requirement in `package.json` to reduce avoidable deployment failures

## Non-Goals

- change any product flow, schema, RLS, or auth behavior
- introduce new dependencies or new deploy platforms
- adjust UI composition, performance budgets, or route behavior

## Constraints

- keep changes doc-first; avoid runtime code churn
- do not leak secrets; only update templates and instructions

## User Impact

- faster local setup for new contributors
- fewer deployment failures due to missing envs or unsupported Node versions

## System Impact

- affected files:
  `README.md`, `.env.example`, `supabase/README.md`, `package.json`

## Success Metrics

- `pnpm repo:policy` passes with the new record set
- `pnpm repo:check` remains green on the local Supabase runtime
- a new contributor can follow `README.md` to run locally and deploy without rediscovering the env contract

## Risks Of Inaction

- repeated "missing env" / "Node version" issues during evaluation
- more drift between docs and the runtime contract
