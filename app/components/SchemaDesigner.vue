<script setup lang="ts">
import { Plus, Save } from '@lucide/vue'
import type { CrmSchemaField } from '~/types/crm'

const props = defineProps<{
  fields: CrmSchemaField[]
}>()

const localFields = ref<CrmSchemaField[]>([...props.fields])
const draft = reactive({
  key: '',
  label: '',
  type: 'text' as CrmSchemaField['type'],
  required: false
})

const fieldTypes: CrmSchemaField['type'][] = ['text', 'number', 'date', 'boolean', 'email', 'phone', 'json', 'enum']
const saving = ref(false)

async function addField() {
  if (!draft.key || !draft.label) {
    return
  }

  saving.value = true
  const field = {
    key: draft.key,
    label: draft.label,
    type: draft.type,
    required: draft.required,
    origin: 'custom' as const
  }

  await $fetch('/api/schema/fields', {
    method: 'POST',
    body: {
      entityType: 'person',
      ...field
    }
  })

  localFields.value.unshift(field)
  draft.key = ''
  draft.label = ''
  draft.type = 'text'
  draft.required = false
  saving.value = false
}
</script>

<template>
  <section class="schema-layout">
    <div class="schema-table">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Minimal Shopify-like customer profile</p>
          <h2>Core fields agents can depend on</h2>
        </div>
      </div>

      <div class="field-list">
        <div v-for="field in localFields" :key="field.key" class="field-row">
          <div>
            <strong>{{ field.label }}</strong>
            <span>{{ field.key }}</span>
          </div>
          <span>{{ field.type }}</span>
          <em>{{ field.origin }}</em>
          <b>{{ field.required ? 'Required' : 'Optional' }}</b>
        </div>
      </div>
    </div>

    <form class="schema-form" @submit.prevent="addField">
      <p class="eyebrow">Custom schema</p>
      <h2>Add an agent-ready field</h2>
      <label>
        <span>Field key</span>
        <input v-model="draft.key" type="text" placeholder="preferred_channel" pattern="[a-z][a-z0-9_]*" />
      </label>
      <label>
        <span>Label</span>
        <input v-model="draft.label" type="text" placeholder="Preferred channel" />
      </label>
      <label>
        <span>Type</span>
        <select v-model="draft.type">
          <option v-for="type in fieldTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
      <label class="check-row">
        <input v-model="draft.required" type="checkbox" />
        <span>Required for new person records</span>
      </label>
      <button class="primary-button" type="submit" :disabled="saving">
        <Save v-if="saving" :size="17" />
        <Plus v-else :size="17" />
        <span>{{ saving ? 'Saving' : 'Add field' }}</span>
      </button>
    </form>
  </section>
</template>
