import type { CrmEntity, CrmProfilePackDefinition, CrmSchemaField } from '../../app/types/crm'

type ProfileValues = Record<string, Record<string, unknown>>

export const skincareProfileFields: CrmSchemaField[] = [
  {
    key: 'skin_type',
    label: 'Skin type',
    type: 'single_select',
    required: false,
    origin: 'custom',
    packKey: 'skincare',
    enumValues: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'],
    sensitivityLevel: 'internal',
    posVisible: true,
    cashierEditable: true,
    marketingUsable: true,
    uiContexts: ['profile', 'pos', 'marketing'],
    sortOrder: 10
  },
  {
    key: 'skin_concerns',
    label: 'Skin concerns',
    type: 'multi_select',
    required: false,
    origin: 'custom',
    packKey: 'skincare',
    enumValues: ['Acne', 'Pigmentation', 'Ageing', 'Redness', 'Dehydration', 'Uneven texture'],
    sensitivityLevel: 'internal',
    posVisible: true,
    cashierEditable: true,
    marketingUsable: true,
    uiContexts: ['profile', 'pos', 'marketing'],
    sortOrder: 20
  },
  {
    key: 'reported_sensitivities',
    label: 'Reported sensitivities',
    type: 'tag_list',
    required: false,
    origin: 'custom',
    packKey: 'skincare',
    enumValues: ['fragrance', 'retinol', 'AHA', 'BHA', 'parabens', 'essential oils', 'benzoyl peroxide'],
    sensitivityLevel: 'confidential',
    posVisible: true,
    cashierEditable: true,
    marketingUsable: false,
    uiContexts: ['profile', 'pos'],
    sortOrder: 30,
    metadata: {
      warningType: 'reported_sensitivity',
      warningSeverity: 'review'
    }
  },
  {
    key: 'reported_sensitivity_note',
    label: 'Sensitivity note',
    type: 'text',
    required: false,
    origin: 'custom',
    packKey: 'skincare',
    sensitivityLevel: 'confidential',
    posVisible: true,
    cashierEditable: true,
    marketingUsable: false,
    uiContexts: ['profile', 'pos'],
    sortOrder: 40
  }
]

export const fashionFitProfileFields: CrmSchemaField[] = [
  {
    key: 'preferred_fit',
    label: 'Preferred fit',
    type: 'single_select',
    required: false,
    origin: 'custom',
    packKey: 'fashion_fit',
    enumValues: ['Slim', 'Regular', 'Relaxed', 'Oversized'],
    sensitivityLevel: 'internal',
    posVisible: true,
    cashierEditable: true,
    marketingUsable: true,
    uiContexts: ['profile', 'pos', 'marketing'],
    sortOrder: 10
  },
  {
    key: 'size_by_brand',
    label: 'Size by brand',
    type: 'json',
    required: false,
    origin: 'custom',
    packKey: 'fashion_fit',
    sensitivityLevel: 'internal',
    posVisible: true,
    cashierEditable: true,
    marketingUsable: false,
    uiContexts: ['profile', 'pos'],
    sortOrder: 20
  },
  {
    key: 'alteration_notes',
    label: 'Alteration notes',
    type: 'text',
    required: false,
    origin: 'custom',
    packKey: 'fashion_fit',
    sensitivityLevel: 'confidential',
    posVisible: true,
    cashierEditable: true,
    marketingUsable: false,
    uiContexts: ['profile', 'pos'],
    sortOrder: 30
  }
]

export const profilePackDefinitions: CrmProfilePackDefinition[] = [
  {
    key: 'skincare',
    label: 'Skincare profile',
    description: 'Self-reported skin profile fields for counter advice, campaigns, and support context.',
    vertical: 'beauty',
    status: 'active',
    installMode: 'manual',
    installed: true,
    metadata: {
      exampleCustomer: 'Ava Tan'
    },
    fields: skincareProfileFields
  },
  {
    key: 'fashion_fit',
    label: 'Fashion fit profile',
    description: 'A non-skincare fixture proving packs can model fit preferences, measurements, and notes.',
    vertical: 'fashion',
    status: 'active',
    installMode: 'manual',
    installed: false,
    fields: fashionFitProfileFields
  }
]

export function getRegisteredProfilePack(packKey: string) {
  return profilePackDefinitions.find((pack) => pack.key === packKey) || null
}

