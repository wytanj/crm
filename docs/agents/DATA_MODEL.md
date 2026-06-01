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
