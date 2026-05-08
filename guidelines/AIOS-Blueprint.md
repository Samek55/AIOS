# AIOS Product Blueprint

## One-Line Positioning

AIOS is an AI powered life operating system that helps people order locally, manage routines, improve health, control spending, and get personalized guidance from one assistant.

## Product Thesis

Users do not want more apps. They want fewer decisions.

AIOS wins if it becomes the layer that connects intent to action:

- intent: "I need dinner and I am exhausted"
- context: time, location, weather, goals, budget, past habits
- action: suggest, order, schedule, remind, track, summarize

The product should feel like a practical companion, not a bundle of disconnected dashboards.

## Target Users

### Primary user

Busy students and young professionals who:

- order food often
- struggle with consistency in routine
- want simple health guidance
- need help budgeting and planning
- like convenience more than manual tracking

### Secondary user

Small families or couples who want:

- shared grocery and food ordering
- household reminders
- medication and wellness nudges
- one place for tasks and spending visibility

## Core Jobs To Be Done

1. Help me decide what to do next.
2. Help me order what I need from nearby.
3. Help me stay healthy without a lot of manual logging.
4. Help me keep my day organized.
5. Help me avoid overspending.
6. Help me feel that my app understands me over time.

## Product Principles

- Act on behalf of the user when confidence is high.
- Ask short follow-up questions only when needed.
- Use context before asking the user to repeat themselves.
- Blend convenience, wellness, and commerce in the same flow.
- Keep the home screen focused on "what matters now".
- Reward consistency more than raw activity.

## Experience Pillars

### 1. AI Assistant First

The assistant is the main control layer for the app.

It should:

- understand requests in natural language
- fetch relevant data across modules
- recommend next actions
- execute supported actions directly
- remember user preferences and patterns

### 2. Hyperlocal Marketplace

The marketplace should support discovery and action for:

- food delivery
- grocery and essentials
- pharmacy and wellness
- clothing and local retail
- services such as laundry or quick errands

### 3. Daily Life Dashboard

The dashboard should answer:

- what should I do next
- how is my day going
- what is arriving
- what am I behind on
- what is one useful action right now

### 4. Personalized Wellness

Wellness should include:

- activity
- hydration
- sleep
- workouts
- nutrition
- recovery
- mood check-ins

### 5. Financial Awareness

Finance matters because recommendations should understand budget.

Examples:

- recommend budget meals late in the month
- avoid suggesting expensive stores when spending is already high
- warn about repeated impulse purchases

## MVP Definition

The MVP should focus on connected value, not full feature count.

### Hero loop A: AI assisted dinner planning

The user says: `Order me a healthy dinner under $15`

System flow:

1. Parse intent and constraints.
2. Check health goal, budget, location, and vendor data.
3. Rank options.
4. Confirm and place order.
5. Track delivery.
6. Log meal to nutrition history.

### Hero loop B: AI day planning

The user says: `Plan my day`

System flow:

1. Pull calendar, tasks, habits, sleep, and energy state.
2. Create a practical plan with time blocks.
3. Let user accept or adjust.
4. Send smart reminders.
5. Generate a recap at night.

### Hero loop C: AI health check

The user says: `How am I doing today?`

System flow:

1. Combine steps, sleep, workouts, hydration, and mood.
2. Generate a health score with reasons.
3. Suggest one to three specific actions.
4. Keep guidance lightweight and actionable.

## Recommended Screen Map

These screens match the current route structure and show what each area should own.

### `/` Dashboard

Purpose:

- daily briefing
- next best actions
- current order status
- health and routine progress
- smart alerts

Key blocks:

- greeting and daily score
- quick actions
- AI insight card
- active order tracker
- schedule preview
- health snapshot
- mood check-in
- night recap card

### `/ai-assistant`

Purpose:

- conversational control center for the whole product

Key blocks:

- conversation stream
- quick prompts
- structured recommendation cards
- context chips for budget, health, location, and time
- action buttons such as order, add task, reschedule, log water

### `/marketplace`

Purpose:

- discover and order from nearby merchants

Key blocks:

- categories
- nearby vendors map and list
- promotions and time based deals
- smart ranking
- cart and checkout
- delivery tracking

### `/health`

Purpose:

- track body, activity, and recovery

Key blocks:

- health score
- step, sleep, hydration, and calorie cards
- workout suggestions
- meal guidance
- streaks
- risk or recovery insights

### `/routine`

Purpose:

- daily planning and personal consistency

Key blocks:

- tasks
- calendar timeline
- habits
- smart rescheduling
- focus sessions
- morning and night routines

### `/finance`

Purpose:

- spending visibility and budget coaching

