import { demoCrmGraph } from '../../utils/demo-crm'
import { graphSearchQuerySchema } from '../../utils/contracts'

export default defineEventHandler(async (event) => {
  const { q } = graphSearchQuerySchema.parse(getQuery(event))
  const supabase = useSupabaseAdmin()

  if (!q) {
    return { results: demoCrmGraph.entities.slice(0, 6) }
  }

  if (!supabase) {
    const lower = q.toLowerCase()
    return {
      results: demoCrmGraph.entities.filter((entity) => {
        return entity.label.toLowerCase().includes(lower)
          || entity.tags.some((tag) => tag.toLowerCase().includes(lower))
          || JSON.stringify(entity.attributes).toLowerCase().includes(lower)
      })
    }
  }

  const { data, error } = await supabase
    .from('crm_entities')
    .select('id, type, label, external_ids, attributes, tags, created_at, updated_at')
    .or(`label.ilike.%${q}%,search_text.ilike.%${q}%`)
    .limit(20)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { results: data || [] }
})
