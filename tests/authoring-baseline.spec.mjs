import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import {
  assertAuthoringBaseline, AUTHORING_DSH_VERSION,
  AUTHORING_COMPOSITION_VERSION, AUTHORING_LAB_VERSION,
} from '../scripts/authoring-baseline.mjs'

function manifests() {
  return [
    { version: AUTHORING_DSH_VERSION },
    { name: '@oh-my-dsh/dsh-a11y-local-preview', version: AUTHORING_COMPOSITION_VERSION },
    { name: '@oh-my-dsh/dsh-accessibility', version: AUTHORING_LAB_VERSION },
  ]
}

describe('current authoring compatibility baseline', () => {
  it('accepts the exact current candidate without changing historical contracts', () => {
    expect(() => assertAuthoringBaseline(...manifests())).not.toThrow()
    const historical = JSON.parse(readFileSync(new URL('../AUTHORING-AGENT-LAB.schema.json', import.meta.url), 'utf8'))
    const current = JSON.parse(readFileSync(new URL('../AUTHORING-AGENT-LAB-0.2.0.schema.json', import.meta.url), 'utf8'))
    expect(historical.properties.dsh.properties.version.const).toBe('0.1.2-alpha.2')
    expect(current.properties.dsh.properties.version.const).toBe(AUTHORING_DSH_VERSION)
    expect(current.properties.composition.properties.version.const).toBe(AUTHORING_COMPOSITION_VERSION)
    expect(current.properties.lab.properties.version.const).toBe(AUTHORING_LAB_VERSION)
    const ajv = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajv)
    expect(() => ajv.compile(current)).not.toThrow()
  })

  it('rejects old, mixed, missing, or wrong-package candidates before launch', () => {
    for (const mutate of [
      items => { items[0].version = '0.1.2-alpha.2' },
      items => { items[0].version = '0.2.1-alpha.1' },
      items => { items[1].version = '0.1.0-alpha.0' },
      items => { items[1].name = '@untrusted/other' },
      items => { items[2].version = '0.1.0-beta.6' },
      items => { items[2].name = '@untrusted/lab' },
      items => { delete items[0].version },
    ]) {
      const items = manifests()
      mutate(items)
      expect(() => assertAuthoringBaseline(...items)).toThrow('requires')
    }
  })

  it('pins all five API-dependent packages while keeping the API-independent testkit unchanged', () => {
    const policy = JSON.parse(readFileSync(new URL('../AUTHORING-PACKAGES.json', import.meta.url), 'utf8'))
    expect(policy.packages).toHaveLength(6)
    for (const spec of policy.packages) {
      expect(spec.version).toBe(spec.name.endsWith('/dsh-a11y-testkit') ? '0.1.0-alpha.0' : AUTHORING_COMPOSITION_VERSION)
      for (const [name, version] of Object.entries(spec.internalDependencies)) {
        expect(version).toBe(name.endsWith('/dsh-a11y-testkit') ? '0.1.0-alpha.0' : AUTHORING_COMPOSITION_VERSION)
      }
    }
  })
})
