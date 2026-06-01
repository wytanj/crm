<template>
  <div class="page-stack">
    <section class="intro-strip">
      <div>
        <p class="eyebrow">Agent documentation</p>
        <h2>Agents can interact with the CRM data model, but the default operating mode is proposal-first.</h2>
      </div>
      <NuxtLink class="secondary-button" to="/docs/skills">Agent skills</NuxtLink>
    </section>

    <section class="docs-layout">
      <article class="docs-panel">
        <h3>Workspace Boundary</h3>
        <p>Agents operate inside a single `crm_workspaces.id`. They should not read or write across organizations.</p>
      </article>

      <article class="docs-panel">
        <h3>Default Workflow</h3>
        <ol>
          <li>Read graph, fields, relationships, and data source context.</li>
          <li>Create a structured proposal in `crm_agent_proposals`.</li>
          <li>Wait for approval in `crm_approvals` when the action changes schema, identity, exports, or external systems.</li>
          <li>Execute approved actions through the API layer.</li>
          <li>Record results in `crm_execution_logs` and `crm_audit_events`.</li>
        </ol>
      </article>

      <article class="docs-panel">
        <h3>Schema Extension</h3>
        <p>Agents may propose fields and custom entity types. Direct schema-sensitive writes should require explicit grants.</p>
        <pre>{
  "type": "add_field",
  "entity_type": "person",
  "key": "preferred_channel",
  "origin": "agent"
}</pre>
      </article>

      <article class="docs-panel">
        <h3>Restricted Actions</h3>
        <p>Exports, third-party integrations, billing changes, deletion, bulk mutation, and direct schema writes should require explicit approval or capability grants.</p>
      </article>
    </section>
  </div>
</template>
