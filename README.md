# AIOS

![CI](https://github.com/Samek55/AIOS/actions/workflows/ci.yml/badge.svg)

AIOS is an AI-powered life operating system prototype that combines personal assistance, hyperlocal commerce, routine planning, health tracking, finance awareness, and role-based operations into one product.

It is built as a full-stack demo with a React web app, a Node.js API, admin and vendor experiences, optional PostgreSQL persistence, and a mobile Expo workspace.

> Status: working prototype with real flows, seeded accounts, automated backend checks, and a deployable web build.

## Why AIOS

Most products solve one narrow task at a time. AIOS is designed around the user's day.

Instead of jumping between separate apps for ordering food, checking habits, planning routines, tracking health, and watching spending, the user can make one request and let the system coordinate the next actions.

Example requests:

- `Order a healthy dinner under $15`
- `Plan my evening around my energy level`
- `Help me recover today`
- `Keep me on budget this week`

The goal is not just to chat. The goal is to understand context, recommend the next step, and trigger useful actions across the platform.

## What Is In This Repo

- React + Vite web app with customer-facing product flows
- Node.js backend with auth, role-aware APIs, metrics, payments hooks, and assistant orchestration
- Admin console and vendor portal powered by the same backend
- Optional PostgreSQL persistence with file-backed fallback storage
- Expo mobile workspace in [`mobile/`](mobile/)
- Docker, CI, and operations documentation

## Core Product Areas

- AI assistant that can summarize context and return actionable guidance
- Marketplace experience for nearby ordering and cart management
- Routine and habit flows for daily planning and follow-through
- Health and wellness tracking for water, meals, workouts, and mood
- Finance-aware recommendations instead of isolated budget tooling
- Admin and vendor experiences for operations, visibility, and product management

## App Surfaces

- `/` dashboard
- `/login`
- `/ai-assistant`
- `/marketplace`
- `/health`
- `/routine`
- `/finance`
- `/social`
- `/profile`
- `/admin`
- `/vendor`

## Quick Start

### Web App + API

```bash
npm install
npm run dev:server
npm run dev
```

- Web app: `http://localhost:5173`
- API: `http://localhost:3001`

During local frontend development, Vite proxies `/api` requests to the backend server.

### Optional PostgreSQL

```bash
docker compose up -d
copy .env.example .env
```

Set:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aios
```

Then restart the backend.

If `DATABASE_URL` is not set, AIOS falls back to local JSON persistence in `server/data/store.json`.

### Mobile Workspace

```bash
npm --prefix mobile install
npm run dev:mobile
```

If you run the mobile client on a physical device, update [`mobile/src/api.ts`](mobile/src/api.ts) to point to a reachable backend host.

## Demo Accounts

- Customer: `alex@aios.app` / `demo1234`
- Vendor: `vendor@aios.app` / `vendor1234`
- Admin: `admin@aios.app` / `admin1234`

## Architecture Snapshot

- Web app entry: [`src/main.tsx`](src/main.tsx)
- App shell: [`src/app/App.tsx`](src/app/App.tsx)
- Routing: [`src/app/routes.tsx`](src/app/routes.tsx)
- Frontend state: [`src/app/state/AiosAppContext.tsx`](src/app/state/AiosAppContext.tsx)
- API client: [`src/app/lib/api.ts`](src/app/lib/api.ts)
- Backend entry: [`server/index.js`](server/index.js)
- Request routing: [`server/router.js`](server/router.js)
- Domain logic: [`server/logic.js`](server/logic.js)
- Auth: [`server/auth.js`](server/auth.js)
- Persistence: [`server/store.js`](server/store.js)

## Backend Capabilities

The backend currently includes:

- auth and registration
- bootstrap and dashboard APIs
- assistant query endpoint
- vendors, products, cart, and ordering flows
- routine and task actions
- health logging and workout or meal toggles
- payment checkout hooks
- admin overview and vendor dashboard support
- health and metrics endpoints

For the endpoint-level reference, see [guidelines/AIOS-API.md](guidelines/AIOS-API.md).

## Local Commands

- Start frontend dev server: `npm run dev`
- Start backend dev server: `npm run dev:server`
- Start backend in server mode: `npm start`
- Run backend checks: `npm run test:server`
- Build production web app: `npm run build`
- Start mobile workspace: `npm run dev:mobile`

## Validation

This repository already includes:

- backend verification via `npm run test:server`
- production web build via `npm run build`
- GitHub Actions workflow at [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

## Current Product Story

AIOS is strongest when it behaves like a personal command center rather than a collection of disconnected tools.

A good demo flow looks like this:

1. The user opens the dashboard and sees a daily brief.
2. They ask the assistant to plan the evening and order dinner.
3. AIOS considers budget, health signals, habits, and nearby options.
4. The system recommends food, updates routines, and tracks follow-up actions.
5. The user ends the day with a clearer picture of health, productivity, and spending.

## Current State Of The Project

Today this repo is a full-stack prototype, not a finished production platform.

What it already does well:

- demonstrates a multi-surface product vision
- connects assistant, marketplace, health, and routine flows in one codebase
- supports customer, vendor, and admin roles
- runs locally with seeded demo data
- supports either PostgreSQL or local file persistence

What would come next in a production push:

- stronger AI memory and personalization
- delivery and order lifecycle depth
- calendar and notification integrations
- hardened auth, storage, and background job processing
- more granular observability and deployment automation

## Roadmap

### Phase 1

- onboarding and auth
- dashboard foundation
- assistant v1
- nearby marketplace
- routine planning
- health score basics

### Phase 2

- delivery tracking
- spending tracker
- AI memory
- mood-aware suggestions
- deeper personalization

### Phase 3

- family mode
- streaks and rewards
- pantry and household workflows
- vendor analytics
- voice experiences

### Phase 4

- predictive ordering
- auto-mode orchestration
- wearable integrations
- camera-based nutrition and posture features
- advanced life summaries and coaching

## Repo Docs

- [AIOS API guide](guidelines/AIOS-API.md)
- [AIOS product blueprint](guidelines/AIOS-Blueprint.md)
- [Operations notes](guidelines/OPERATIONS.md)
- [Project guidelines](guidelines/Guidelines.md)

## Positioning

AIOS can be framed as:

- an AI lifestyle assistant
- a local commerce platform
- a wellness and productivity operating system
- a household coordination layer for families

Possible revenue paths include marketplace commissions, premium AI subscriptions, vendor tooling, and paid health or finance features.
