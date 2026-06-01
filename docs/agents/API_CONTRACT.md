# API Contract

This file is the agent-facing source of truth for current HTTP API routes. Update it whenever `server/api/**` changes.

## Routes

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
