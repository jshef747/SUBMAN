# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SUBMAN is a subscription management application. Users can track their recurring subscriptions, get renewal notifications via email, and view spending analytics.

**Stack:**
- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** React 19 + TypeScript + Vite
- **Auth:** Supabase (JWT-based; frontend handles login, backend validates tokens)
- **Infra:** Docker + Kubernetes + Helm

---

## Development Commands

### Backend (`/api`)
```bash
cd api
npm run start:dev       # Start with hot reload
npm run build           # Compile TypeScript
npm run start:prod      # Run compiled output
npm run lint            # Lint and auto-fix
npm run test            # Run all unit tests
npm run test:watch      # Watch mode
npm run test:cov        # With coverage
npm run test:e2e        # E2E tests
```

**Prisma:**
```bash
cd api
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Regenerate Prisma client after schema changes
npx prisma studio          # Open Prisma GUI
```

### Frontend (`/frontend/subman-client`)
```bash
cd frontend/subman-client
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Running a single test
```bash
cd api
npx jest subscriptions.service   # Match by filename pattern
npx jest --testPathPattern="subscriptions.controller.spec.ts"
```

---

## Architecture

### Auth Flow
Supabase handles user registration and login entirely on the frontend. The frontend gets a JWT from Supabase and sends it as `Authorization: Bearer <token>` on all API requests. The backend's `SupabaseGuard` (`api/src/auth/supabase.guard.ts`) validates the token with Supabase and attaches `request.user` (containing `user.id`) for use in controllers/services.

### Backend Structure (`/api/src`)
- `app.module.ts` — Root module; imports all feature modules
- `prisma.service.ts` — Singleton Prisma client injected across the app
- `auth/` — `SupabaseGuard` for protecting routes
- `subscriptions/` — CRUD for subscriptions; all routes are guarded. DTOs in `dto/`, entity type in `entities/`
- `notifications/` — Cron-based email notifications for upcoming renewals (Nodemailer + Gmail SMTP)

### Frontend Structure (`/frontend/subman-client/src`)
- `supabaseClient.ts` — Supabase JS client singleton
- `types.ts` — Shared TypeScript types (e.g., `Subscription`)
- `utils/` — Shared utilities
- `components/` — Shared UI components (`AuthForm`, `header`, `navbar`)
- `pages/` — Route-level components (`dashboard`, `homepage`, `login`, `signup`)
- `App.tsx` — React Router setup with protected routes

### API Communication
- In development: set `VITE_API_URL` in `/frontend/subman-client/.env` to point to the backend (e.g., `http://localhost:3000`)
- In Kubernetes: `VITE_API_URL=/api` — Nginx proxies `/api/*` → backend service at `http://subman-api.subman.svc.cluster.local:3000/` (strips the `/api` prefix)

### Database Schema
Single `Subscription` model in `api/prisma/schema.prisma`:
- `userId` (String) — Supabase user ID, no FK (users live in Supabase, not local DB)
- `name`, `pricePerCycle`, `currency`, `payCycle`, `renewalDate`, `isActive`

### Environment Variables
**Backend (`api/.env`):**
- `DATABASE_URL` — PostgreSQL connection string
- `SUPABASE_URL`, `SUPABASE_KEY` — Supabase project credentials
- `SMTP_*` — Gmail SMTP credentials for notification emails

**Frontend (`frontend/subman-client/.env`):**
- `VITE_API_URL` — Backend base URL
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase project credentials

---

## Kubernetes / Helm

Raw manifests are in `/k8s/` (numbered 00–08). The Helm chart is at `/k8s/helm-chart/subman/`.

```bash
# Apply raw manifests
kubectl apply -f k8s/

# Install/upgrade via Helm
helm upgrade --install subman k8s/helm-chart/subman/ -n subman

# Override values
helm upgrade --install subman k8s/helm-chart/subman/ \
  --set api.image.tag=latest \
  --set postgres.password=secret
```

The API deployment includes an init container that runs `prisma migrate deploy` before the main container starts, ensuring migrations are applied on each deploy.