Key blocks:

- monthly budget progress
- category breakdown
- order spend history
- alerts for overspending
- savings nudges

### `/social`

Purpose:

- motivation and lightweight community

Key blocks:

- challenge feed
- progress sharing
- friend activity
- local reviews
- team streaks

### `/profile`

Purpose:

- preference management and memory control

Key blocks:

- addresses
- dietary preferences
- health goals
- budget target
- shopping sizes and style
- notification settings
- privacy controls

## Features That Can Make AIOS Feel Exceptional

- mood mode that changes recommendations
- family mode for shared tasks and orders
- smart pantry to avoid unnecessary spending
- weather aware recommendations
- voice first actions such as "order my usual"
- night recap with health, productivity, and spending summary
- auto mode for high confidence repetitive actions
- AI wardrobe suggestions based on weather and occasion
- proactive medicine and pharmacy suggestions for sick day flows

## Product Roadmap

### Phase 1: Foundation

Goal: prove one cohesive daily assistant experience.

- user auth and profile setup
- dashboard with personalized cards
- assistant v1 with prompt templates and action cards
- vendor, product, cart, checkout, and order tracking models
- routine planner with tasks and reminders
- health score using simple rule based logic
- notifications and recap stubs

Success metric:

- users complete one assistant-driven task from start to finish

### Phase 2: Personalization

Goal: make the app feel like it knows the user.

- AI memory and preference store
- budget-aware suggestions
- mood based recommendations
- delivery ETAs and status updates
- calendar sync
- recommendation ranking improvements
- smarter summary generation

Success metric:

- returning users accept AI suggestions without heavy manual search

### Phase 3: Growth Loops

Goal: make usage habitual and shareable.

- streaks, points, and rewards
- social challenges and reviews
- family or shared household mode
- referral loops for local vendors
- saved routines and one tap modes

Success metric:

- weekly retention and repeat ordering increase together

### Phase 4: Intelligence Layer

Goal: move from assistant to trusted operator.

- voice assistant
- predictive ordering
- advanced health insights
- wearable integrations
- camera based food and posture support
- auto mode for routine tasks

Success metric:

- user completes repeated flows with one tap or zero tap

## Architecture Recommendation

### Front-End

- Web: React + Vite + TypeScript + Tailwind
- Mobile: Expo React Native + TypeScript + NativeWind
- Shared package: design tokens, API types, helper functions, analytics events

### Back-End

- API gateway and business logic: NestJS
- AI orchestration service: FastAPI
- Background jobs: BullMQ workers
- Real-time updates: WebSockets or Supabase real-time for delivery status and live cards

### Data and Infra

- PostgreSQL for primary relational data
- Prisma for schema and migrations
- Redis for cache, queue, and session support
- pgvector for embeddings and lightweight memory retrieval
- Object storage for images, receipts, avatars, and documents

### External Integrations

- maps and distance calculations
- payments
- push notifications
- calendar sync
- wearable and health data connectors
- vendor and delivery partner portals

## AI System Design

### AI service responsibilities

- intent classification
- entity extraction such as budget, time, category, distance, or food type
- recommendation ranking
- memory retrieval
- summary generation
- action planning

### AI modules

#### 1. Context Engine

Inputs:

- time
- day of week
- location
- weather
- calendar events
- health metrics
- spending status
- active orders

Output:

- normalized session context for assistant prompts and recommendation logic

#### 2. User Memory Layer

Stores:

- favorite vendors
- usual order times
- diet preferences
- sleep and workout patterns
- preferred budget range
- routine consistency

#### 3. Recommender Layer

Combines:

- vendor quality
- distance and ETA
- price
- past behavior
- health goals
- current budget state
- context such as weather or mood

#### 4. Action Orchestrator

Supported actions:

- create task
- update schedule
- place order
- log meal
- log water
- start workout
- set reminder
- generate recap

#### 5. Notification Engine

Should send useful notifications such as:

- rain is coming, order early
- you are behind on hydration
- you are close to your step goal
- your budget is trending high this week

## Suggested Data Model

Use PostgreSQL tables for the transactional system and pgvector for memory embeddings.

