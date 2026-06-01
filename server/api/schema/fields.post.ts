import { schemaFieldPayloadSchema } from '../../utils/contracts'

export default defineEventHandler(async (event) => {
  const body = schemaFieldPayloadSchema.parse(await readBody(event))
  const supabase = useSupabaseAdmin()

  if (!supabase || !body.workspaceId) {
    return {
      mode: 'demo',
      field: {
        ...body,
        id: `demo_${body.key}`,
        origin: body.origin
      }
    }
  }

  const { data, error } = await supabase
    .from('crm_field_definitions')
    .insert({
      workspace_id: body.workspaceId,
      entity_type: body.entityType,
      key: body.key,
      label: body.label,
      value_type: body.type,
      required: body.required,
      origin: body.origin
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { mode: 'supabase', field: data }
})
