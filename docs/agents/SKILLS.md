# Agent Skills And Capabilities

This document describes the skills agents should expose when operating inside an Open Spine CRM workspace.

## Core Skills

### Graph Search

Find people, companies, orders, tickets, messages, campaigns, products, and custom records in a workspace.

Expected inputs:

- `workspace_id`
- `query`
- optional entity type filters

Expected output:

- matching entity IDs
- labels
- types
- tags
- relevant external IDs

### Entity Neighborhood Read

Read an entity and its connected graph neighborhood.

Expected inputs:

- `workspace_id`
- `entity_id`
- relationship depth

Expected output:

- entity attributes
- connected entities
- relationship types
- confidence and source metadata

### Schema Field Proposal

Suggest a new field for an entity type without silently mutating production schema.

Expected inputs:

- `workspace_id`
- `entity_type`
- `key`
- `label`
- `value_type`
- `required`
- rationale

Expected output:

- `crm_agent_proposals` record
- proposed action payload

### Identity Merge Proposal

Stage a customer/account merge when imported or inferred records likely refer to the same real-world entity.

Expected inputs:

- `workspace_id`
- source entity IDs
- confidence
- rationale
- expected merged attributes

Expected output:

- proposal requiring approval
- no destructive write before approval

### Approval Request

Move a proposal into review when human approval is required.

Expected inputs:

- `workspace_id`
- `proposal_id`
- requested approver role

Expected output:

- proposal status update
- audit event

### Approved Execution

Execute an approved proposal and record the result.

Expected inputs:

- `workspace_id`
- `proposal_id`

Expected output:

- changed records
- `crm_execution_logs` entry
- `crm_audit_events` entry

## Restricted Skills

These should require explicit capability grants:

- Exporting audiences or customer data.
- Calling third-party integrations.
- Mutating billing/subscription state.
- Deleting records.
- Bulk updating many entities.
- Writing directly to `crm_field_definitions` without a proposal.

## Future MCP Shape

Future MCP tools should map to these skills with workspace-scoped authorization and should reuse the same API, proposal, approval, execution, and audit tables as the web application.