| Entity | Key fields | Purpose |
| --- | --- | --- |
| `users` | `id`, `email`, `phone`, `created_at` | auth identity |
| `user_profiles` | `user_id`, `name`, `dob`, `gender`, `city`, `timezone` | base profile |
| `user_preferences` | `user_id`, `diet`, `allergies`, `budget_level`, `style_tags`, `notification_prefs` | personalization |
| `addresses` | `id`, `user_id`, `label`, `lat`, `lng`, `is_default` | delivery and location |
| `vendors` | `id`, `name`, `category`, `lat`, `lng`, `rating`, `delivery_time_min` | local merchants |
| `products` | `id`, `vendor_id`, `name`, `category`, `price`, `inventory_status`, `metadata_json` | marketplace catalog |
| `orders` | `id`, `user_id`, `vendor_id`, `status`, `subtotal`, `delivery_fee`, `eta_at` | purchase lifecycle |
| `order_items` | `id`, `order_id`, `product_id`, `qty`, `unit_price` | line items |
| `tasks` | `id`, `user_id`, `title`, `due_at`, `status`, `priority`, `source` | routine planning |
| `habits` | `id`, `user_id`, `name`, `target_count`, `frequency`, `category` | recurring routines |
| `habit_logs` | `id`, `habit_id`, `logged_at`, `value` | completion history |
| `workouts` | `id`, `user_id`, `type`, `duration_min`, `intensity`, `calories_burned` | fitness tracking |
| `health_metrics` | `id`, `user_id`, `metric_type`, `value`, `recorded_at`, `source` | sleep, steps, hydration, weight |
| `nutrition_logs` | `id`, `user_id`, `order_id`, `meal_type`, `calories`, `protein_g`, `logged_at` | food awareness |
| `budgets` | `id`, `user_id`, `month`, `limit_total`, `limit_food`, `limit_shopping` | budget targets |
| `expenses` | `id`, `user_id`, `source_type`, `source_id`, `category`, `amount`, `spent_at` | spending ledger |
| `assistant_threads` | `id`, `user_id`, `title`, `last_active_at` | chat sessions |
| `assistant_messages` | `id`, `thread_id`, `role`, `content`, `action_json`, `created_at` | assistant history |
| `recommendations` | `id`, `user_id`, `kind`, `payload_json`, `accepted`, `created_at` | AI suggestions tracking |
| `notifications` | `id`, `user_id`, `type`, `title`, `body`, `sent_at`, `opened_at` | engagement and reminders |
| `reward_events` | `id`, `user_id`, `event_type`, `points`, `created_at` | gamification |

## Example API Surface

- `POST /assistant/query`
- `POST /assistant/actions/order`
- `POST /assistant/actions/task`
- `GET /dashboard/brief`
- `GET /marketplace/vendors/nearby`
- `POST /orders`
- `GET /orders/:id/tracking`
- `GET /health/summary/today`
- `POST /routine/tasks`
- `POST /routine/habits/log`
- `GET /finance/monthly-summary`

## Safety And Trust

This product handles personal data, health signals, and spending patterns, so trust matters.

Important guardrails:

- clear consent for health and location data
- explain why suggestions are shown
- allow users to disable memory categories
- require confirmation for sensitive actions
- avoid health diagnosis claims
- keep financial insights educational, not advisory

## Monetization Options

### Core monetization

- delivery and marketplace commissions
- premium AI assistant subscription
- sponsored vendor placement with strict labeling

### Expansion monetization

- family plan
- wellness plan
- vendor analytics dashboard
- white label version for local commerce networks

## North Star Metrics

- assistant to action conversion rate
- repeat orders per active user
- weekly active days per user
- routine completion rate
- 30 day retention
- average accepted recommendation rate

## Pitch Deck Summary

### Problem

Daily life is fragmented across too many apps for ordering, planning, health, and budgeting.

### Solution

AIOS is one AI powered assistant that understands intent and takes action across local commerce and daily life management.

### Product

An all-in-one app for nearby ordering, routines, wellness, and smart personal guidance.

### Why now

- users are comfortable with AI assistants
- local commerce is highly fragmented
- health, productivity, and budgeting habits are increasingly app driven

### Business model

Marketplace commission plus premium subscription.

### Moat

- user memory and personalization
- cross domain data advantage
- local vendor relationships
- habit and routine lock-in

### Go-to-market

- launch in one city or campus zone
- focus on food plus routine assistant first
- grow into groceries, pharmacy, retail, and family mode

## Recommended Build Plan For This Repo

If we keep building from the current front-end, the most sensible next execution order is:

1. define shared types for users, vendors, orders, tasks, and health stats
2. convert hardcoded UI data into typed mock data modules
3. add a simple state layer and route level loaders
4. wire the assistant page to structured command handling
5. build vendor listing, cart, and order status flow
6. add dashboard summary aggregation
7. connect auth, persistence, and backend APIs

## Immediate Next Features To Implement

- assistant command parser with action cards
- mock vendor dataset and nearby filtering
- cart and checkout state
- order tracking timeline
- routine task creation and completion
- health score calculation utility
- finance summary cards based on mock transactions
