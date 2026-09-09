# Preventing Supabase Pooler Queue Exhaustion on Cloud Run

## Problem

A Cloud Run backend accepted 80 concurrent requests while postgres.js exposed its default pool of 10 connections. Intermittent database stalls left requests active after the browser's 20-second deadline. Retries accumulated behind the instance-local pool until unrelated authenticated routes, including `/users/me`, reached Cloud Run's 300-second timeout.

Production evidence showed 85 timeout responses on one backend instance while CORS preflight requests remained fast. Restarting the instance restored normal responses, confirming process-local queue or connection state was part of the failure.

The application configured PostgreSQL `statement_timeout=15000` through postgres.js startup parameters, but read-only probes showed both Supabase transaction and session pooler paths retained a two-minute timeout. The direct database endpoint honored the intended 15-second setting.

## Solution

- Use the direct Supabase PostgreSQL endpoint for this low-traffic service.
- Store `DATABASE_URL` in GCP Secret Manager rather than a literal Cloud Run environment value.
- Set postgres.js `max` to 3 per backend instance.
- Set Cloud Run container concurrency to 20.
- Set Cloud Run request timeout to 30 seconds.
- Keep maximum Cloud Run instances at 5.
- Retain 10-second connect, 15-second statement, 20-second idle, and 300-second maximum-lifetime bounds.

## Why

The direct path enforces the configured database statement deadline. The lower postgres.js maximum caps per-instance pressure, and the Cloud Run concurrency limit prevents a large request backlog from accumulating behind a much smaller database pool. The 30-second platform deadline is an outer bound if a failure occurs outside PostgreSQL statement execution.

These controls are coupled. Raising Cloud Run concurrency without re-evaluating the database connection budget can recreate the failure.

## Verification

- Unit test asserts the exact postgres.js connection options.
- Backend tests and production build must pass.
- A read-only Cloud Run job must verify direct connectivity and `statement_timeout=15s` before production traffic changes.
- Production verification must include authenticated `/users/me`, branches, dashboard, recent transactions, and transaction-detail routes plus revision-scoped 5xx and PostgreSQL error checks.

## Tags

Supabase, PostgreSQL, postgres.js, Cloud Run, concurrency, connection pool, timeout, production incident
