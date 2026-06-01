export type PlanKey = 'open_source' | 'hosted_growth' | 'hosted_scale'

export type CrmEntityKind =
  | 'person'
  | 'company'
  | 'household'
  | 'order'
  | 'product'
  | 'ticket'
  | 'message'
  | 'campaign'
  | 'custom'

export interface CrmEntity {
  id: string
  type: CrmEntityKind
  label: string
  externalIds: Record<string, string>
  attributes: Record<string, unknown>
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CrmRelationship {
  id: string
  fromEntityId: string
  toEntityId: string
  type: string
  confidence: number
  source: string
}

export interface CrmMetric {
  label: string
  value: string
  detail: string
}

export interface CrmSchemaField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'email' | 'phone' | 'json' | 'enum'
  required: boolean
  origin: 'core' | 'integration' | 'custom' | 'agent'
}

export interface CrmGraphResponse {
  metrics: CrmMetric[]
  entities: CrmEntity[]
  relationships: CrmRelationship[]
  customerFields: CrmSchemaField[]
  integrationBacklog: string[]
  proposals: Array<{
    id: string
    title: string
    impact: string
    status: 'draft' | 'needs_approval' | 'approved'
  }>
}
