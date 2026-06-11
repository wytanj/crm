import { describe, expect, it } from 'vitest'
import {
  checkoutPayloadSchema,
  crmEventPayloadSchema,
  graphSearchQuerySchema,
  schemaFieldPayloadSchema
} from '../server/utils/contracts'

describe('agent schema extension contract', () => {
  it('accepts an agent-proposed custom field', () => {
    const payload = schemaFieldPayloadSchema.parse({
      entityType: 'person',
      key: 'preferred_channel',
      label: 'Preferred channel',
      type: 'text',
      required: false,
      origin: 'agent'
    })

    expect(payload).toMatchObject({
      entityType: 'person',
      key: 'preferred_channel',
      origin: 'agent'
    })
  })

  it('defaults schema field origin to custom for human-created fields', () => {
    const payload = schemaFieldPayloadSchema.parse({
      entityType: 'company',
      key: 'annual_contract_value',
      label: 'Annual contract value',
      type: 'number'
    })

    expect(payload.required).toBe(false)
    expect(payload.origin).toBe('custom')
  })

  it('rejects field keys that would be unsafe as schema handles', () => {
    expect(() => schemaFieldPayloadSchema.parse({
      entityType: 'person',
      key: 'Preferred Channel',
      label: 'Preferred channel',
      type: 'text'
    })).toThrow()
  })
})

describe('API payload contracts', () => {
  it('only accepts hosted paid plans for checkout', () => {
    expect(checkoutPayloadSchema.parse({
      email: 'founder@example.com',
      plan: 'hosted_growth'
    }).plan).toBe('hosted_growth')

    expect(() => checkoutPayloadSchema.parse({
      email: 'founder@example.com',
      plan: 'open_source'
    })).toThrow()
  })

  it('normalizes graph search input by trimming whitespace', () => {
    expect(graphSearchQuerySchema.parse({ q: '  ava  ' }).q).toBe('ava')
  })

  it('accepts the cross-repo event contract with idempotency', () => {
    const payload = crmEventPayloadSchema.parse({
      eventId: 'pos_sale_123',
      eventType: 'pos.sale.completed',
      sourceSystem: 'pos',
      occurredAt: '2026-06-11T04:00:00.000Z',
      idempotencyKey: 'pos:store_001:txn_123',
      subject: {
        externalCustomerRefs: [
          { system: 'pos', id: 'cust_123' }
        ]
      },
      context: {
        channel: 'pos',
        country: 'SG',
        currency: 'SGD'
      }
    })

    expect(payload.schemaVersion).toBe(1)
    expect(payload.subject.externalCustomerRefs[0]).toMatchObject({ system: 'pos', id: 'cust_123' })
  })
})
