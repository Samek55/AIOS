# AIOS Operations

## Local services

- Web app: `npm run dev`
- Backend API: `npm run dev:server`
- PostgreSQL: `docker compose up -d`
- Mobile app: `npm run dev:mobile`

## Monitoring

- Liveness: `GET /api/health`
- Metrics: `GET /metrics`
- Key counters:
  - `aios_http_requests_total`
  - `aios_auth_logins_total`
  - `aios_auth_failures_total`
  - `aios_assistant_queries_total`
  - `aios_orders_placed_total`
  - `aios_payments_created_total`
  - `aios_payments_succeeded_total`

## Security controls in this prototype

- Signed bearer tokens for auth
- Password hashing with `scrypt`
- Role-based access for customer, vendor, and admin routes
- In-memory rate limiting on auth, assistant, and checkout endpoints
- Security headers and CORS allowlist support

## Production next steps

- Rotate `AUTH_SECRET`
- Store sessions/revocations centrally if you need hard logout
- Add Stripe client-side confirmation for live card payments
- Put a reverse proxy in front for TLS and request buffering
- Add persistent log shipping and alerting around `/metrics`
