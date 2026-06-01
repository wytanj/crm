# Agent Operating Guide

Open Spine CRM is an open-source, headless, agentic CRM. Treat the Supabase database as the customer data spine and the Nuxt app as one client of that spine.

## Required Maintenance Rule

When a change touches any of these surfaces, update the matching documentation in the same change:

- API route behavior: update `docs/agents/API_CONTRACT.md`.
- Database tables, entity types, base fields, or relationships: update `docs/agents/DATA_MODEL.md`.
- Agent permissions, proposal flow, execution rules, or audit behavior: update `docs/agents/AGENT_PROTOCOL.md`.
- Pricing, hosted plan behavior, or open-source setup: update `README.md` and relevant user-facing pages.

The test suite includes documentation coverage checks for API routes. Add or update those tests when the agent-facing contract expands.

## Agent Safety Rules

- Work inside a single `crm_workspaces.id` boundary.
- Prefer proposals over direct writes for schema changes, identity merges, exports, and integration actions.
- Preserve provenance through `source`, `external_ids`, `crm_agent_proposals`, `crm_approvals`, `crm_execution_logs`, and `crm_audit_events`.
- Do not hardcode one customer vertical into the core. Use field definitions, custom entity types, and integration-specific attributes.
- Keep the API layer stable enough for future MCP tools.
