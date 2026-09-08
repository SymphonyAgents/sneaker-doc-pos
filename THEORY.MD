# Theory: SneakerDoc Dashboard Reliability

## Problem

The dashboard is a fan-out endpoint: a single request launches several financial summary queries in parallel. This makes correctness depend not only on the accounting formulas, but also on every query parameter crossing the ORM and database-driver boundary in a representation the driver can encode. A failure in one auxiliary calculation, such as card reconciliation loss, rejects the entire `Promise.all` and turns the dashboard into an HTTP 500 even when the other summaries are valid.

## Operating Theory

The dated dashboard path differs from the all-time path because it adds date predicates to the card reconciliation query. In production commit `87d2092`, those predicates interpolated JavaScript `Date` instances into a raw SQL fragment. Drizzle passed the values to the `postgres` driver without converting them to the expected string representation, and the driver threw `ERR_INVALID_ARG_TYPE` before PostgreSQL executed the query. The all-time path avoided those parameters, explaining why `year=0&month=0` returned 200 while dated months returned 500.

Commit `5702bc9` moves the conversion to the application boundary by serializing both dates with `toISOString()` before raw SQL interpolation. The regression tests inspect the generated query expressions for both dashboard and reports and reject any remaining `Date` object. This is the correct leverage point because it preserves the financial query and date range while making the driver contract explicit.

The backend now serves revision `sneaker-doc-pos-api-00054-hs8`, built from `5702bc9`, at 100 percent traffic. The new revision starts cleanly and no longer emits the former driver exception during available smoke checks.

## Strategy

Treat production behavior and deployed provenance as separate from repository state. First prove the live failure from request and application logs, then map the serving image digest back to its source commit, and only then compare that source against current `main`. When the minimal correction already exists in git, avoid a duplicate code change: verify the correction with targeted tests and a production build, deploy only the affected backend, and prove recovery using fresh requests and revision-scoped logs.

The production image is built from a clean archive of the exact commit rather than the working directory. This prevents local diagnostic and theory files from entering the build context and makes the deployed source reproducible. The frontend, database schema, migrations, and environment remain unchanged because none are required by the root cause.

The post-deploy standard is stronger than service health alone. The new revision must receive traffic, the backend auth boundary must remain fail-closed, and revision logs must be free of the exact `Date` encoding exception. Direct end-to-end proof still requires an authenticated dated dashboard request, because an unauthenticated 401 proves routing and auth behavior but does not execute the corrected database query.

## Key Discoveries

Production had been serving backend revision `sneaker-doc-pos-api-00053-l9z`, built from commit `87d2092`, while `origin/main` was already at `5702bc9`. The incident was therefore a deployment gap, not an unfixed source defect on `main`.

The failure was isolated to dated queries. Production evidence showed repeated 500 responses for normal year/month requests and a 200 response for the all-time branch, matching the control flow in `getCardReconciliationLoss()`.

The exact hotfix delta also corrects the same parameter-boundary defect in the reports summary. Both regression suites pass, the backend production build succeeds, and production dependencies contain no high or critical vulnerabilities.

## Open Questions

The remaining verification gap is the authenticated production path. The fresh browser session reaches the login page but has no production user session. A logged-in dashboard refresh must return a non-500 response on revision `sneaker-doc-pos-api-00054-hs8` to close the incident with direct end-to-end evidence.
