# Theory: SneakerDoc Request Reliability

## Problem

SneakerDoc depends on several authenticated API calls during page bootstrap. The most important is `/users/me`, because `OnboardingCheck` blocks the application behind a full-screen loading overlay until that request settles. If the database path stalls, the browser receives no response and the interface appears blank even though the frontend bundle, authentication middleware, and Cloud Run startup probe are healthy.

The September 9 incident affected `/users/me`, branches, recent transactions, upcoming transactions, deposits, and other unrelated routes. Each request ended as a Cloud Run 504 after approximately 300 seconds. PostgreSQL then reported error code `57014`, `canceling statement due to statement timeout`, even for a simple primary-key user lookup. This proves the failure class was a shared database-path stall, not dashboard query complexity and not the earlier JavaScript Date serialization defect.

## Operating Theory

Service readiness has three distinct layers:

1. Cloud Run control-plane readiness proves that a container started and accepted TCP connections.
2. Fast unauthenticated 401 responses prove routing and the authentication boundary.
3. Fast authenticated responses prove the Supabase token and PostgreSQL paths that real users need.

Only the third layer verifies application recovery. During this incident, layers one and two remained healthy while authenticated database work was blocked. The live backend used the Supabase transaction pooler on port 6543 through a long-lived postgres.js client. The exact initiating condition, such as a pooler impairment, stale connection, exhausted client pool, or database lock, was not captured. The application made the impact worse by allowing requests to occupy Cloud Run slots for five minutes and by giving the browser no deadline or error state.

## Strategy

Recovery and prevention are separate actions.

For immediate recovery, force a backend-only Cloud Run revision while preserving the exact serving image. This replaces process-local PostgreSQL connections without changing application code or frontend traffic. Recovery is considered proven only when authenticated `/users/me`, `/branches`, and `/transactions/recent` requests complete normally on the new revision and revision-scoped logs remain free of fresh 300-second 504s.

For prevention, apply limits at both owning boundaries:

- The database client sets bounded connection establishment, PostgreSQL statement execution, idle connection recycling, and maximum connection lifetime while retaining `prepare: false` for PgBouncer transaction mode.
- The shared frontend API transport aborts requests after a finite deadline and preserves caller-provided abort signals.
- `OnboardingCheck` owns the user-visible bootstrap failure state. It replaces the indefinite spinner with a clear retry action when current-user loading fails.

These changes do not alter authentication, authorization, schema, query shape, accounting, pagination, or API response contracts. They convert an indefinite apparent freeze into a bounded, recoverable failure and reduce the chance that stale process connections survive long enough to block an instance.

## Verified State

PR #4 commit `5702bc9` is already deployed. Its Date serialization correction is not the cause of this database-path incident.

A backend-only restart created revision `sneaker-doc-pos-api-00055-b22` with the same `5702bc9` image and 100 percent traffic. After the restart, authenticated production requests recovered: `/users/me`, `/branches`, `/transactions/recent`, `/transactions/dashboard`, `/transactions/upcoming`, and deposits returned 200 or 304 in approximately 0.2 to 1.3 seconds, with no revision-scoped errors in the sampled window.

The durable timeout and retry changes remain subject to source review, commit, build, deployment, and post-deploy verification before they can be treated as production behavior.
