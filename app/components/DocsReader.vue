<script setup lang="ts">
import { BookOpen, Database, FileCode, Search, Wrench, Workflow } from '@lucide/vue'

const props = defineProps<{
  path: string
}>()

type TocLink = {
  id: string
  text: string
  children?: TocLink[]
}

type DocsPage = {
  title?: string
  description?: string
  kicker?: string
  body?: {
    toc?: {
      links?: TocLink[]
    }
  }
}

const docsNav = [
  {
    title: 'Start here',
    items: [
      { label: 'Overview', to: '/docs', path: '/docs', description: 'Product principles and documentation map', icon: BookOpen },
      { label: 'API docs', to: '/docs/api', path: '/docs/api', description: 'Routes, payloads, and API behavior', icon: FileCode }
    ]
  },
  {
    title: 'Agent surface',
    items: [
      { label: 'Agent protocol', to: '/docs/agents', path: '/docs/agents', description: 'Workspace boundaries, proposals, approvals', icon: Workflow },
      { label: 'Agent skills', to: '/docs/skills', path: '/docs/skills', description: 'Capabilities agents can use safely', icon: Wrench },
      { label: 'Data model', to: '/docs/model', path: '/docs/model', description: 'Base records, fields, and extension rules', icon: Database }
    ]
  }
]

const searchTerm = ref('')

const navItems = docsNav.flatMap((section) => section.items)
const activeNav = computed(() => navItems.find((item) => item.path === props.path) || navItems[0])
const filteredNav = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  if (!query) {
    return docsNav
  }

  return docsNav
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        `${item.label} ${item.description}`.toLowerCase().includes(query)
      )
    }))
    .filter((section) => section.items.length > 0)
})

const { data: page } = await useAsyncData<DocsPage | null>(`docs:${props.path}`, () =>
  queryCollection('content').path(props.path).first() as Promise<DocsPage | null>
)

const headings = computed(() => {
  const toc = page.value?.body?.toc?.links || []

  return toc.flatMap((link) => [
    { id: link.id, text: link.text },
    ...(link.children || []).map((child) => ({ id: child.id, text: child.text }))
  ])
})
</script>

<template>
  <div class="docs-reader">
    <aside class="docs-sidebar-panel" aria-label="Documentation navigation">
      <NuxtLink class="docs-home-link" to="/">
        <span class="docs-home-mark">
          <BookOpen :size="18" />
        </span>
        <span>
          <strong>Open Spine Docs</strong>
          <small>Native docs portal</small>
        </span>
      </NuxtLink>

      <label class="docs-search">
        <Search :size="16" />
        <input v-model="searchTerm" type="search" placeholder="Search docs" aria-label="Search documentation" />
      </label>

      <nav class="docs-nav-groups">
        <section v-for="section in filteredNav" :key="section.title">
          <h2>{{ section.title }}</h2>
          <NuxtLink
            v-for="item in section.items"
            :key="item.path"
            class="docs-nav-item"
            :class="{ active: item.path === props.path }"
            :to="item.to"
          >
            <component :is="item.icon" :size="17" />
            <span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.description }}</small>
            </span>
          </NuxtLink>
        </section>
      </nav>
    </aside>

    <main class="docs-article-shell">
      <div class="docs-breadcrumb">
        <NuxtLink to="/docs">Docs</NuxtLink>
        <span>/</span>
        <span>{{ activeNav?.label }}</span>
      </div>

      <article v-if="page" class="docs-article">
        <header>
          <p class="eyebrow">{{ page.kicker || 'Documentation' }}</p>
          <h1>{{ page.title }}</h1>
          <p>{{ page.description }}</p>
        </header>

        <ContentRenderer :value="page" />
      </article>

      <article v-else class="docs-article">
        <header>
          <p class="eyebrow">Documentation</p>
          <h1>Page not found</h1>
          <p>The requested documentation page is not available.</p>
        </header>
      </article>
    </main>

    <aside class="docs-toc" aria-label="On this page">
      <strong>On this page</strong>
      <a v-for="heading in headings" :key="heading.id" :href="`#${heading.id}`">{{ heading.text }}</a>
      <div class="docs-cta-box">
        <span>Need the live surface?</span>
        <NuxtLink to="/graph">Open demo CRM</NuxtLink>
        <NuxtLink to="/login">Sign up or log in</NuxtLink>
      </div>
    </aside>
  </div>
</template>
