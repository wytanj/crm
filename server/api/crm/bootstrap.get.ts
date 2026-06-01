import { demoCrmGraph } from '../../utils/demo-crm'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()

  if (!supabase) {
    return {
      mode: 'demo',
      graph: demoCrmGraph
    }
  }

  const { data: entities, error: entityError } = await supabase
    .from('crm_entities')
    .select('id, type, label, external_ids, attributes, tags, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(24)

  const { data: relationships, error: relationshipError } = await supabase
    .from('crm_relationships')
    .select('id, from_entity_id, to_entity_id, type, confidence, source')
    .limit(48)

  if (entityError || relationshipError) {
    return {
      mode: 'demo',
      warning: entityError?.message || relationshipError?.message,
      graph: demoCrmGraph
    }
  }

  return {
    mode: 'supabase',
    graph: {
      ...demoCrmGraph,
      entities: (entities || []).map((entity) => ({
        id: entity.id,
        type: entity.type,
        label: entity.label,
        externalIds: entity.external_ids || {},
        attributes: entity.attributes || {},
        tags: entity.tags || [],
        createdAt: entity.created_at,
        updatedAt: entity.updated_at
      })),
      relationships: (relationships || []).map((relationship) => ({
        id: relationship.id,
        fromEntityId: relationship.from_entity_id,
        toEntityId: relationship.to_entity_id,
        type: relationship.type,
        confidence: relationship.confidence,
        source: relationship.source
      }))
    }
  }
})
