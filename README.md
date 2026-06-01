# Open Spine CRM

A headless open CRM for B2C and B2B customer data. The core is designed as a graph-backed data spine with an API layer now and MCP-facing boundaries later.

## Principles

- Graph first: people, companies, households, orders, products, tickets, messages, and campaigns are entities connected through typed relationships.
- API layer first: UI, integrations, and agents should read/write through stable API contracts instead of being coupled to page state.
- Open source by default: self-host with Supabase keys and the SQL migration in `supabase/migrations`.
- Hosted plan optional: hosted workspaces are free for now, with a planned $9/month tier for managed hosting and integrations.
- Schema-flexible: minimal Shopify-like customer fields are provided, but teams and agents can define custom entity schemas and fields.

## Agent Docs

Agent-facing contracts live in `AGENTS.md` and `docs/agents/`. When API routes, database schema, or agent workflows change, update those docs in the same change.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Apply `supabase/migrations/0001_headless_crm.sql` to your Supabase project, then set:

```bash
NUXT_PUBLIC_SUPABASE_URL=...
NUXT_PUBLIC_SUPABASE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Hosted billing can run in demo mode for local development. To enable real checkout, provide Stripe keys and wire the `/api/billing/checkout` handler to your Stripe account.
