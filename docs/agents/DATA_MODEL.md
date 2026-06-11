# Data Model

Open Spine CRM models customer operations as a workspace-scoped graph.

## Workspace

Every organization maps to `crm_workspaces`. All operational records carry `workspace_id`; agents must not cross workspace boundaries.

Related tables:

- `crm_workspace_members`: workspace user and agent membership.
- `crm_billing_customers`: hosted billing customer records.
- `crm_subscriptions`: open-source or hosted subscription state.

## Entity Spine

`crm_entities` stores the nodes of the graph:

- `person`
- `company`
- `household`
- `order`
- `product`
- `ticket`
- `message`
- `campaign`
- `custom`

Core properties:

- `label`: human-readable display name.
- `external_ids`: channel IDs, such as Shopify, POS, support, accounting, or imported IDs.
- `attributes`: flexible JSON for field values.
- `tags`: searchable tags and segmentation handles.
- `source`: origin of the entity or latest write.

## Relationship Graph

`crm_relationships` stores typed edges between entities.

Examples:

- `placed_order`
- `opened_ticket`
- `works_at`
- `belongs_to_household`
- `subscribed_to_campaign`

Relationship records include confidence and source so agents can distinguish imported facts from inferred links.

## Base Customer Fields

The current minimal commerce customer profile includes:

- `email`
- `phone`
- `first_name`
- `last_name`
- `accepts_marketing`
- `tags`
- `note`
- `default_address`
- `orders_count`
- `total_spent`
- `currency`
- `last_order_at`
- `source_channel`
- `company_name`
- `lifecycle_stage`

These are represented in the app contract as `customerFields` and in persistent workspaces through `crm_field_definitions`.

## Schema Extensions

Agents may propose new fields or custom entity types, but should not silently mutate schema-sensitive records.

Schema field properties:

- `entity_type`
- `key`
- `label`
- `value_type`
- `required`
- `origin`
- `enum_values`

Allowed `origin` values are `core`, `integration`, `custom`, and `agent`.

Use `crm_agent_proposals` for schema suggestions that require review before execution.

## Customer Memory Foundation

The CRM now has Phase 1 customer-memory tables for cross-repo facts:

- `crm_events`: idempotent source events from POS, loyalty, ecommerce, partner channels, or future integration workers.
- `crm_external_links`: durable links between CRM entities and external customer references.
- `crm_customer_facts`: normalized customer facts derived from events.
- `crm_consent_records`: consent and contactability history.
- `crm_customer_profiles`: computed customer read model with activity, value, affinity, intent, provenance, and sensitivity level.
- `crm_segment_memberships`: segment membership projections.
- `crm_metric_definitions`: workspace-owned generic metric registry.

Every source write should carry:

- `event_id`
- `event_type`
- `workspace_id`
- `source_system`
- `occurred_at`
- `idempotency_key`
- `actor`
- `subject`
- `context`
- `payload`
- `schema_version`

CRM should keep customer graph, consent, customer memory, segments, and semantic query foundations. POS, SKUMS, and loyalty remain the source of truth for checkout execution, product taxonomy, and loyalty economics.
