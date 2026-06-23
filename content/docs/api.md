---
title: API Documentation
description: Stable HTTP routes for the web app, integrations, and future MCP-facing tools.
kicker: API
---

## Response Modes

The API can run in two modes:

- `demo`: returned when Supabase server credentials are missing or demo fallback data is used.
- `supabase`: returned when `SUPABASE_DB_URL` or server-only Supabase credentials are configured and database reads succeed.

Agents and integrations should always check `mode` before assuming writes persisted to a real workspace.

## POST /api/v1/events

Accepts idempotent source-system facts from POS, loyalty, ecommerce, partner channels, or future integration workers.

Payload:

```json
{
  "eventId": "pos_sale_123",
  "eventType": "pos.sale.completed",
  "workspaceId": "optional uuid for Supabase writes",
  "sourceSystem": "pos",
  "occurredAt": "2026-06-11T04:00:00.000Z",
  "idempotencyKey": "pos:store_001:txn_123",
  "actor": { "type": "system", "id": "pos" },
  "subject": {
    "customerKey": "crm:person_123",
    "externalCustomerRefs": [
      { "system": "pos", "id": "cust_123" }
    ]
  },
  "context": {
    "channel": "pos",
    "country": "SG",
    "currency": "SGD"
  },
  "payload": {},
  "schemaVersion": 1
}
```

When Supabase is configured, the route upserts into `crm_events` by workspace, source system, and idempotency key.

## GET /api/v1/people/[person_id]

Returns the customer/person read model for identity, external references, attributes, consent, and current profile context.

## GET /api/v1/people/[person_id]/timeline

Returns customer facts as a timeline. The persisted source is `crm_customer_facts`, with demo fallback data available for local use.

## GET /api/v1/people/[person_id]/computed-profile

Returns the computed customer profile, including activity, value, affinity, intent, metric values, provenance, and sensitivity level.

## GET /api/v1/people/[person_id]/counter-profile

Returns the POS-safe profile projection for one person. Supabase-backed reads require `workspaceId`, a bearer access token, and workspace membership. Only fields marked `pos_visible` are returned. Advisory warnings are informational and should not block checkout by default.

## PATCH /api/v1/people/[person_id]/profile-fields

Updates installed pack fields for one person.

Payload:

```json
{
  "workspaceId": "workspace uuid",
  "packKey": "skincare",
  "fields": {
    "skin_type": "Combination",
    "skin_concerns": ["Acne", "Pigmentation"],
    "reported_sensitivities": ["retinol", "fragrance"]
  },
  "sourceSystem": "crm_ui"
}
```

The route validates fields against the installed pack, updates `crm_entities.attributes.profile_packs`, and writes `crm_customer_facts` rows for provenance.

## GET /api/crm/bootstrap

Loads the CRM operating surface for the current workspace.

Supabase-backed calls pass `workspaceId` and `Authorization: Bearer <access_token>`. The user must be a member of that workspace. Without a workspace ID, the route stays in demo mode. Server persistence uses `SUPABASE_DB_URL` when present, otherwise `SUPABASE_SERVICE_ROLE_KEY`.

Returns:

- workspace summary
- metrics
- entity records
- relationship records
- entity type and field definitions
- profile pack definitions
- integration backlog
- pending agent proposals

Use this route to hydrate dashboards, agent context windows, and setup screens.

## GET /api/crm/workspaces

Returns the signed-in user's CRM workspaces and whether setup is required.

Response fields:

- `mode`
- `requiresSetup`
- `user`
- `workspaces`

In Supabase mode this route requires a bearer access token. In demo mode it returns a demo workspace. Server persistence uses `SUPABASE_DB_URL` when present, otherwise `SUPABASE_SERVICE_ROLE_KEY`.

## POST /api/crm/workspaces

Creates the hosted user's master company workspace.

Payload:

```json
{
  "companyName": "Acme Retail",
  "slug": "acme-retail",
  "plan": "hosted_growth"
}
```

The route creates the workspace, owner membership, initial field definitions, planned data sources, trial subscription boundary, billing-customer boundary, and audit event. It is the first step after hosted sign-in.

## GET /api/graph/search

Searches graph entities by label, tags, normalized attributes, and type context.

Query parameters:

| Parameter | Type | Notes |
| --- | --- | --- |
| `q` | string | Optional search text. Whitespace is trimmed before execution. |
| `workspaceId` | uuid | Required for Supabase-backed workspace search. |

Typical use:

```http
GET /api/graph/search?q=shopify
```

## GET /api/profile-packs

Lists registered profile packs with workspace install state. Demo mode returns the built-in registry.

## GET /api/profile-packs/[pack_key]

Returns one dynamic pack definition. `skincare` is the first fixture, but route logic is pack-key driven.

## POST /api/profile-packs/[pack_key]/install

Installs a registered pack into a workspace. Supabase-backed installs require a bearer token and `owner` or `admin` role. The operation is idempotent and writes an audit event.

## POST /api/schema/fields

Creates or stages field definitions for entity types. Agent-origin schema changes should be treated as proposals unless the agent has explicit grants.

Payload:

```json
{
  "workspaceId": "workspace uuid",
  "entityType": "person",
  "key": "preferred_channel",
  "label": "Preferred channel",
  "type": "text",
  "required": false,
  "origin": "agent",
  "packKey": "optional_pack_key",
  "sensitivityLevel": "internal",
  "posVisible": false,
  "cashierEditable": false,
  "marketingUsable": false,
  "enumValues": []
}
```

Allowed field types:

- `text`
- `number`
- `boolean`
- `email`
- `phone`
- `date`
- `json`
- `enum`
- `single_select`
- `multi_select`
- `tag_list`

Supabase-backed writes require a bearer access token and an `owner` or `admin` workspace role. Server persistence uses `SUPABASE_DB_URL` when present, otherwise `SUPABASE_SERVICE_ROLE_KEY`.

## POST /api/billing/checkout

Creates the hosted signup boundary. Billing is demo-first in this iteration. The hosted tier is free for now, with a planned $9/month tier later.

Payload:

```json
{
  "plan": "hosted_growth",
  "email": "operator@example.com"
}
```

Accepted plans:

- `hosted_growth`
- `hosted_scale`

Demo mode returns a local checkout URL so the UI can complete the signup flow without live Stripe credentials.
