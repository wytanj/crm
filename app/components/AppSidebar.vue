<script setup lang="ts">
import {
  Blocks,
  Bot,
  Braces,
  CreditCard,
  Database,
  GitFork,
  LayoutDashboard,
  PlugZap,
  Settings
} from '@lucide/vue'

const navItems = [
  { label: 'Graph', to: '/', icon: LayoutDashboard },
  { label: 'Schema', to: '/schema', icon: Braces },
  { label: 'API', to: '/api-console', icon: GitFork },
  { label: 'Agents', to: '/agents', icon: Bot },
  { label: 'Integrations', to: '/integrations', icon: PlugZap },
  { label: 'Billing', to: '/pricing', icon: CreditCard },
  { label: 'Settings', to: '/settings', icon: Settings }
]
</script>

<template>
  <aside class="sidebar">
    <NuxtLink class="brand" to="/">
      <span class="brand-mark">
        <Blocks :size="19" />
      </span>
      <span>
        <strong>Open Spine</strong>
        <small>Headless CRM</small>
      </span>
    </NuxtLink>

    <nav class="nav-list" aria-label="Primary">
      <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">
        <component :is="item.icon" :size="18" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <Database :size="18" />
      <div>
        <strong>Supabase ready</strong>
        <span>Bring your own project keys.</span>
      </div>
    </div>
  </aside>
</template>
