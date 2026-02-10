# Collections Case Manager

## Overview
This is a small collections operations system for creating delinquency cases, assigning them via rules, tracking actions, and generating PDF payment notices.

## Architecture
```
+------------------+        /api proxy         +-------------------+
|  Next.js Web     | ----------------------->  |  NestJS API        |
|  (App Router)    |                           |  /api/*            |
+--------+---------+                           +---------+---------+
         |                                                   |
         | Docker Compose                                    | Prisma
         v                                                   v
+------------------+                                 +------------------+
|  Postgres 15     | <-------------------------------|  Prisma Client   |
+------------------+                                 +------------------+
```

## One-Command Run (Docker)
```bash
docker compose up --build
```

- Web UI: `http://localhost:3000`
- Swagger: `http://localhost:3001/api/docs`

## Migrations + Seed
- Migrations are included under `prisma/migrations`.
- Compose runs migrations by default and then seeds.
- Toggle behavior via env:
  - `USE_MIGRATIONS=true|false`
  - `SEED_ON_START=true|false`

## Redis Cache
- Redis is included in `docker-compose.yml` and used for caching `/api/cases`, `/api/cases/:id`, and `/api/cases/kpi` (TTL 300s).
- Cache invalidation runs on case creation, assignment, and action log creation.

## Rules
Rules are JSON-configured at:
`apps/api/src/rules/delinquency-rules.json`

The API loads them at startup and stores every assignment decision in `RuleDecision`.

## API Endpoints
- `POST /api/cases` create case
- `GET /api/cases` list cases with filters + pagination
- `GET /api/cases/:id` case details (customer, loan, actions, decisions)
- `POST /api/cases/:id/actions` add action log
- `POST /api/cases/:id/assign` run assignment rules
- `GET /api/cases/kpi` KPI summary
- `GET /api/cases/:id/notice.pdf` PDF notice

## Curl Examples
Create Case:
```bash
curl -X POST http://localhost:3001/api/cases \
  -H 'Content-Type: application/json' \
  -d '{"customerId": 1, "loanId": 1}'
```

List Cases:
```bash
curl "http://localhost:3001/api/cases?page=1&limit=10&status=OPEN"
```

Add Action:
```bash
curl -X POST http://localhost:3001/api/cases/1/actions \
  -H 'Content-Type: application/json' \
  -d '{"type":"CALL","outcome":"PROMISE_TO_PAY","notes":"Customer promised to pay"}'
```

Assign Case:
```bash
curl -X POST http://localhost:3001/api/cases/1/assign
```

PDF Notice:
```bash
curl -o notice.pdf http://localhost:3001/api/cases/1/notice.pdf
```

## Postman
Import: `collections-case-manager.postman_collection.json`

## Trade-offs / Notes
- Offset pagination with stable ordering (`createdAt DESC, id DESC`).
- Rules are JSON-configured for simplicity; no admin UI yet.
- PDF generation uses headless Chromium in Docker.
