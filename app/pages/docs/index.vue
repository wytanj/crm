<template>
  <div class="page-stack">
    <section class="intro-strip">
      <div>
        <p class="eyebrow">Documentation</p>
        <h2>Build against Open Spine CRM as a headless API, agent workspace, and extensible graph data model.</h2>
      </div>
      <NuxtLink class="primary-button" to="/">Back to home</NuxtLink>
    </section>

    <section class="docs-card-grid">
      <NuxtLink class="doc-card" to="/docs/api">
        <span>API</span>
        <h3>API Documentation</h3>
        <p>HTTP routes, payloads, fallback behavior, and the contract agents and integrations use.</p>
      </NuxtLink>
      <NuxtLink class="doc-card" to="/docs/agents">
        <span>Agents</span>
        <h3>Agent Documentation</h3>
        <p>Proposal-first workflow, approval requirements, execution logs, audit events, and MCP direction.</p>
      </NuxtLink>
      <NuxtLink class="doc-card" to="/docs/skills">
        <span>Skills</span>
        <h3>Agent Skills</h3>
        <p>Graph search, entity neighborhood reads, schema proposals, identity merge proposals, and approved execution.</p>
      </NuxtLink>
    </section>
  </div>
</template>
