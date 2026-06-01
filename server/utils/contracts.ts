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

export type SchemaFieldPayload = z.infer<typeof schemaFieldPayloadSchema>
export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>
