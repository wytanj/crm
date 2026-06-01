<script setup lang="ts">
const endpoints = [
  { method: 'GET', path: '/api/crm/bootstrap', purpose: 'Load workspace graph, fields, proposals, and integration state.' },
  { method: 'GET', path: '/api/graph/search?q=ava', purpose: 'Search labels, tags, and normalized entity attributes.' },
  { method: 'POST', path: '/api/schema/fields', purpose: 'Add a custom field definition for a workspace entity type.' },
  { method: 'POST', path: '/api/billing/checkout', purpose: 'Create a hosted-plan checkout session or demo checkout.' }
]

const samplePayload = {
  entityType: 'person',
  key: 'preferred_channel',
  label: 'Preferred channel',
  type: 'text',
  required: false
}
</script>

<template>
  <div class="page-stack">
    <div class="intro-strip">
      <div>
        <p class="eyebrow">API layer</p>
        <h2>The UI is one client of the CRM spine. Integrations, agents, and future MCP servers should use the same contracts.</h2>
      </div>
    </div>
    <section class="api-grid">
      <article v-for="endpoint in endpoints" :key="endpoint.path" class="endpoint-card">
        <span>{{ endpoint.method }}</span>
        <strong>{{ endpoint.path }}</strong>
        <p>{{ endpoint.purpose }}</p>
      </article>
      <article class="code-card">
        <strong>Custom field payload</strong>
        <pre>{{ JSON.stringify(samplePayload, null, 2) }}</pre>
      </article>
    </section>
  </div>
</template>
