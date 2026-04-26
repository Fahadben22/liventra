# Liventra

Multi-tenant SaaS for property and rental management. Targets GCC markets (Saudi Arabia, UAE, Egypt) — Arabic-localized, WhatsApp OTP, regional compliance (ZATCA, Ejari, FTA).

---

## System architecture

```
                     ┌──────────────────────────────────┐
                     │         liv-entra-api            │
                     │  Node ≥20 · Express · Supabase   │
                     │  Railway · Port 3000             │
                     └──────────────┬───────────────────┘
                                    │ REST  /api/v1
        ┌───────────────┬───────────┼───────────┬──────────────────┐
        │               │           │           │                  │
┌───────▼──────┐ ┌──────▼──────┐ ┌─▼──────┐ ┌─▼──────────┐
│ admin        │ │ dashboard   │ │ owner  │ │ tenant     │
│ Super-admin  │ │ Staff app   │ │ Portal │ │ Portal     │
│ (internal)   │ │ (customers) │ │        │ │            │
│ Next 16      │ │ Next 14     │ │ Next 14│ │ Next 14    │
│ React 19     │ │ React 18    │ │ React18│ │ React 18   │
│ Tailwind v4  │ │ Tailwind v3 │ │ TW v3  │ │ TW v3      │
│ Secret-key   │ │ OTP (phone) │ │ OTP+co.│ │ OTP (phone)│
└──────────────┘ └─────────────┘ └────────┘ └────────────┘
```

### What each portal does

| Repo | Who uses it | Purpose |
|---|---|---|
| `liv-entra-api` | — | Single backend for all portals |
| `liv-entra-admin` | Fahad (internal) | Manage all customer companies, billing, feature flags, AI agents |
| `liv-entra-dashboard` | Customer staff | Day-to-day: properties, units, leases, payments, maintenance, leads |
| `liv-entra-owner` | Property owners | View portfolio, approve maintenance & POs, review owner statements |
| `liv-entra-tenant` | Renters | Pay rent, submit maintenance tickets, request renewal/moveout |

> **Vocabulary note:** "tenant" in this codebase means **the renter** (end user of the rental unit), not the SaaS-multi-tenancy sense. The SaaS customer is called a **company**.

---

## Local development

### Prerequisites

- Node ≥ 20
- npm
- A Supabase project (get `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` from project settings)
- Redis (or use Upstash free tier for `REDIS_URL`)

### Start the backend

```bash
cd liv-entra-api
cp .env.example .env        # fill in required vars (see ENVIRONMENT.md)
npm install
npm run dev                 # node --watch src/index.js on port 3000
```

### Start a frontend

```bash
cd liv-entra-dashboard      # or admin / owner / tenant
cp .env.local.example .env.local
npm install
npm run dev
```

Default ports (set in each `package.json`):

| Service | Port |
|---|---|
| api | 3000 |
| dashboard | 3001 |
| admin | 3002 |
| owner | 3003 |
| tenant | 3004 |

### Minimal local env (to boot without errors)

Backend — three vars are required at startup or the process exits:
```
JWT_SECRET=any-random-string-32-chars-min
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPER_ADMIN_SECRET=any-random-string
```

Frontends — one var each:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

See [ENVIRONMENT.md](ENVIRONMENT.md) for the full catalog.

---

## Auth model

All auth is stateless JWT. OTP is delivered via WhatsApp (Meta Cloud API).

| User type | Portal | Token key | Login flow |
|---|---|---|---|
| `staff` | dashboard | `pm_token` | Phone → WhatsApp OTP → JWT |
| `owner` | owner | `owner_token` | Phone → WhatsApp OTP → company picker → JWT |
| `tenant` | tenant | `tenant_token` | Phone → WhatsApp OTP → JWT |
| `admin_user` | admin | `admin_token` | Secret key → JWT |

**Staff roles** (within a company): `admin`, `manager`, `accountant`, `leasing_agent`, `maintenance_coordinator`, `viewer`.

Token payload always contains: `type`, `id`, `company_id`, `role`, `phone`/`email`.

---

## Production deployment

All services run on **Railway**. Each repo is a separate Railway service.

| Service | Production URL |
|---|---|
| API | `https://liv-entra-api-production.up.railway.app` |
| Dashboard | `https://app.liv-entra.com` (subdomain routing: `{slug}.app.liv-entra.com`) |
| Admin | `https://admin.liv-entra.com` |
| Owner | `https://owner.liv-entra.com` |
| Tenant | `https://tenant.liv-entra.com` |

Database: **Supabase** (PostgreSQL + Row Level Security). Redis: configured via `REDIS_URL` in Railway.

---

## Key integrations

| Integration | Purpose | Config var(s) |
|---|---|---|
| Supabase | Database + RLS | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` |
| WhatsApp Cloud API | OTP delivery + tenant AI | `SYSTEM_WHATSAPP_TOKEN`, `SYSTEM_WHATSAPP_PHONE` |
| Anthropic Claude | Contract parsing, maintenance descriptions, market data, agents | `ANTHROPIC_API_KEY` |
| Moyasar | Primary payment gateway | Via `payment_gateway_configs` table |
| Tap Payments | Secondary gateway | Via `payment_gateway_configs` table |
| Stripe | Third gateway | Via `payment_gateway_configs` table |
| Ejari | Saudi rental registration | Configured per company in DB |
| ZATCA | Saudi e-invoice compliance | Configured per company in DB |
| Sentry | Error tracking (API + dashboard) | `SENTRY_DSN` |
| Cloudflare | IP blocking via security agent | `CLOUDFLARE_API_KEY`, `CLOUDFLARE_ZONE_ID` |
| Resend | Transactional email (alt to SMTP) | `RESEND_API_KEY` |

---

## Database migrations

SQL migration files live in `liv-entra-api/sql/`. Files are numbered sequentially (e.g. `030_maintenance_flows.sql`). Run them in order against your Supabase project via the SQL editor or `psql`.

---

## Codebase notes

- **No shared frontend package.** All 4 frontends have their own `lib/api.ts` and `lib/auth.tsx`. Cross-cutting changes need to be applied to each independently.
- **Two Next.js generations in play.** `liv-entra-admin` runs Next 16 + React 19 (see `AGENTS.md` in that repo for caveats). The other three run Next 14 + React 18. Don't copy-paste patterns between them without checking.
- **Demo mode.** Setting `DEMO_MODE=true` on the backend enables separate route sets, seeded data, and per-session isolation. Never enable in production.
- **Subdomain multi-tenancy.** The dashboard uses `src/middleware.ts` to route `{slug}.app.liv-entra.com` → company context via a cookie.
