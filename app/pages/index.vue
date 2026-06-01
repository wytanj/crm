<script setup lang="ts">
import { Blocks } from '@lucide/vue'

definePageMeta({
  layout: false
})
</script>

<template>
  <div class="landing-page">
    <header class="landing-nav">
      <NuxtLink class="brand" to="/">
        <span class="brand-mark">
          <Blocks :size="19" />
        </span>
        <span>
          <strong>Open Spine</strong>
          <small>Headless CRM</small>
        </span>
      </NuxtLink>
      <nav aria-label="Landing">
        <NuxtLink to="/graph">Demo</NuxtLink>
        <NuxtLink to="/pricing">Pricing</NuxtLink>
        <NuxtLink to="/login">Log in</NuxtLink>
        <NuxtLink class="primary-button" to="/login">Sign up free</NuxtLink>
      </nav>
    </header>

    <section class="landing-hero">
      <div class="landing-copy">
        <p class="eyebrow">Open source, agentic, headless CRM</p>
        <h2>Customer data infrastructure for teams and agents.</h2>
        <p>
          Open Spine CRM gives every organization a graph-backed customer spine, a stable API layer,
          and an approval-first workspace where agents can read, propose, and extend the data model.
        </p>
        <div class="hero-actions">
          <NuxtLink class="primary-button" to="/login">Sign up free</NuxtLink>
          <NuxtLink class="secondary-button" to="/login">Log in</NuxtLink>
          <NuxtLink class="secondary-button" to="/graph">View demo CRM</NuxtLink>
        </div>
      </div>
    </section>

    <section class="feature-grid">
      <article>
        <span>01</span>
        <h3>Headless CRM spine</h3>
        <p>Use the CRM as the source layer behind apps, agents, ecommerce channels, support tools, and internal workflows.</p>
      </article>
      <article>
        <span>02</span>
        <h3>Agent-ready schema</h3>
        <p>Agents can inspect fields, propose schema extensions, stage merges, and leave a complete approval trail.</p>
      </article>
      <article>
        <span>03</span>
        <h3>Open source core</h3>
        <p>Self-host with Supabase keys, keep the schema portable, and avoid locking customer data inside a closed CRM.</p>
      </article>
      <article>
        <span>04</span>
        <h3>Hosted when needed</h3>
        <p>Teams that do not want to operate infrastructure can use the hosted workspace and integration layer.</p>
      </article>
    </section>

    <section class="landing-band">
      <div>
        <p class="eyebrow">Pricing</p>
        <h2>Free while the hosted tier is early. Planned hosted price is $9/month.</h2>
      </div>
      <NuxtLink class="primary-button" to="/pricing">See pricing</NuxtLink>
    </section>
  </div>
</template>
