<template>
  <div class="page-stack">
    <section class="intro-strip">
      <div>
        <p class="eyebrow">Agent skills</p>
        <h2>The CRM exposes agent capabilities around graph reading, schema proposals, approvals, and execution logs.</h2>
      </div>
      <NuxtLink class="secondary-button" to="/docs/agents">Agent protocol</NuxtLink>
    </section>

    <section class="docs-card-grid">
      <article class="doc-card">
        <span>Read</span>
        <h3>Graph Search</h3>
        <p>Find entities by label, tags, attributes, external IDs, and type filters inside a workspace.</p>
      </article>
      <article class="doc-card">
        <span>Read</span>
        <h3>Entity Neighborhood</h3>
        <p>Read a selected entity plus connected entities, relationship types, confidence, and provenance.</p>
      </article>
      <article class="doc-card">
        <span>Propose</span>
        <h3>Schema Field Proposal</h3>
        <p>Suggest fields for people, companies, orders, tickets, messages, products, campaigns, or custom records.</p>
      </article>
      <article class="doc-card">
        <span>Propose</span>
        <h3>Identity Merge Proposal</h3>
        <p>Stage possible duplicate customer/account merges without destructive writes before approval.</p>
      </article>
      <article class="doc-card">
        <span>Govern</span>
        <h3>Approval Request</h3>
        <p>Move proposals into review for owners, admins, or authorized human operators.</p>
      </article>
      <article class="doc-card">
        <span>Execute</span>
        <h3>Approved Execution</h3>
        <p>Run approved actions, record outputs, and preserve the audit trail for every agent operation.</p>
      </article>
    </section>
  </div>
</template>
