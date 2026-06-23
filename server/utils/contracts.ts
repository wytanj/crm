import { z } from 'zod'

export const crmValueTypes = ['text', 'number', 'date', 'boolean', 'email', 'phone', 'json', 'enum', 'single_select', 'multi_select', 'tag_list'] as const
export const paidPlanKeys = ['hosted_growth', 'hosted_scale'] as const
export const workspaceRoles = ['owner', 'admin', 'member', 'agent'] as const
export const profileSensitivityLevels = ['public', 'internal', 'confidential', 'restricted'] as const

export const schemaFieldPayloadSchema = z.object({
  workspaceId: z.string().uuid().optional(),
  entityType: z.string().min(2),
  key: z.string().min(2).regex(/^[a-z][a-z0-9_]*$/),
  label: z.string().min(2),
  type: z.enum(crmValueTypes),
  required: z.boolean().default(false),
  origin: z.enum(['custom', 'agent']).default('custom'),
  packKey: z.string().regex(/^[a-z][a-z0-9_]*$/).optional(),
  description: z.string().optional(),
  helpText: z.string().optional(),
  sensitivityLevel: z.enum(profileSensitivityLevels).default('internal'),
  posVisible: z.boolean().default(false),
  cashierEditable: z.boolean().default(false),
  marketingUsable: z.boolean().default(false),
  uiContexts: z.array(z.string()).default([]),
  enumValues: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  metadata: z.record(z.string(), z.unknown()).default({})
})

export const profilePackInstallPayloadSchema = z.object({
  workspaceId: z.string().uuid()
})

export const profileFieldUpdatePayloadSchema = z.object({
  workspaceId: z.string().uuid().optional(),
  packKey: z.string().regex(/^[a-z][a-z0-9_]*$/),
  fields: z.record(z.string().regex(/^[a-z][a-z0-9_]*$/), z.unknown()),
  sourceSystem: z.string().min(2).default('crm_ui')
})

export const checkoutPayloadSchema = z.object({
  email: z.string().email(),
  plan: z.enum(paidPlanKeys)
})

export const graphSearchQuerySchema = z.object({
  q: z.string().trim().optional(),
  workspaceId: z.string().uuid().optional()
})

export const workspaceScopedQuerySchema = z.object({
  workspaceId: z.string().uuid().optional()
})

export const workspaceSetupPayloadSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(64).optional().or(z.literal('')),
  plan: z.enum(paidPlanKeys).default('hosted_growth')
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
export type WorkspaceSetupPayload = z.infer<typeof workspaceSetupPayloadSchema>
export type ProfilePackInstallPayload = z.infer<typeof profilePackInstallPayloadSchema>
export type ProfileFieldUpdatePayload = z.infer<typeof profileFieldUpdatePayloadSchema>
