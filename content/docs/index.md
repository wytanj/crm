---
title: Open Spine CRM Documentation
description: A native documentation portal for the headless CRM API, agent protocol, data model, and agent skills.
kicker: Documentation
---

## What This Is

Open Spine CRM is an open-source, headless CRM core for teams that want customer data to behave like infrastructure. The system is organized around a graph-backed data model, stable API contracts, and a proposal-first agent workflow.

The hosted plan exists for teams that do not want to run their own infrastructure. The open-source core remains self-hostable with Supabase credentials.

## Documentation Map

| Area | Use it for |
| --- | --- |
| API docs | Routes, payloads, response modes, and API behavior. |
| Agent protocol | How agents read, propose, wait for approval, execute, and audit work. |
| Agent skills | The specific CRM capabilities agents can safely use. |
| Data model | Base entity types, minimum customer fields, graph relationships, and schema extension rules. |

## Native Docs Direction

The public documentation is rendered inside the Nuxt app from Markdown files in `content/docs`. That keeps the docs accessible in the product, versioned with the code, and easy for agents to update in the same pull request as contract changes.

Agent-facing source-of-truth docs still live under `docs/agents`. When API behavior, schema, protocol, or skills change, update both the internal agent contract and the matching public docs page.

## Operating Principles

- Treat Supabase as the portable data spine.
- Treat the API layer as the stable contract for apps, integrations, and future MCP tools.
- Treat agents as governed operators that can read broadly inside a workspace, but must propose sensitive changes.
- Keep provenance attached to imported data, schema changes, identity merges, and agent actions.
- Keep the core generic enough for B2C and B2B customer data instead of locking it to one vertical.
