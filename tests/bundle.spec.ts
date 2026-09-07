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

  it('pins the DSH 0.1.3-alpha.2 development graph without enabling publication', () => {
    const manifestPath = fileURLToPath(new URL('../package.json', import.meta.url))
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      version?: string
      private?: boolean
      peerDependencies?: Record<string, string>
      dsh?: { client?: { inject?: string[] } }
    }

    expect(manifest.version).toBe('0.1.1-alpha.0')
    expect(manifest.private).toBe(true)
    expect(manifest.peerDependencies?.['@deepseek-ai/dsh-client-runtime']).toBeUndefined()
    expect(manifest.peerDependencies?.['@deepseek-ai/dsh-client-ui-chat']).toBe('0.1.3-alpha.2')
    expect(manifest.peerDependencies?.['@deepseek-ai/dsh-client-ui-session']).toBe('0.1.3-alpha.2')
    expect(Object.entries(manifest.peerDependencies ?? {})
      .filter(([name]) => name.startsWith('@deepseek-ai/dsh-client-'))
      .every(([, version]) => version === '0.1.3-alpha.2')).toBe(true)
    expect(manifest.dsh?.client?.inject).not.toContain('@deepseek-ai/dsh-client-runtime')
    expect(manifest.dsh?.client?.inject).toEqual(expect.arrayContaining([
      '@deepseek-ai/dsh-client-ui-chat',
      '@deepseek-ai/dsh-client-ui-session',
    ]))
  })

  it('does not silently retain rc1 auto-installed peers in the alpha lockfile', () => {
    const lockfile = readFileSync(new URL('../pnpm-lock.yaml', import.meta.url), 'utf8')
    const packages = lockfile.split('\nsnapshots:')[0]
    const versions = [...packages.matchAll(/^  '@deepseek-ai\/dsh(?:-[^@']+)?@([^']+)':/gm)]
      .map(match => match[1])
    expect(versions.length).toBeGreaterThan(200)
    expect(new Set(versions)).toEqual(new Set(['0.1.3-alpha.2']))
  })
})
