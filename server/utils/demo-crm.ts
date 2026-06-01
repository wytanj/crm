import type { CrmGraphResponse } from '../../app/types/crm'

export const shopifyCustomerFields = [
  { key: 'email', label: 'Email', type: 'email', required: true, origin: 'core' },
  { key: 'phone', label: 'Phone', type: 'phone', required: false, origin: 'core' },
  { key: 'first_name', label: 'First name', type: 'text', required: false, origin: 'core' },
  { key: 'last_name', label: 'Last name', type: 'text', required: false, origin: 'core' },
  { key: 'accepts_marketing', label: 'Accepts marketing', type: 'boolean', required: false, origin: 'core' },
  { key: 'tags', label: 'Tags', type: 'json', required: false, origin: 'core' },
  { key: 'note', label: 'Internal note', type: 'text', required: false, origin: 'core' },
  { key: 'default_address', label: 'Default address', type: 'json', required: false, origin: 'core' },
  { key: 'orders_count', label: 'Orders count', type: 'number', required: false, origin: 'integration' },
  { key: 'total_spent', label: 'Total spent', type: 'number', required: false, origin: 'integration' },
  { key: 'currency', label: 'Currency', type: 'text', required: false, origin: 'integration' },
  { key: 'last_order_at', label: 'Last order date', type: 'date', required: false, origin: 'integration' },
  { key: 'source_channel', label: 'Source channel', type: 'text', required: false, origin: 'integration' },
  { key: 'company_name', label: 'Company name', type: 'text', required: false, origin: 'custom' },
  { key: 'lifecycle_stage', label: 'Lifecycle stage', type: 'enum', required: false, origin: 'custom' }
] as const

export const demoCrmGraph: CrmGraphResponse = {
  metrics: [
    { label: 'Unified profiles', value: '12,842', detail: 'People and companies in the graph' },
    { label: 'Resolved identities', value: '86%', detail: 'Profiles with at least two linked signals' },
    { label: 'Agent proposals', value: '31', detail: 'Waiting on approval or review' },
    { label: 'Connected channels', value: '7', detail: 'Shopify, POS, support, ads, email, chat, CSV' }
  ],
  entities: [
    {
      id: 'person_001',
      type: 'person',
      label: 'Ava Tan',
      externalIds: { shopify: 'gid://shopify/Customer/71001', pos: 'cust_1194' },
      tags: ['vip', 'repeat buyer', 'b2c'],
      attributes: {
        email: 'ava@example.com',
        phone: '+65 8123 4470',
        accepts_marketing: true,
        total_spent: 2840,
        currency: 'SGD',
        orders_count: 18,
        lifecycle_stage: 'loyal'
      },
      createdAt: '2026-04-04T09:20:00.000Z',
      updatedAt: '2026-05-28T11:10:00.000Z'
    },
    {
      id: 'company_001',
      type: 'company',
      label: 'North Bridge Studio',
      externalIds: { hubspot: 'company_982', xero: 'contact_882' },
      tags: ['b2b', 'retail partner'],
      attributes: {
        domain: 'northbridge.example',
        country: 'SG',
        lifecycle_stage: 'active account',
        annual_value: 46000
      },
      createdAt: '2026-03-12T06:45:00.000Z',
      updatedAt: '2026-05-30T08:15:00.000Z'
    },
    {
      id: 'order_001',
      type: 'order',
      label: '#SG-10492',
      externalIds: { shopify: 'gid://shopify/Order/10492' },
      tags: ['online', 'fulfilled'],
      attributes: {
        total_price: 428,
        currency: 'SGD',
        channel: 'Shopify',
        financial_status: 'paid'
      },
      createdAt: '2026-05-28T10:18:00.000Z',
      updatedAt: '2026-05-28T10:26:00.000Z'
    },
    {
      id: 'ticket_001',
      type: 'ticket',
      label: 'Return size exchange',
      externalIds: { zendesk: 'ticket_55091' },
      tags: ['service', 'exchange'],
      attributes: {
        sentiment: 'neutral',
        priority: 'normal',
        status: 'open'
      },
      createdAt: '2026-05-29T03:08:00.000Z',
      updatedAt: '2026-05-29T04:15:00.000Z'
    }
  ],
  relationships: [
    {
      id: 'rel_001',
      fromEntityId: 'person_001',
      toEntityId: 'order_001',
      type: 'placed_order',
      confidence: 1,
      source: 'shopify'
    },
    {
      id: 'rel_002',
      fromEntityId: 'person_001',
      toEntityId: 'ticket_001',
      type: 'opened_ticket',
      confidence: 0.96,
      source: 'support_email'
    },
    {
      id: 'rel_003',
      fromEntityId: 'person_001',
      toEntityId: 'company_001',
      type: 'works_at',
      confidence: 0.72,
      source: 'agent_resolution'
    }
  ],
  customerFields: shopifyCustomerFields.map((field) => ({ ...field })),
  integrationBacklog: [
    'Shopify customer and order sync',
    'POS order and loyalty sync',
    'Support tickets and message threads',
    'Email/SMS marketing consent timeline',
    'Ad audience exports with approval logs'
  ],
  proposals: [
    {
      id: 'proposal_001',
      title: 'Merge Ava Tan across Shopify and POS',
      impact: 'Unifies purchase history before the next loyalty segment export.',
      status: 'needs_approval'
    },
    {
      id: 'proposal_002',
      title: 'Create B2B account object for North Bridge Studio',
      impact: 'Promotes repeated wholesale orders into a company profile with contacts.',
      status: 'draft'
    },
    {
      id: 'proposal_003',
      title: 'Add channel field for TikTok Shop imports',
      impact: 'Lets future agents map orders by marketplace without a schema migration.',
      status: 'approved'
    }
  ]
}
