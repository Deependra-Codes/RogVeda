# Intent: Vendor Form Post Redirect Hardening

Status: active
Date: 2026-04-23
Owner: workspace

## Problem Statement

Vendor login and task completion need deterministic browser redirects in production builds, including local `next start` smoke tests that submit plain forms over HTTP.

## Goals

- keep vendor auth and task completion server-owned
- make vendor form POST redirects preserve the submitting origin
- set vendor session cookies on the route-handler redirect response

## Non-Goals

- change credentials, schema, booking workflow rules, or vendor dashboard data mapping
- add client state or client-side persistence

## Scope

- vendor login, logout, and task-completion form submission paths
- local secure-cookie detection for production-start HTTP smoke tests
