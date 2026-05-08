# AIOS API Guide

## Backend Location

- Entry server: `server/index.js`
- Router: `server/router.js`
- Persistence: `server/store.js`
- Auth helpers: `server/auth.js`
- Payments: `server/payments.js`
- AI integration: `server/ai.js`
- Seed data: `server/seed-data.js`

## Storage Model

The backend supports two persistence modes:

- file mode: `server/data/store.json`
- PostgreSQL mode: enabled when `DATABASE_URL` is set

The store is now multi-user and includes:

- `platform`
  - vendors
  - products
- `users`
- `userStates`
  - profile
  - mood
  - tasks
  - habits
  - workouts
  - meals
  - health
  - finance
  - notifications
  - orders
  - cart
- `payments`
- `auditEvents`

## Core Endpoints

### Health, Monitoring, and Session

- `GET /api/health`
- `GET /metrics`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/demo-credentials`

### Bootstrap and Intelligence

- `GET /api/bootstrap`
- `GET /api/dashboard/brief`
- `POST /api/assistant/query`

### Marketplace

- `GET /api/vendors?category=food&search=pizza`
- `GET /api/products?category=groceries`
- `GET /api/products?vendorId=vendor-green`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart`
- `POST /api/orders`
- `POST /api/payments/checkout`
- `GET /api/payments/history`

### Routine and Wellness

- `PATCH /api/tasks/:id/toggle`
- `POST /api/tasks`
- `PATCH /api/habits/:id/toggle`
- `POST /api/health/water/log`
- `PATCH /api/workouts/:id/toggle`
- `PATCH /api/meals/:id/toggle`
- `POST /api/mood`

### Admin and Vendor

- `GET /api/admin/overview`
- `GET /api/admin/users`
- `GET /api/admin/vendors`
- `GET /api/vendor/dashboard`
- `POST /api/vendor/products`
- `PATCH /api/vendor/products/:id`

### Reset

- `POST /api/reset`

This resets the persisted JSON store back to the seed data.

## Example Requests

### Login

```json
POST /api/auth/login
{
  "email": "alex@aios.app",
  "password": "demo1234"
}
```

### Query the assistant

```json
POST /api/assistant/query
{
  "query": "Order me a healthy dinner under $15"
}
```

### Add a cart item

```json
POST /api/cart/items
{
  "productId": "product-bowl",
  "delta": 1
}
```

### Checkout with payment

```json
POST /api/payments/checkout
{
  "paymentMethod": "cash_on_delivery"
}
```

### Add a task

```json
POST /api/tasks
{
  "section": "evening",
  "title": "Stretch for 10 minutes"
}
```

### Log water

```json
POST /api/health/water/log
{
  "amount": 1
}
```

## Frontend Integration

The frontend bootstraps from:

- `src/app/lib/api.ts`
- `src/app/state/AiosAppContext.tsx`

Behavior:

- on load, the app tries `GET /api/bootstrap`
- if the backend is not running, the frontend falls back to local seed state
- user actions update local UI immediately and also try to sync to the backend
- assistant queries try the backend first and fall back locally if needed