export function cloneProfilePack(pack: CrmProfilePackDefinition, installed = pack.installed ?? false): CrmProfilePackDefinition {
  return {
    ...pack,
    installed,
    fields: pack.fields.map((field) => ({ ...field }))
  }
}

export function readProfileValues(attributes: Record<string, unknown> | null | undefined): ProfileValues {
  const profilePacks = attributes?.profile_packs

  if (!profilePacks || typeof profilePacks !== 'object' || Array.isArray(profilePacks)) {
    return {}
  }

  return profilePacks as ProfileValues
}

export function mergeProfileValues(
  attributes: Record<string, unknown> | null | undefined,
  packKey: string,
  values: Record<string, unknown>
) {
  const nextAttributes = { ...(attributes || {}) }
  const profilePacks = readProfileValues(nextAttributes)

  nextAttributes.profile_packs = {
    ...profilePacks,
    [packKey]: {
      ...(profilePacks[packKey] || {}),
      ...values
    }
  }

  return nextAttributes
}

export function createCounterProfile(entity: CrmEntity, packs: CrmProfilePackDefinition[]) {
  const profileValues = readProfileValues(entity.attributes)
  const responsePacks: Record<string, { label: string, fields: Record<string, unknown> }> = {}
  const warnings: Array<{ type: string, label: string, severity: string }> = []

  for (const pack of packs) {
    const values = profileValues[pack.key] || {}
    const visibleFields: Record<string, unknown> = {}

    for (const field of pack.fields) {
      if (!field.posVisible || !(field.key in values)) {
        continue
      }

      visibleFields[field.key] = values[field.key]

      const warningType = field.metadata?.warningType
      const warningSeverity = String(field.metadata?.warningSeverity || 'review')

      if (typeof warningType === 'string') {
        const rawWarningValue = values[field.key]
        const warningValues: unknown[] = Array.isArray(rawWarningValue) ? rawWarningValue : [rawWarningValue]

        for (const warningValue of warningValues) {
          if (typeof warningValue === 'string' && warningValue.trim()) {
            warnings.push({
              type: warningType,
              label: toTitleCase(warningValue),
              severity: warningSeverity
            })
          }
        }
      }
    }

    if (Object.keys(visibleFields).length > 0) {
      responsePacks[pack.key] = {
        label: pack.label,
        fields: visibleFields
      }
    }
  }

  return {
    personId: entity.id,
    displayName: entity.label,
    source: 'crm',
    packs: responsePacks,
    warnings
  }
}

export function validateProfileFieldValues(
  fields: Record<string, unknown>,
  definitions: CrmSchemaField[]
) {
  const definitionByKey = new Map(definitions.map((definition) => [definition.key, definition]))
  const normalized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(fields)) {
    const definition = definitionByKey.get(key)

    if (!definition) {
      throw createError({ statusCode: 400, statusMessage: `Unknown profile field: ${key}` })
    }

    normalized[key] = normalizeFieldValue(definition, value)
  }

  return normalized
}

export function toDbFieldRow(workspaceId: string, field: CrmSchemaField) {
  return {
    workspace_id: workspaceId,
    entity_type: 'person',
    key: field.key,
    label: field.label,
    value_type: field.type,
    required: field.required,
    origin: field.origin,
    pack_key: field.packKey,
    description: field.description,
    help_text: field.helpText,
    sensitivity_level: field.sensitivityLevel || 'internal',
    pos_visible: field.posVisible || false,
    cashier_editable: field.cashierEditable || false,
    marketing_usable: field.marketingUsable || false,
    ui_contexts: field.uiContexts || [],
    enum_values: field.enumValues || [],
    sort_order: field.sortOrder || 0,
    metadata: field.metadata || {}
  }
}

