<script setup lang="ts">
const { data } = await useCrmBootstrap()
const fields = computed(() => data.value?.graph.customerFields || [])
</script>

<template>
  <div class="page-stack">
    <div class="intro-strip">
      <div>
        <p class="eyebrow">Headless data contract</p>
        <h2>Start with the customer fields most commerce systems already expose, then let teams and agents add their own schema.</h2>
      </div>
      <NuxtLink class="secondary-button" to="/api-console">View API</NuxtLink>
    </div>
    <SchemaDesigner :fields="fields" />
  </div>
</template>
