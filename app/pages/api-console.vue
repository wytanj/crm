<script setup lang="ts">
const endpoints = [
  { method: 'GET', path: '/api/crm/bootstrap', purpose: 'Load workspace graph, fields, proposals, and integration state.' },
  { method: 'GET', path: '/api/graph/search?q=ava', purpose: 'Search labels, tags, and normalized entity attributes.' },
  { method: 'GET', path: '/api/profile-packs', purpose: 'List installable and installed domain profile packs for a workspace.' },
  { method: 'GET', path: '/api/profile-packs/skincare', purpose: 'Inspect a dynamic profile pack definition and its fields.' },
  { method: 'POST', path: '/api/profile-packs/skincare/install', purpose: 'Install a pack idempotently into a workspace.' },
  { method: 'GET', path: '/api/v1/people/person_001/counter-profile', purpose: 'Return only POS-visible profile fields and advisory warnings.' },
  { method: 'PATCH', path: '/api/v1/people/person_001/profile-fields', purpose: 'Update pack-scoped fields and write customer-profile facts.' },
  { method: 'POST', path: '/api/schema/fields', purpose: 'Add a custom field definition for a workspace entity type.' },
  { method: 'POST', path: '/api/billing/checkout', purpose: 'Create a hosted-plan checkout session or demo checkout.' }
]

const samplePayload = {
  workspaceId: 'workspace uuid',
  packKey: 'skincare',
  fields: {
    skin_type: 'Combination',
    skin_concerns: ['Acne', 'Pigmentation'],
    reported_sensitivities: ['retinol', 'fragrance']
  },
  sourceSystem: 'crm_ui'
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
        <strong>Profile field update payload</strong>
        <pre>{{ JSON.stringify(samplePayload, null, 2) }}</pre>
      </article>
    </section>
  </div>
</template>
