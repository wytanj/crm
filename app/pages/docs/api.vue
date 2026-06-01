<template>
  <div class="page-stack">
    <section class="intro-strip">
      <div>
        <p class="eyebrow">API documentation</p>
        <h2>Stable routes for the web app, integrations, and future MCP-facing tools.</h2>
      </div>
      <NuxtLink class="secondary-button" to="/docs">All docs</NuxtLink>
    </section>

    <section class="docs-layout">
      <article class="docs-panel">
        <h3>GET /api/crm/bootstrap</h3>
        <p>Loads the CRM operating surface: metrics, entities, relationships, base fields, integration backlog, and proposals.</p>
        <ul>
          <li>Returns `mode: demo` when Supabase credentials are not configured.</li>
          <li>Returns `mode: supabase` when service credentials are available and reads succeed.</li>
        </ul>
      </article>

      <article class="docs-panel">
        <h3>GET /api/graph/search</h3>
        <p>Searches graph entities by label, tags, and normalized attributes.</p>
        <ul>
          <li>Query: `q`, optional string.</li>
          <li>Whitespace is trimmed before execution.</li>
        </ul>
      </article>

      <article class="docs-panel">
        <h3>POST /api/schema/fields</h3>
        <p>Creates or stages field definitions for entity types, including agent-origin proposals.</p>
        <pre>{
  "entityType": "person",
  "key": "preferred_channel",
  "label": "Preferred channel",
  "type": "text",
  "required": false,
  "origin": "agent"
}</pre>
      </article>

      <article class="docs-panel">
        <h3>POST /api/billing/checkout</h3>
        <p>Creates the hosted signup boundary. Billing is demo-first now; the planned hosted tier is $9/month later.</p>
        <ul>
          <li>Accepted plans: `hosted_growth`, `hosted_scale`.</li>
          <li>Demo mode returns a local checkout URL.</li>
        </ul>
      </article>
    </section>
  </div>
</template>
