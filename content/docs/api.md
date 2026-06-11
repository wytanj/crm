---
title: API Documentation
description: Stable HTTP routes for the web app, integrations, and future MCP-facing tools.
kicker: API
---

## Response Modes

The API can run in two modes:

- `demo`: returned when Supabase credentials are missing or demo fallback data is used.
- `supabase`: returned when service credentials are configured and database reads succeed.

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

## GET /api/crm/bootstrap

Loads the CRM operating surface for the current workspace.

Returns:

- workspace summary
- metrics
- entity records
- relationship records
- entity type and field definitions
- integration backlog
- pending agent proposals

Use this route to hydrate dashboards, agent context windows, and setup screens.

## GET /api/graph/search

Searches graph entities by label, tags, normalized attributes, and type context.

Query parameters:

| Parameter | Type | Notes |
| --- | --- | --- |
| `q` | string | Optional search text. Whitespace is trimmed before execution. |

Typical use:

```http
GET /api/graph/search?q=shopify
```

## POST /api/schema/fields

Creates or stages field definitions for entity types. Agent-origin schema changes should be treated as proposals unless the agent has explicit grants.

Payload:

```json
{
  "entityType": "person",
  "key": "preferred_channel",
  "label": "Preferred channel",
  "type": "text",
  "required": false,
  "origin": "agent"
}
```

Allowed field types:

- `text`
- `number`
- `boolean`
- `date`
- `json`
- `reference`

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
