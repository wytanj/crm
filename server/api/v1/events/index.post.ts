import { crmEventPayloadSchema } from '../../../utils/contracts'

export default defineEventHandler(async (event) => {
  const body = crmEventPayloadSchema.parse(await readBody(event))
  const supabase = useSupabaseAdmin()

  if (!supabase || !body.workspaceId) {
    return {
      mode: 'demo',
      accepted: true,
      event: {
        id: `demo_${body.idempotencyKey}`,
        ...body
      }
    }
  }

  const { data, error } = await supabase
    .from('crm_events')
    .upsert({
      workspace_id: body.workspaceId,
      event_id: body.eventId,
      event_type: body.eventType,
      source_system: body.sourceSystem,
      occurred_at: body.occurredAt,
      idempotency_key: body.idempotencyKey,
      actor: body.actor,
      subject: body.subject,
      context: body.context,
      payload: body.payload,
      schema_version: body.schemaVersion
    }, {
      onConflict: 'workspace_id,source_system,idempotency_key'
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { mode: 'supabase', accepted: true, event: data }
})
