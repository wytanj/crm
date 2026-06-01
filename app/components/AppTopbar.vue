<script setup lang="ts">
import { GitBranch, KeyRound, Search, UserRound } from '@lucide/vue'

const route = useRoute()
const runtime = useRuntimeConfig()
const query = ref('')

const pageTitle = computed(() => {
  const labels: Record<string, string> = {
    '/': 'Open Spine CRM',
    '/graph': 'Customer Graph',
    '/schema': 'Schema Designer',
    '/api-console': 'API Layer',
    '/agents': 'Agent Workbench',
    '/docs': 'Documentation',
    '/docs/api': 'API Documentation',
    '/docs/agents': 'Agent Documentation',
    '/docs/skills': 'Agent Skills',
    '/integrations': 'Integrations',
    '/pricing': 'Hosted Plan',
    '/settings': 'Workspace Settings',
    '/login': 'Sign In'
  }

  return labels[route.path] || 'Open Spine CRM'
})
</script>

<template>
  <header class="topbar">
    <div>
      <p class="eyebrow">{{ runtime.public.appName }}</p>
      <h1>{{ pageTitle }}</h1>
    </div>

    <div class="topbar-actions">
      <label class="search-box">
        <Search :size="17" />
        <input v-model="query" type="search" placeholder="Search people, orders, tickets" />
      </label>
      <NuxtLink class="icon-button" to="/settings" title="API keys">
        <KeyRound :size="18" />
      </NuxtLink>
      <a class="icon-button" href="https://github.com/wytanj/crm" target="_blank" rel="noreferrer" title="Repository">
        <GitBranch :size="18" />
      </a>
      <NuxtLink class="user-button" to="/login">
        <UserRound :size="18" />
        <span>Sign in</span>
      </NuxtLink>
    </div>
  </header>
</template>
