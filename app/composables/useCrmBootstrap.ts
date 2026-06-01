import type { CrmGraphResponse } from '~/types/crm'

export function useCrmBootstrap() {
  return useAsyncData('crm-bootstrap', async () => {
    const response = await $fetch<{ mode: 'demo' | 'supabase', warning?: string, graph: CrmGraphResponse }>('/api/crm/bootstrap')
    return response
  })
}
