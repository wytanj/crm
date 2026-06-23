import { crmEventPayloadSchema } from '../../../utils/contracts'

export default defineEventHandler(async (event) => {
  const body = crmEventPayloadSchema.parse(await readBody(event))
  const supabase = useSupabaseAdmin()
  const sql = useCrmPostgres()

  if ((!supabase && !sql) || !body.workspaceId) {
    return {
      mode: 'demo',
      accepted: true,
      event: {
        id: `demo_${body.idempotencyKey}`,
        ...body
      }
    }
  }

  if (sql) {
    const [data] = await sql<Array<Record<string, unknown>>>`
      insert into public.crm_events (
        workspace_id,
        event_id,
        event_type,
        source_system,
        occurred_at,
        idempotency_key,
        actor,
        subject,
        context,
        payload,
        schema_version
      )
      values (
        ${body.workspaceId}::uuid,
        ${body.eventId},
        ${body.eventType},
        ${body.sourceSystem},
        ${body.occurredAt}::timestamptz,
        ${body.idempotencyKey},
        ${JSON.stringify(body.actor)}::jsonb,
        ${JSON.stringify(body.subject)}::jsonb,
        ${JSON.stringify(body.context)}::jsonb,
        ${JSON.stringify(body.payload)}::jsonb,
        ${body.schemaVersion}
      )
      on conflict (workspace_id, source_system, idempotency_key) do update set
        event_id = excluded.event_id,
        event_type = excluded.event_type,
        occurred_at = excluded.occurred_at,
        actor = excluded.actor,
        subject = excluded.subject,
        context = excluded.context,
        payload = excluded.payload,
        schema_version = excluded.schema_version
      returning *
    `

    return { mode: 'supabase', accepted: true, event: data }
  }

  if (!supabase) {
    throw createError({ statusCode: 503, statusMessage: 'Supabase service client is not configured.' })
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
