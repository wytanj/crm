---
title: Data Model
description: Base properties, Shopify-style customer inputs, graph relationships, and how agents extend the schema.
kicker: Model
---

## Base Entity Types

Open Spine CRM starts with enough structure to model common B2C and B2B customer data without forcing a rigid CRM object model.

| Entity type | Purpose |
| --- | --- |
| `person` | Individual customer, contact, lead, buyer, or support requester. |
| `company` | Account, employer, merchant, vendor, or organization. |
| `order` | Purchase, subscription order, invoice, or commercial transaction. |
| `product` | Purchased SKU, subscribed product, service, or catalog item. |
| `message` | Email, chat, ticket reply, note, SMS, or conversation event. |
| `ticket` | Support issue, complaint, request, or case. |
| `campaign` | Marketing campaign, lifecycle flow, or outbound initiative. |

## Minimal Customer Properties

A typical Shopify-style customer gives the CRM enough information to start with:

| Property | Applies to | Notes |
| --- | --- | --- |
| `email` | person | Primary customer identity handle. |
| `phone` | person | Optional identity and communication handle. |
| `first_name` | person | Customer profile field. |
| `last_name` | person | Customer profile field. |
| `address` | person | Shipping, billing, or default location data. |
| `marketing_consent` | person | Consent and preference context. |
| `external_customer_id` | person | Source-specific ID from Shopify or another channel. |
| `order_number` | order | Source order identifier. |
| `total_price` | order | Transaction amount. |
| `currency` | order | ISO currency code. |
| `fulfillment_status` | order | Fulfillment lifecycle. |
| `financial_status` | order | Payment lifecycle. |
| `sku` | product | Purchased SKU or variant key. |
| `quantity` | order | Quantity purchased by line item. |

## Graph Relationships

Relationships connect customer context without forcing every source into one table.

Examples:

- person `placed` order
- order `contains` product
- person `works_at` company
- person `opened` ticket
- ticket `has_message` message
- campaign `touched` person

Each relationship can carry confidence, source, and metadata.

## Extending The Schema

Agents extend the schema by proposing field definitions rather than directly altering the database.

The proposal should include:

- entity type
- field key
- field label
- field type
- whether the field is required
- origin: human, agent, integration, or system
- reason and source evidence

After approval, the field definition becomes part of the workspace model and future imports can map into it.

## Customer Memory Tables

The CRM acts as the customer graph, consent, memory, segments, and semantic-query foundation. It should not own POS execution, product taxonomy, or loyalty economics.

| Table | Purpose |
| --- | --- |
| `crm_events` | Idempotent facts from POS, loyalty, ecommerce, and partner systems. |
| `crm_external_links` | Links between CRM entities and source-system customer references. |
| `crm_customer_facts` | Normalized event-derived facts for timelines and projections. |
| `crm_consent_records` | Consent and contactability history. |
| `crm_customer_profiles` | Computed activity, value, affinity, intent, and metric read model. |
| `crm_segment_memberships` | Segment membership projections with score and reason. |
| `crm_metric_definitions` | Workspace-owned generic metric registry. |

## Event Contract

Every source write should carry:

| Field | Notes |
| --- | --- |
| `event_id` | Stable source event identifier. |
| `event_type` | Business-neutral event type, such as `pos.sale.completed`. |
| `workspace_id` | Organization boundary. |
| `source_system` | Origin system such as POS, Shopify, loyalty, or partner. |
| `occurred_at` | When the fact happened. |
| `idempotency_key` | Stable replay key that prevents duplicate effects. |
| `actor` | Human, system, agent, or integration actor context. |
| `subject` | Customer or account reference context. |
| `context` | Channel, country, currency, location, register, listing, or related context. |
| `payload` | Source-specific event payload. |
| `schema_version` | Contract version for event readers. |
