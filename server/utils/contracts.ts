import { z } from 'zod'

export const crmValueTypes = ['text', 'number', 'date', 'boolean', 'email', 'phone', 'json', 'enum'] as const
export const paidPlanKeys = ['hosted_growth', 'hosted_scale'] as const

export const schemaFieldPayloadSchema = z.object({
  workspaceId: z.string().uuid().optional(),
  entityType: z.string().min(2),
  key: z.string().min(2).regex(/^[a-z][a-z0-9_]*$/),
  label: z.string().min(2),
  type: z.enum(crmValueTypes),
  required: z.boolean().default(false),
  origin: z.enum(['custom', 'agent']).default('custom')
})

export const checkoutPayloadSchema = z.object({
  email: z.string().email(),
  plan: z.enum(paidPlanKeys)
})

export const graphSearchQuerySchema = z.object({
  q: z.string().trim().optional()
})

export const crmEventPayloadSchema = z.object({
  eventId: z.string().min(3),
  eventType: z.string().min(3),
  workspaceId: z.string().uuid().optional(),
  sourceSystem: z.string().min(2),
  occurredAt: z.string().datetime(),
  idempotencyKey: z.string().min(3),
  actor: z.record(z.string(), z.unknown()).default({}),
  subject: z.object({
    customerKey: z.string().optional(),
    externalCustomerRefs: z.array(z.object({
      system: z.string().min(1),
      id: z.string().min(1)
    })).default([])
  }).default({ externalCustomerRefs: [] }),
  context: z.record(z.string(), z.unknown()).default({}),
  payload: z.record(z.string(), z.unknown()).default({}),
  schemaVersion: z.number().int().positive().default(1)
})

export type SchemaFieldPayload = z.infer<typeof schemaFieldPayloadSchema>
export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>
export type CrmEventPayload = z.infer<typeof crmEventPayloadSchema>
