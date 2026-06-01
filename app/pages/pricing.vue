<script setup lang="ts">
const route = useRoute()

const checkoutNotice = computed(() => {
  if (route.query.checkout !== 'demo') {
    return ''
  }

  return `Demo checkout created for ${route.query.email || 'the selected email'} on ${route.query.plan || 'the hosted plan'}.`
})
</script>

<template>
  <div class="page-stack">
    <div v-if="checkoutNotice" class="notice-bar">{{ checkoutNotice }}</div>
    <div class="intro-strip">
      <div>
        <p class="eyebrow">Open core, hosted option</p>
        <h2>Self-host the CRM with Supabase keys, or sign up for the hosted tier free now before it becomes $9/month.</h2>
      </div>
      <NuxtLink class="secondary-button" to="/settings">Configure Supabase</NuxtLink>
    </div>
    <PaidSignup />
  </div>
</template>