export function mapDbField(row: Record<string, unknown>): CrmSchemaField {
  return {
    key: String(row.key),
    label: String(row.label),
    type: String(row.value_type) as CrmSchemaField['type'],
    required: Boolean(row.required),
    origin: String(row.origin) as CrmSchemaField['origin'],
    packKey: row.pack_key ? String(row.pack_key) : null,
    description: row.description ? String(row.description) : null,
    helpText: row.help_text ? String(row.help_text) : null,
    sensitivityLevel: String(row.sensitivity_level || 'internal') as CrmSchemaField['sensitivityLevel'],
    posVisible: Boolean(row.pos_visible),
    cashierEditable: Boolean(row.cashier_editable),
    marketingUsable: Boolean(row.marketing_usable),
    uiContexts: Array.isArray(row.ui_contexts) ? row.ui_contexts.map(String) : [],
    enumValues: Array.isArray(row.enum_values) ? row.enum_values.map(String) : [],
    sortOrder: Number(row.sort_order || 0),
    metadata: isRecord(row.metadata) ? row.metadata : {}
  }
}

export function composeProfilePacks(
  packRows: Array<Record<string, unknown>>,
  fieldRows: Array<Record<string, unknown>>
): CrmProfilePackDefinition[] {
  const fields = fieldRows.map(mapDbField).filter((field) => field.packKey)
  const fieldsByPack = new Map<string, CrmSchemaField[]>()

  for (const field of fields) {
    const packKey = String(field.packKey)
    fieldsByPack.set(packKey, [...(fieldsByPack.get(packKey) || []), field])
  }

  const rowByKey = new Map(packRows.map((row) => [String(row.key), row]))
  const installedKeys = new Set(rowByKey.keys())
  const registryPacks = profilePackDefinitions.map((pack) => {
    const row = rowByKey.get(pack.key)

    if (!row) {
      return cloneProfilePack(pack, false)
    }

    return {
      key: String(row.key),
      label: String(row.label),
      description: row.description ? String(row.description) : pack.description,
      vertical: row.vertical ? String(row.vertical) : pack.vertical,
      status: String(row.status || 'active') as CrmProfilePackDefinition['status'],
      installMode: String(row.install_mode || 'manual') as CrmProfilePackDefinition['installMode'],
      installed: true,
      metadata: isRecord(row.metadata) ? row.metadata : pack.metadata,
      fields: (fieldsByPack.get(pack.key) || pack.fields).sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
    }
  })

  for (const row of packRows) {
    const key = String(row.key)

    if (profilePackDefinitions.some((pack) => pack.key === key)) {
      continue
    }

    registryPacks.push({
      key,
      label: String(row.label),
      description: row.description ? String(row.description) : undefined,
      vertical: row.vertical ? String(row.vertical) : undefined,
      status: String(row.status || 'active') as CrmProfilePackDefinition['status'],
      installMode: String(row.install_mode || 'manual') as CrmProfilePackDefinition['installMode'],
      installed: installedKeys.has(key),
      metadata: isRecord(row.metadata) ? row.metadata : {},
      fields: (fieldsByPack.get(key) || []).sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
    })
  }

  return registryPacks
}

function normalizeFieldValue(definition: CrmSchemaField, value: unknown) {
  switch (definition.type) {
    case 'single_select':
    case 'enum': {
      if (typeof value !== 'string') {
        throw createError({ statusCode: 400, statusMessage: `${definition.key} must be a string.` })
      }

      if (definition.enumValues?.length && !definition.enumValues.includes(value)) {
        throw createError({ statusCode: 400, statusMessage: `${definition.key} must match an allowed option.` })
      }

      return value
    }
    case 'multi_select': {
      if (!Array.isArray(value)) {
        throw createError({ statusCode: 400, statusMessage: `${definition.key} must be an array.` })
      }

      const normalized = value.map((item) => String(item))
      const invalid = normalized.find((item) => definition.enumValues?.length && !definition.enumValues.includes(item))

      if (invalid) {
        throw createError({ statusCode: 400, statusMessage: `${definition.key} contains an invalid option.` })
      }

      return normalized
    }
    case 'tag_list': {
      if (!Array.isArray(value)) {
        throw createError({ statusCode: 400, statusMessage: `${definition.key} must be an array.` })
      }

      return value.map((item) => String(item).trim()).filter(Boolean)
    }
    case 'number': {
      const numericValue = Number(value)

      if (!Number.isFinite(numericValue)) {
        throw createError({ statusCode: 400, statusMessage: `${definition.key} must be numeric.` })
      }

      return numericValue
    }
    case 'boolean':
      return Boolean(value)
    case 'json':
      return value
    default:
      return value === null || value === undefined ? '' : String(value)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function toTitleCase(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
