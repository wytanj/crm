<script setup lang="ts">
const { data, pending } = await useCrmBootstrap()

const graph = computed(() => data.value?.graph)
</script>

<template>
  <div class="page-stack">
    <div v-if="pending" class="loading-panel">Loading CRM graph...</div>
    <template v-else-if="graph">
      <div v-if="data?.mode === 'demo'" class="notice-bar">
        Running with demo data. Add Supabase keys to use your own open CRM database.
      </div>
      <MetricStrip :metrics="graph.metrics" />
      <GraphWorkspace :entities="graph.entities" :relationships="graph.relationships" />
      <div class="two-column">
        <AgentProposalList :proposals="graph.proposals" />
        <IntegrationRail :items="graph.integrationBacklog" />
      </div>
    </template>
  </div>
</template>
