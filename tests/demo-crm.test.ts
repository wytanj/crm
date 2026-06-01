import { describe, expect, it } from 'vitest'
import { demoCrmGraph, shopifyCustomerFields } from '../server/utils/demo-crm'

describe('base CRM graph contract', () => {
  it('ships the minimal commerce customer fields agents can depend on', () => {
    const fields = new Map(shopifyCustomerFields.map((field) => [field.key, field]))

    expect(fields.get('email')).toMatchObject({
      type: 'email',
      required: true,
      origin: 'core'
    })

    for (const key of [
      'phone',
      'first_name',
      'last_name',
      'accepts_marketing',
      'tags',
      'note',
      'default_address',
      'orders_count',
      'total_spent',
      'currency',
      'last_order_at',
      'source_channel',
      'company_name',
      'lifecycle_stage'
    ]) {
      expect(fields.has(key)).toBe(true)
    }
  })

  it('does not duplicate base field keys', () => {
    const keys = shopifyCustomerFields.map((field) => field.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('keeps relationships attached to known graph entities', () => {
    const entityIds = new Set(demoCrmGraph.entities.map((entity) => entity.id))

    for (const relationship of demoCrmGraph.relationships) {
      expect(entityIds.has(relationship.fromEntityId)).toBe(true)
      expect(entityIds.has(relationship.toEntityId)).toBe(true)
      expect(relationship.confidence).toBeGreaterThan(0)
      expect(relationship.confidence).toBeLessThanOrEqual(1)
    }
  })

  it('includes agent proposal states for approval-first workflows', () => {
    expect(demoCrmGraph.proposals.map((proposal) => proposal.status)).toEqual(
      expect.arrayContaining(['draft', 'needs_approval', 'approved'])
    )
  })
})
