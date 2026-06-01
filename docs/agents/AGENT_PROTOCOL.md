# Agent Protocol

Agents are first-class workspace participants, but their default behavior is proposal-first.

## Default Workflow

1. Read the current graph, field definitions, relationships, and data source context.
2. Produce a structured proposal in `crm_agent_proposals`.
3. Wait for approval in `crm_approvals` when the action changes schema, identity, exports, or external systems.
4. Execute the approved action through the API layer.
5. Record output in `crm_execution_logs`.
6. Preserve a durable event in `crm_audit_events`.

## Schema Extension Example

```json
{
  "type": "add_field",
  "entity_type": "person",
  "key": "preferred_channel",
  "label": "Preferred channel",
  "value_type": "text",
  "required": false,
  "origin": "agent",
  "rationale": "Support and ecommerce imports both reference contact preference."
}
```

## Direct Writes

Direct writes should be limited to low-risk draft or staging actions. Use proposals for:

- Adding or changing schema.
- Merging identities.
- Exporting audiences.
- Triggering integrations.
- Mutating billing state.
- Any action that affects many records.

## MCP Direction

Future MCP tools should expose workspace-scoped actions:

- Search graph.
- Read entity neighborhood.
- Propose schema field.
- Propose identity merge.
- Request approval.
- Execute approved action.

MCP tools should use the same proposal, approval, execution, and audit tables as the web app.
