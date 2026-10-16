import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function exactAgeExceptions(source) {
  const entries = new Map()
  for (const match of source.matchAll(/^  - '([^']+)'$/gm)) {
    const spec = match[1]
    const separator = spec.lastIndexOf('@')
    const name = spec.slice(0, separator)
    if (separator <= 0 || entries.has(name)) throw new Error('age exceptions require one version union per package')
    const versions = spec.slice(separator + 1).split('||').map(value => value.trim())
    if (versions.some(value => !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value))) {
      throw new Error('age exceptions require exact versions')
    }
    entries.set(name, versions)
  }
  return entries
}

describe('exact dependency age exceptions', () => {
  it('keeps each declared DSH target in one exact-version union, without wildcard exceptions', () => {
    const workspace = readFileSync(new URL('../pnpm-workspace.yaml', import.meta.url), 'utf8')
    const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
    const entries = exactAgeExceptions(workspace.split('minimumReleaseAgeExclude:\n')[1])
    for (const [name, version] of Object.entries(manifest.devDependencies)) {
      if (name === '@deepseek-ai/dsh' || name.startsWith('@deepseek-ai/dsh-')) {
        expect(entries.get(name), name).toContain(version)
      }
    }
  })

  it('rejects duplicate package entries whose first match would hide the newer version', () => {
    expect(() => exactAgeExceptions("  - '@deepseek-ai/dsh@0.2.0-rc.2'\n  - '@deepseek-ai/dsh@0.2.1-alpha.5'\n"))
      .toThrow('one version union per package')
  })

  it('retains both exact releases in a union but rejects a wildcard relaxation', () => {
    expect(exactAgeExceptions("  - '@deepseek-ai/dsh@0.2.0-rc.2 || 0.2.1-alpha.5'\n").get('@deepseek-ai/dsh'))
      .toEqual(['0.2.0-rc.2', '0.2.1-alpha.5'])
    expect(() => exactAgeExceptions("  - '@deepseek-ai/dsh@*'\n"))
      .toThrow('exact versions')
  })
})
