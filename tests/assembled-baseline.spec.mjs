import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { assertCompanionBaseline } from '../scripts/verify-assembled-baseline.mjs'

function companion(privateBuild = false) {
  return {
    name: '@oh-my-dsh/dsh-accessibility',
    private: privateBuild,
    devDependencies: { '@deepseek-ai/dsh': '0.2.0-rc.2' },
    peerDependencies: { '@deepseek-ai/dsh-client-ui-chat': '0.2.0-rc.2' },
  }
}

describe('assembled baseline preflight', () => {
  it.each(['run-at-lab.mjs', 'run-core-at-lab.mjs', 'run-live-at-lab.mjs', 'run-cli-conformance.mjs', 'run-assembled-browser.mjs'])('%s checks the exact companion target before creating state', (launcher) => {
    const source = readFileSync(new URL(`../scripts/${launcher}`, import.meta.url), 'utf8')
    expect(source).toContain('assertCompanionBaseline(dshManifest,')
    expect(source.indexOf('assertCompanionBaseline(dshManifest,')).toBeLessThan(source.indexOf('exactGitRevision(dshRoot,'))
  })
  it.each(['0.1.2-rc.1', '0.1.7-alpha.1', '0.1.7-rc.2', '0.2.0-rc.1', '0.2.1-alpha.1'])('rejects the unvalidated %s checkout', (version) => {
    expect(() => assertCompanionBaseline({ version }, companion()))
      .toThrow(`requires DSH 0.2.0-rc.2, received ${version}`)
  })

  it('keeps the source/publication hold even when the version string matches', () => {
    expect(() => assertCompanionBaseline({ version: '0.2.0-rc.2' }, companion(true)))
      .toThrow('Companion integration is blocked')
  })

  it('rejects another package or inconsistent targets', () => {
    expect(() => assertCompanionBaseline({}, { ...companion(), name: 'other' }))
      .toThrow('wrong companion package')
    expect(() => assertCompanionBaseline({}, { ...companion(), peerDependencies: {} }))
      .toThrow('matching exact DSH')
  })

  it('admits a matching target after the explicit hold is removed', () => {
    expect(() => assertCompanionBaseline({ version: '0.2.0-rc.2' }, companion()))
      .not.toThrow()
  })
})
