# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SUBMAN is a subscription management application. Users can track their recurring subscriptions and view spending analytics.

**Stack:**
- **Backend:** FastAPI + Python + supabase-py (uv for package management)
- **Frontend:** React 19 + TypeScript + Vite
- **Auth & DB:** Supabase (auth + PostgreSQL via Supabase client)

---

## Development Commands

### Backend (`/api`)
```bash
cd api
uv sync                                              # Install dependencies
uv run uvicorn app.main:app --reload --port 8000     # Start with hot reload
uv run pytest                                        # Run tests
```

**API runs on port 8000.**

### Frontend (`/frontend/subman-client`)
```bash
cd frontend/subman-client
npm run dev      # Start Vite dev server (port 5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

---

## Architecture

### Auth Flow
Supabase handles user registration and login on the frontend. The frontend gets a JWT from Supabase and sends it as `Authorization: Bearer <token>` on all API requests. The backend's `get_current_user_id` dependency (`api/app/dependencies.py`) validates the token by calling `supabase.auth.get_user(token)` and returns the user's UUID.

### Backend Structure (`/api/app`)
- `main.py` — FastAPI app with CORS middleware, includes all routers
- `config.py` — `pydantic_settings.BaseSettings` reading from `.env`
- `dependencies.py` — `get_supabase_client()` (cached) and `get_current_user_id()` FastAPI dependency
- `routers/health.py` — `GET /`, `GET /healthz`, `GET /readinessz`
- `routers/subscriptions.py` — Full CRUD for subscriptions, all routes auth-protected

### Frontend Structure (`/frontend/subman-client/src`)
- `supabaseClient.ts` — Supabase JS client singleton
- `context/AuthContext.tsx` — `AuthProvider` + `useAuth` hook (session, user, loading, signOut)
- `components/ProtectedRoute/` — Redirects to `/login` if no session
- `utils/apiClient.ts` — `apiFetch()` — centralized fetch with auth token + base URL
- `types.ts` — `SubscriptionAPI` (raw API response) + `Subscription` (display type)
- `pages/` — `homepage`, `dashboard`, `login`, `signup`
- `App.tsx` — React Router with `AuthProvider`, protected `/dashboard` route

### API Communication
- In development: `VITE_API_URL=http://localhost:8000` in `/frontend/subman-client/.env`
- All API calls go through `utils/apiClient.ts` which reads `VITE_API_URL` and attaches the Supabase Bearer token

### Field Naming
- The FastAPI backend uses Python `snake_case` internally but exposes **camelCase** via Pydantic `alias_generator=to_camel`
- The frontend sends and receives **camelCase** payloads (e.g. `pricePerCycle`, `payCycle`, `renewalDate`, `isActive`)

### Database Schema
`subscriptions` table in Supabase (project: `subman-prod`):
- `id` (BIGINT IDENTITY PK), `user_id` (UUID → auth.users), `name`, `price_per_cycle`, `currency`, `pay_cycle`, `renewal_date`, `is_active`, `created_at`, `updated_at`
- Row Level Security enabled — users can only access their own rows
- Service role key used server-side to bypass RLS (application enforces ownership via `.eq("user_id", user_id)`)

### Environment Variables

**Backend (`api/.env`):**
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only, never exposed to frontend)
- `ALLOWED_ORIGINS` — JSON array of allowed CORS origins, e.g. `["http://localhost:5173"]`

**Frontend (`frontend/subman-client/.env`):**
- `VITE_API_URL` — Backend base URL (e.g. `http://localhost:8000`)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/publishable key
