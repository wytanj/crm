# Architecture Notes

Open Spine CRM treats CRM data as an operational graph rather than a page-bound sales tool.

## Core Graph

- `crm_entities`: people, companies, households, orders, products, tickets, messages, campaigns, and custom records.
- `crm_relationships`: typed edges such as `placed_order`, `works_at`, `opened_ticket`, `belongs_to_household`, or custom agent-created edges.
- `crm_field_definitions`: schema designed by teams, integrations, or agents without hardcoding every vertical into the core.
- `crm_agent_proposals`, `crm_approvals`, `crm_execution_logs`: the approval loop agents need before touching operational data.

## Minimal Customer Fields

The first customer contract mirrors the common data a Shopify merchant already understands:

- Identity: email, phone, first name, last name, tags, note.
- Consent: accepts marketing.
- Commerce state: orders count, total spent, currency, last order date.
- Address: default address as structured JSON.
- Source: source channel and external IDs.
- B2B extension: company name and lifecycle stage.

## Open Source And Hosted

Self-hosted teams apply the SQL migration and provide Supabase keys. Hosted teams use the same schema but pay for managed workspaces, billing, integration jobs, and support.

## MCP Direction

Future MCP servers should expose workspace-scoped tools around:

- Search graph entities.
- Read neighborhood around an entity.
- Propose a schema field.
- Stage a merge.
- Request approval.
- Execute an approved action.

The MCP layer should use the same audit and execution tables as the web app.

## Agent Documentation Maintenance

Agent-facing implementation details live in `docs/agents/`.

- API routes: `docs/agents/API_CONTRACT.md`
- Data model: `docs/agents/DATA_MODEL.md`
- Agent workflow and approvals: `docs/agents/AGENT_PROTOCOL.md`

Any code change that updates routes, schema, proposal behavior, or execution behavior should update the matching agent document in the same change.
