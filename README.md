# AIOS

AIOS is an all-in-one AI life operating system that helps people order from nearby stores, manage routines, improve health, track spending, and get personalized daily guidance from one assistant.

This repo now contains:

- a React + Vite web app
- a Node.js backend with auth, role-aware APIs, payments, AI integration hooks, metrics, and optional PostgreSQL persistence
- a mobile Expo workspace in `mobile/`
- admin and vendor panels on top of the same backend
- Docker, CI, and local operations scaffolding

The app surfaces include:

- `/` Dashboard
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

## Run It

### Web + API

1. `npm install`
2. `npm run dev:server`
3. `npm run dev`

The web app runs on `http://localhost:5173` and the API runs on `http://localhost:3001`.

### PostgreSQL

1. `docker compose up -d`
2. copy `.env.example` to `.env`
3. set `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aios`
4. restart `npm run dev:server`

If `DATABASE_URL` is empty, AIOS falls back to file persistence in `server/data/store.json`.

### Mobile

1. `cd mobile`
2. `npm install`
3. `npm start`

Update `mobile/src/api.ts` with a reachable backend host when using a physical device.

## Demo Accounts

- Customer: `alex@aios.app` / `demo1234`
- Vendor: `vendor@aios.app` / `vendor1234`
- Admin: `admin@aios.app` / `admin1234`

## Current Platform Pieces

- Auth and user accounts with signed bearer tokens
- Optional PostgreSQL-backed persistence through `DATABASE_URL`
- Mock-or-live payment checkout flow with Stripe-ready hooks
- OpenAI-ready assistant integration with a local fallback brain
- Vendor product management
- Admin analytics and audit visibility
- Monitoring endpoints at `/api/health` and `/metrics`
- Mobile workspace sharing the same backend contract
- Server verification script via `npm run test:server`

## Product Vision

Most apps solve one small problem at a time. AIOS is designed to solve the user's day.

Instead of opening separate apps for food, tasks, workouts, budgets, and reminders, the user can tell one assistant what they need:

- "Order a healthy dinner under $15."
- "Plan my evening."
- "Help me recover today."
- "Keep me on budget this week."

The assistant should understand the user's context, decide what matters, and trigger real actions across modules.

## What Makes AIOS Interesting

- AI that acts, not only chats
- Hyperlocal marketplace for nearby food, groceries, clothes, essentials, and services
- Daily routine engine that adapts to time, weather, energy, and calendar
- Health and wellness guidance tied to real habits, meals, sleep, and workouts
- Finance awareness that influences recommendations instead of living in a separate app
- Mood and context based suggestions that make the product feel personal

## Hero User Flows

### 1. Ask, Decide, Act

The user says what they want. AIOS responds with a plan and clear actions.

Example:

`"I am tired and hungry."`

AIOS can:

- suggest nearby dinner options
- recommend a lighter workout or rest plan
- move non-urgent tasks
- prepare a short night routine

### 2. Nearby Commerce

Users can browse and order from nearby vendors:

- restaurants
- grocery stores
- pharmacies
- clothing shops
- convenience stores

### 3. Daily Operating System

The app acts like a personal command center with:

- schedule
- reminders
- habits
- health check-ins
- budget signals
- end-of-day summaries

## MVP Scope

The strongest MVP is focused on three connected loops:

1. AI assistant with memory and actionable suggestions
2. Nearby ordering with vendor discovery and delivery tracking
3. Routine plus health dashboard with smart reminders

Finance, social, and advanced automation can land in later milestones.

## Suggested Tech Stack

To move fast from the current codebase:

- Web app: React + Vite + TypeScript + Tailwind
- Mobile app: Expo React Native + TypeScript + NativeWind
- API: Node.js + NestJS
- AI service: Python + FastAPI
- Database: PostgreSQL
- ORM: Prisma
- Cache and jobs: Redis + BullMQ
- Embeddings and memory: pgvector
- Auth and storage: Supabase or Clerk + S3 compatible storage
- Maps and location: Google Maps Platform
- Payments: Stripe plus local payment gateway support
- Notifications: Firebase Cloud Messaging or OneSignal

## Current Architecture

This repo is now a working full-stack prototype:

- Frontend: React + Vite + TypeScript
- Backend: Node.js HTTP API in [`server/index.js`](server/index.js)
- Persistence: file-backed JSON store in `server/data/store.json`
- Frontend state hydration: [`src/app/state/AiosAppContext.tsx`](src/app/state/AiosAppContext.tsx)
- API client: [`src/app/lib/api.ts`](src/app/lib/api.ts)

This is a practical prototype backend, not yet the final production stack from the blueprint. The production path would still be NestJS + PostgreSQL + Prisma.

## Run Locally

- Frontend only: `npm run dev`
- Frontend dev server explicitly: `npm run dev:client`
- Backend API: `npm run dev:server`
- Production frontend build: `npm run build`
- Start backend server: `npm start`

During frontend development, Vite proxies `/api` requests to `http://localhost:3001`.

## Backend API

The backend currently supports:

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/dashboard/brief`
- `GET /api/vendors`
- `GET /api/products`
- `POST /api/assistant/query`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart`
- `POST /api/orders`
- `PATCH /api/tasks/:id/toggle`
- `POST /api/tasks`
- `PATCH /api/habits/:id/toggle`
- `POST /api/health/water/log`
- `PATCH /api/workouts/:id/toggle`
- `PATCH /api/meals/:id/toggle`
- `POST /api/mood`
- `POST /api/reset`

See [guidelines/AIOS-API.md](guidelines/AIOS-API.md) for a quick endpoint guide.

## Roadmap

### Phase 1

- auth and onboarding
- dashboard
- AI assistant v1
- nearby marketplace
- simple order flow
- routine planner
- health score basics

### Phase 2

- delivery tracking
- calendar sync
- spending tracker
- AI memory
- mood mode
- personalized recommendations

### Phase 3

- family mode
- rewards and streaks
- smart pantry
- voice assistant
- vendor analytics

### Phase 4

- predictive ordering
- auto mode
- wearable integrations
- camera nutrition and posture features
- advanced life summaries and goal coaching

## Business Potential

AIOS is more than a showcase UI. It can be positioned as:

- a local commerce platform
- a premium AI lifestyle subscription
- a wellness and productivity assistant
- a household operating system for families

Revenue can come from:

- marketplace commissions
- delivery fees
- AI Pro subscription
- vendor promotion tools
- health or finance premium features

## Demo Story

The strongest demo is a single user journey:

1. User opens AIOS and sees a daily brief on the dashboard.
2. They tell the assistant: `Plan my evening and order dinner`.
3. AIOS checks time, budget, health goals, weather, and nearby stores.
4. It suggests food, updates the routine, adds a reminder, and tracks the order.
5. At night, AIOS shows a recap with health, productivity, and spending insights.

## Detailed Blueprint

See [guidelines/AIOS-Blueprint.md](guidelines/AIOS-Blueprint.md) for:

- feature roadmap
- screen map
- system architecture
- AI workflow
- data model
- monetization ideas
- startup pitch summary
