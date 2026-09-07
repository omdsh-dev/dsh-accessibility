import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import configs from '../tsdown.config.ts'

describe('browser bundle registration', () => {
  it('registers the scoped npm package id expected by the DSH module loader', () => {
    const outputOptions = configs[1]?.outputOptions as { banner?: string } | undefined

    expect(outputOptions?.banner).toContain('id: "@oh-my-dsh/dsh-accessibility"')
  })

  it('ships the versioned accessibility protocols and disposable CLI launchers', () => {
    const manifestPath = fileURLToPath(new URL('../package.json', import.meta.url))
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      files?: string[]
      scripts?: Record<string, string>
    }

    expect(manifest.files).toEqual(
      expect.arrayContaining([
        'CLI-ACCESSIBILITY.md',
        'CLI-ACCESSIBILITY.zh.md',
        'RFC-A11Y-AUTHORING.md',
        'RFC-A11Y-AUTHORING.zh.md',
        'DIAGNOSTIC-REPORT.md',
        'DIAGNOSTIC-REPORT.zh.md',
        'DIAGNOSTIC-REPORT.schema.json',
        'scripts/run-cli-conformance.mjs',
        'scripts/cli-conformance.template.ts',
      ]),
    )
    expect(manifest.scripts?.['lab:cli']).toBe('node scripts/run-cli-conformance.mjs')
  })

  it('pins the exact DSH 0.1.2-rc.1 client graph and excludes the retired runtime package', () => {
    const manifestPath = fileURLToPath(new URL('../package.json', import.meta.url))
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      version?: string
      peerDependencies?: Record<string, string>
      dsh?: { client?: { inject?: string[] } }
    }

    expect(manifest.version).toBe('0.1.0-beta.7')
    expect(manifest.peerDependencies?.['@deepseek-ai/dsh-client-runtime']).toBeUndefined()
    expect(manifest.peerDependencies?.['@deepseek-ai/dsh-client-ui-chat']).toBe('0.1.2-rc.1')
    expect(manifest.peerDependencies?.['@deepseek-ai/dsh-client-ui-session']).toBe('0.1.2-rc.1')
    expect(Object.entries(manifest.peerDependencies ?? {})
      .filter(([name]) => name.startsWith('@deepseek-ai/dsh-client-'))
      .every(([, version]) => version === '0.1.2-rc.1')).toBe(true)
    expect(manifest.dsh?.client?.inject).not.toContain('@deepseek-ai/dsh-client-runtime')
    expect(manifest.dsh?.client?.inject).toEqual(expect.arrayContaining([
      '@deepseek-ai/dsh-client-ui-chat',
      '@deepseek-ai/dsh-client-ui-session',
    ]))
  })
})
