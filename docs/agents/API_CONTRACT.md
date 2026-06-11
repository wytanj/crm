# API Contract

This file is the agent-facing source of truth for current HTTP API routes. Update it whenever `server/api/**` changes.

## Routes

### `POST /api/v1/events`

Accepts source-system facts from POS, loyalty, ecommerce, partner channels, or future integration workers.

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

Rules:

- `eventId`, `sourceSystem`, and `idempotencyKey` are required.
- `occurredAt` must be an ISO datetime.
- Without Supabase credentials or `workspaceId`, the route returns a demo accepted response.
- With Supabase credentials, the route upserts into `crm_events` by `(workspace_id, source_system, idempotency_key)`.

### `GET /api/v1/people/[person_id]`

Returns a customer/person read model with identity, attributes, consent summary, and profile context.

Fallback behavior:

- Without Supabase credentials or when `person_id` is not a UUID, the route returns the demo customer profile.

### `GET /api/v1/people/[person_id]/timeline`

Returns a customer timeline from `crm_customer_facts`.

Fallback behavior:

- Without Supabase credentials or when no persisted facts are available, the route returns a demo timeline.

### `GET /api/v1/people/[person_id]/computed-profile`

Returns computed customer profiles from `crm_customer_profiles`, including activity, value, affinity, intent, metric values, provenance, and sensitivity level.

Fallback behavior:

- Without Supabase credentials or when no computed profile exists, the route returns the demo computed profile.

### `GET /api/crm/bootstrap`

Loads the current CRM operating surface.

Response shape:

- `mode`: `demo` or `supabase`.
- `graph.metrics`: dashboard metrics.
- `graph.entities`: graph entities.
- `graph.relationships`: typed edges between entities.
- `graph.customerFields`: base and custom field definitions.
- `graph.integrationBacklog`: planned or connected integration surfaces.
- `graph.proposals`: agent proposal summaries.

Fallback behavior:

- If Supabase service credentials are missing, this route returns demo data.
- If Supabase returns an entity or relationship error, this route returns demo data with `warning`.

### `GET /api/graph/search`

Searches graph entities by label, tags, and normalized attributes.

Query:

- `q`: optional string. Whitespace is trimmed.

Fallback behavior:

- Without Supabase credentials, search runs against demo graph data.
- Empty `q` returns the first demo entities.

### `POST /api/schema/fields`

Creates or stages a field definition for an entity type.

Payload:

```json
{
  "workspaceId": "optional uuid for Supabase writes",
  "entityType": "person",
  "key": "preferred_channel",
  "label": "Preferred channel",
  "type": "text",
  "required": false,
  "origin": "agent"
}
```

Rules:

- `key` must match `^[a-z][a-z0-9_]*$`.
- `type` must be one of `text`, `number`, `date`, `boolean`, `email`, `phone`, `json`, or `enum`.
- `origin` defaults to `custom` and may be `agent` when an agent proposes the field.
- Without Supabase credentials or `workspaceId`, the route returns a demo field response.

### `POST /api/billing/checkout`

Creates a hosted-plan checkout boundary.

Payload:

```json
{
  "email": "founder@example.com",
  "plan": "hosted_growth"
}
```

Rules:

- `plan` must be `hosted_growth` or `hosted_scale`.
- The hosted tier is free now, with a planned $9/month price later.
- In `demo` billing mode or incomplete Stripe configuration, the route returns a demo checkout URL.
- When live billing config exists, the route currently returns a manual integration boundary instead of calling Stripe directly.

## Documentation Rule

Any added, removed, or behavior-changing API route must be reflected here in the same commit.

Public app reference: `/docs/api`.
