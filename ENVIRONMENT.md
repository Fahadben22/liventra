# Environment Variables

Complete reference for all services. Copy the relevant `.env.example` / `.env.local.example` from each repo as your starting point.

---

## liv-entra-api

### Required — server exits on startup if missing

| Variable | Description |
|---|---|
| `JWT_SECRET` | Signs all JWTs. Generate with `openssl rand -hex 32`. |
| `SUPABASE_URL` | Your Supabase project URL (`https://xxx.supabase.co`). |
| `SUPABASE_SERVICE_KEY` | Service role key — bypasses RLS. Keep secret. |
| `SUPER_ADMIN_SECRET` | Legacy super-admin login secret. Generate with `openssl rand -hex 32`. |

### Server

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP listen port. |
| `NODE_ENV` | `development` | `production` enables combined logging, hides stack traces. |
| `ALLOWED_ORIGINS` | — | Comma-separated CORS origins. Set to your frontend URLs in production. |

### JWT

| Variable | Default | Description |
|---|---|---|
| `JWT_EXPIRES_IN` | `7d` | Access token lifetime. |
| `ADMIN_JWT_SECRET` | falls back to `JWT_SECRET` | Separate secret for admin-panel tokens. Set in production to isolate admin sessions. |

### Supabase (extended)

| Variable | Description |
|---|---|
| `SUPABASE_ANON_KEY` | Anon key for public-facing endpoints. |
| `LEADS_SUPABASE_URL` | Separate Supabase project for leads data (Sales Agent). |
| `LEADS_SUPABASE_SERVICE_KEY` | Service key for the leads project. |

### Redis

| Variable | Default | Description |
|---|---|---|
| `REDIS_URL` | `redis://localhost:6379` | Used for rate limiting and OAuth state. Failure is non-blocking in dev. |

### Email — pick one method

**Nodemailer / SMTP (GoDaddy or any SMTP):**

| Variable | Default | Description |
|---|---|---|
| `SMTP_HOST` | `smtpout.secureserver.net` | SMTP server hostname. |
| `SMTP_PORT` | `465` | SMTP port. |
| `SMTP_SECURE` | `true` | Use TLS. |
| `SMTP_USER` | — | SMTP username / sender address. |
| `SMTP_PASS` | — | SMTP password. |
| `EMAIL_FROM` | `Liventra OS <noreply@liv-entra.com>` | From header in all outbound emails. |

**Resend (alternative, used in agent emails and templates):**

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key. If set, Resend is used instead of SMTP for those paths. |
| `FROM_EMAIL` | Resend sender address (defaults to `Liventra OS <onboarding@resend.dev>`). |

### AI

| Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Claude API. Used in: contract parsing, maintenance description rewriting, market data fallback, property subdivision AI, intelligence briefings, agents. |
| `GITHUB_TOKEN` | — | GitHub Models token. Used for gpt-4o-mini in WhatsApp intent classification. |
| `AI_MODEL` | `claude-sonnet-4-20250514` | Override the Claude model used in intelligence controller. |

### WhatsApp

| Variable | Default | Description |
|---|---|---|
| `SYSTEM_WHATSAPP_TOKEN` | — | Meta WhatsApp Cloud API token. Used for OTP delivery. **Required for login to work.** |
| `SYSTEM_WHATSAPP_PHONE` | — | WhatsApp sender phone number ID. |
| `WHATSAPP_API_URL` | — | Custom WA API base URL (if not using Meta Cloud). |
| `WHATSAPP_API_TOKEN` | — | Token for custom WA API. |
| `WHATSAPP_PHONE_NUMBER_ID` | — | Phone number ID for custom WA API. |
| `WHATSAPP_VERIFY_TOKEN` | `liventra-wb-verify-2026` | Used to verify Meta webhook subscription. |
| `WHATSAPP_APP_SECRET` | — | Meta app secret for webhook signature validation. |
| `WHATSAPP_API_VERSION` | `v19.0` | Meta Graph API version. |

### Payment gateways

Credentials are stored in the `payment_gateway_configs` DB table (managed via the admin UI). These env vars are only for fallback / direct gateway code paths:

| Variable | Description |
|---|---|
| `MOYASAR_SECRET_KEY` | Used for Moyasar webhook signature verification fallback. |
| `TAP_SECRET_KEY` | Used by `tap.gateway.js` test connection. |
| `TAP_WEBHOOK_SECRET` | Tap webhook signature validation. |
| `STRIPE_SECRET_KEY` | Stripe connection test + webhook validation. |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature validation. |

