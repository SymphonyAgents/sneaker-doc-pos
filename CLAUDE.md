# SneakerDoc POS — Project Context

> Auto-maintained by Aria. Last updated: 2026-03-24 PHT.
> Do not edit manually — run the project-context skill to update.
> See also: AGENTS.md for quick-start commands.

## Project Overview
SneakerDoc POS is a point-of-sale system for a sneaker cleaning shop.
Handles transactions, inventory, RBAC-based staff roles, deposits, and collection channel tracking.

- **Slug**: sneaker-doc-pos
- **Type**: Client product (Vince Tapdasan)
- **Agency Phase**: Build
- **Repos**: origin=`SymphonyAgents/sneaker-doc-pos`, upstream=`VinceTapdasan/sneaker-doc-pos`
- **GCP Project**: symph-sneaker-doc-pos (project number: 995078969911, region: asia-southeast1)
- **Production**: Frontend → sneakerdoc.symph.co | Backend → sneakerdoc-api.symph.co

## Tech Stack
- **Monorepo**: pnpm workspaces (`frontend/` + `backend/`)
- **Frontend**: Next.js 16 (App Router) + shadcn/ui + Tailwind CSS v4 + TanStack Query + TypeScript
- **Backend**: NestJS 11 + Drizzle ORM + TypeScript
- **Database**: Supabase Postgres | **Auth**: Supabase Google OAuth + JWT | **Storage**: Supabase
- **Email**: Resend
- **Package Manager**: pnpm (root orchestrates both packages)
- **Deployment**: Cloud Run (asia-southeast1) — `sneaker-doc-pos` (frontend) + `sneaker-doc-pos-api` (backend)

## Architecture Overview
pnpm monorepo. Frontend (Next.js) calls backend (NestJS) via REST at `NEXT_PUBLIC_API_URL`. Supabase handles auth (Google OAuth + JWT); frontend gets JWT, passes as Bearer token; NestJS guard validates via Supabase JWT secret. Drizzle ORM against Supabase Postgres. RBAC enforced in NestJS guards.

Key patterns:
- `NEXT_PUBLIC_*` vars are baked into Docker image at build time — changes require a rebuild
- No auto-migrate on startup — apply migrations manually via Supabase SQL Editor
- Drizzle-kit generate is broken (interactive prompts) — write raw SQL migrations manually
- Deploy via: `gcloud builds submit` + `gcloud run deploy` (see `build/deploy-runbook.md`)
- Frontend Docker builds MUST use `--no-cache` to avoid stale CSS chunks

## Key Files & Directories
```
frontend/
  src/app/          # Next.js App Router (POS, inventory, transactions, admin, reports)
  src/components/   # shadcn + custom UI
  src/lib/          # Supabase client, API client, utilities
  .env.example      # Frontend env vars
backend/
  src/              # NestJS modules (auth, transactions, products, users, deposits)
  drizzle/          # SQL migrations and schema
  .env.example      # Backend env vars
Dockerfile          # Frontend image
Dockerfile.backend  # Backend image
build/
  deploy-runbook.md # Step-by-step deploy guide
```

## Conventions & Patterns
- `SelectItem` value MUST NOT be empty string `""` — causes runtime crash; use sentinel like `"none"`
- `next.config.ts` MUST override `Cache-Control: no-store` on HTML — Next.js 16 sets `s-maxage=31536000` by default; Google Frontend CDN caches HTML for 1 year without this fix
- NEVER delete Cloud Run domain mappings to bust cache — SSL re-provisioning causes 5-30 min downtime
- Drizzle SQL `sql<number>` returns STRINGS at runtime — always `Number()` before arithmetic; `+` causes string concatenation
- Deposits `upsertSingle` clamps new rows to `Math.max(0, delta)` — query by `origin` field to compute deductions
- TanStack Query: mutations invalidate relevant query keys on success
- shadcn/ui: run `pnpm dlx shadcn@latest add [component]` from `frontend/` to add components

## Active Features
- **POS Transaction Screen** — Create and process sales transactions
- **Inventory Management** — Product/service catalog
- **Transaction History** — View and edit past transactions (superadmin)
- **RBAC** — Superadmin, admin, staff role hierarchy
- **Payment Methods** — Card/bank variants with collection channel tracking
- **Deposits** — Bank deposit tracking with source-channel deduction by `origin` field
- **Auto-Expense on Cancel** — Item cancellation triggers auto-expense
- **SMS Notifications** — `autoSendSms` fires pickup-ready SMS after reschedule save

## In Progress
- Superadmin Edit Transaction feature
- Payment method card/bank variant handling

## Known Issues / Gotchas
- **Next.js 16 CDN caching**: sets `s-maxage=31536000` on static pages by default. Google Frontend CDN caches HTML for 1 year. Fix: `headers()` in `next.config.ts` to set `Cache-Control: no-store`. Incognito doesn't help — it's CDN-level.
- **Drizzle SQL type coercion**: `sql<number>` returns strings at runtime via pg driver. Always `Number()` before arithmetic — using `+` causes string concatenation (produces 10x bugs). Subtraction `-` coerces safely.
- **`SelectItem` empty value**: passing `value=""` causes a runtime crash — use a non-empty sentinel value
- **Google OAuth redirect URIs**: must include both localhost and production domains in Supabase Dashboard
- **Cloud Run cold starts**: backend may have 1-2s delay; frontend should show loading states
- **`autoSendSms`**: intentional — fires pickup SMS after reschedule save. `smsConfirmed` state is internal to that function
- **Upstream bug (fixed)**: `useCreateExpenseMutation` was sending `date` instead of `dateKey` — backend DTO expects `dateKey`

## Running Locally
```bash
pnpm install                    # From root — installs both packages
# Fill in backend/.env and frontend/.env (or frontend/.env.local)
pnpm backend                    # NestJS API on :3001 (watch mode)
pnpm dev                        # Next.js frontend on :3000
```

## Deploy Notes
- **GCP Project**: symph-sneaker-doc-pos (asia-southeast1)
- **Frontend**: Cloud Run `sneaker-doc-pos` → sneakerdoc.symph.co
- **Backend**: Cloud Run `sneaker-doc-pos-api` → sneakerdoc-api.symph.co
- **Migrations**: manual via Supabase SQL Editor (drizzle-kit generate is broken)
- **Docker builds**: use `--no-cache` flag to avoid stale CSS
- **Full runbook**: `build/deploy-runbook.md`
- **Aria SA**: has `roles/editor` on symph-sneaker-doc-pos

## Phase Status
- **Current Phase**: Build (active development)
- **Last deploy**: 2026-03-13 — backend hardening, refund-expense, collection channel fixes
- **Sprint focus**: Superadmin Edit Transaction, payment method variants, Number() coercion fixes
