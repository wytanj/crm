import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

function read(path: string) {
  return readFileSync(join(root, path), 'utf8')
}

describe('agent documentation coverage', () => {
  it('documents every current server API route for agents', () => {
    const apiDocs = read('docs/agents/API_CONTRACT.md')
    const routeFiles = readdirSync(join(root, 'server/api'), { recursive: true })
      .filter((file): file is string => typeof file === 'string')
      .filter((file) => /\.(get|post|put|delete|patch)\.ts$/.test(file))

    for (const file of routeFiles) {
      const route = `/api/${file}`
        .replace(/\\/g, '/')
        .replace(/\.(get|post|put|delete|patch)\.ts$/, '')
        .replace(/\/index$/, '')

      expect(apiDocs, `Missing ${route} in API_CONTRACT.md`).toContain(route)
    }
  })

  it('tells future agents to update docs when contracts change', () => {
    const guide = read('AGENTS.md')
    expect(guide).toContain('update the matching documentation in the same change')
    expect(guide).toContain('docs/agents/API_CONTRACT.md')
    expect(guide).toContain('docs/agents/DATA_MODEL.md')
    expect(guide).toContain('docs/agents/AGENT_PROTOCOL.md')
  })
})
