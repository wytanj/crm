<script setup lang="ts">
import { Check, CreditCard, Server } from '@lucide/vue'
import type { PlanKey } from '~/types/crm'

const email = ref('')
const selectedPlan = ref<Exclude<PlanKey, 'open_source'>>('hosted_growth')
const { loading, error, startCheckout } = useBillingCheckout()

const plans = [
  {
    key: 'open_source',
    name: 'Open Source',
    price: '$0',
    icon: Server,
    items: ['Self-host on Supabase', 'Graph CRM schema', 'API layer', 'Bring your own integrations']
  },
  {
    key: 'hosted_growth',
    name: 'Hosted Growth',
    price: '$49',
    icon: CreditCard,
    items: ['Managed workspace', 'Billing and team setup', 'Core ecommerce integrations', 'Approval logs for agents']
  },
  {
    key: 'hosted_scale',
    name: 'Hosted Scale',
    price: 'Custom',
    icon: CreditCard,
    items: ['Private integration runs', 'Dedicated schema support', 'Advanced audit retention', 'Priority MCP roadmap access']
  }
] as const
</script>

<template>
  <section class="pricing-grid">
    <article v-for="plan in plans" :key="plan.key" class="plan-card">
      <div class="plan-title">
        <component :is="plan.icon" :size="20" />
        <h2>{{ plan.name }}</h2>
      </div>
      <strong class="plan-price">{{ plan.price }}</strong>
      <ul>
        <li v-for="item in plan.items" :key="item">
          <Check :size="16" />
          <span>{{ item }}</span>
        </li>
      </ul>
      <button
        v-if="plan.key !== 'open_source'"
        class="secondary-button"
        type="button"
        @click="selectedPlan = plan.key"
      >
        Select {{ plan.name }}
      </button>
      <NuxtLink v-else class="secondary-button" to="/settings">Use Supabase keys</NuxtLink>
    </article>
  </section>

  <form class="checkout-panel" @submit.prevent="startCheckout(email, selectedPlan)">
    <div>
      <p class="eyebrow">Hosted signup</p>
      <h2>Create a paid workspace</h2>
      <p>Paid workspaces are for teams that want managed hosting and integrations while keeping the same open CRM core.</p>
    </div>
    <label>
      <span>Work email</span>
      <input v-model="email" type="email" placeholder="founder@company.com" required />
    </label>
    <label>
      <span>Plan</span>
      <select v-model="selectedPlan">
        <option value="hosted_growth">Hosted Growth</option>
        <option value="hosted_scale">Hosted Scale</option>
      </select>
    </label>
    <button class="primary-button" type="submit" :disabled="loading">
      <CreditCard :size="17" />
      <span>{{ loading ? 'Creating checkout' : 'Continue to checkout' }}</span>
    </button>
    <p v-if="error" class="form-error">{{ error }}</p>
  </form>
</template>