### Lead scraping (Sales Agent)

| Variable | Description |
|---|---|
| `OUTSCRAPER_API_KEY` | [outscraper.com](https://outscraper.com) — Google Maps data (phone, email, website). |
| `SERPER_API_KEY` | [serper.dev](https://serper.dev) — Google Search queries. |
| `HUNTER_API_KEY` | [hunter.io](https://hunter.io) — Email enrichment from domain. |
| `APOLLO_API_KEY` | [apollo.io](https://apollo.io) — Phone enrichment. |

### Portal URLs (used in notification links)

| Variable | Default |
|---|---|
| `API_BASE_URL` | `https://liv-entra-api-production.up.railway.app/api/v1` |
| `DASHBOARD_BASE_URL` | `https://app.liv-entra.com` |
| `DASHBOARD_URL` | `https://app.liv-entra.com/dashboard/maintenance` |
| `ADMIN_URL` | `https://admin.liv-entra.com` |
| `ADMIN_BASE_URL` | `https://admin.liv-entra.com` |
| `OWNER_PORTAL_URL` | `https://owner.liv-entra.com` |
| `TENANT_PORTAL_URL` | `https://tenant.liv-entra.com` |

### Canva integration

| Variable | Description |
|---|---|
| `CANVA_CLIENT_ID` | Canva Connect app client ID. |
| `CANVA_CLIENT_SECRET` | Canva Connect app client secret. |

### Cloudflare (Security Agent — IP blocking)

| Variable | Description |
|---|---|
| `CLOUDFLARE_API_KEY` | Global API key or API token with Zone/Firewall write. |
| `CLOUDFLARE_ZONE_ID` | Your domain's Cloudflare Zone ID. |
| `CLOUDFLARE_EMAIL` | Account email (required with Global API key). |

### Monitoring and alerts

| Variable | Description |
|---|---|
| `SENTRY_DSN` | Sentry project DSN. Optional but recommended in production. |
| `SENTRY_ORG` | Sentry org slug (for source map uploads). |
| `SENTRY_PROJECT` | Sentry project slug. |
| `SECURITY_ALERT_EMAIL` | Receives critical security event emails. |
| `FAHAD_EMAIL` | Personal alert destination (falls back to `SECURITY_ALERT_EMAIL`). |
| `SALES_ALERT_EMAIL` | Receives new lead / sales event alerts. |
| `ADMIN_WHATSAPP` | WhatsApp phone for scheduler alerts to admin. |
| `ADMIN_ALERT_PHONE` | Phone for Twilio-based voice/SMS alerts. |

### Twilio (optional — voice/SMS alerts)

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Twilio account SID. |
| `TWILIO_AUTH_TOKEN` | Twilio auth token. |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp sender (default: `whatsapp:+14155238886`). |

### Misc

| Variable | Default | Description |
|---|---|---|
| `DEMO_MODE` | `false` | Set to `true` to enable demo routes and isolated sessions. **Never use in production.** |
| `SCHEDULER_TIMEZONE` | `Asia/Riyadh` | Timezone for cron job scheduler. |
| `MAINTENANCE_APPROVAL_THRESHOLD` | `500` | SAR amount above which maintenance costs require owner approval. |
| `LOG_TO_FILE` | `false` | Set to `true` to write logs to files (explicit opt-in). |
| `PUPPETEER_EXECUTABLE_PATH` | — | Path to Chromium binary on Railway (set automatically by Railway buildpack). |
| `BANK_DETAILS` | hardcoded fallback | Bank account details string printed on invoices. |

---

## liv-entra-dashboard

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL. Use `http://localhost:3000/api/v1` locally. |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry frontend DSN. |
| `SENTRY_ORG` | No | For source map uploads at build time. |
| `SENTRY_PROJECT` | No | For source map uploads at build time. |
| `SENTRY_AUTH_TOKEN` | No | For source map uploads at build time. |

---

## liv-entra-admin

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL. |
| `NEXT_PUBLIC_SMTP_HOST` | No | Displayed in the template-center UI as the current SMTP host. |

---

## liv-entra-owner

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL. |
| `NEXT_PUBLIC_OWNER_PIN` | No | Quick-access PIN for dev/demo (bypasses OTP). **Do not set in production.** |
| `NEXT_PUBLIC_OWNER_API_KEY` | No | Read-only API key for owner portal (if used). |

---

## liv-entra-tenant

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL. |
