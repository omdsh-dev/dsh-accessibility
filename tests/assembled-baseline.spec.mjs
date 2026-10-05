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

function expectPinnedCoreRevision(workflow) {
  const normalized = workflow.replaceAll('\r\n', '\n')
  expect(normalized).toContain('repository: omdsh-dev/deepseek-harness\n          ref: 1d321f2053c547d353c0ab033444e0dd148f68ae')
  expect(normalized).not.toContain('ref: feat/a11y-core-0.2.0-rc.2')
}

describe('assembled baseline preflight', () => {
  it.each(['\n', '\r\n'])('pins assembled CI to the exact patched rc.2 core revision with %j line endings', (lineEnding) => {
    const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
    expectPinnedCoreRevision(workflow.replaceAll('\r\n', '\n').replaceAll('\n', lineEnding))
  })
  it.each(['0'.repeat(40), 'feat/a11y-core-0.2.0-rc.2'])('still rejects a wrong or moving CI core ref %s', (ref) => {
    const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
      .replaceAll('1d321f2053c547d353c0ab033444e0dd148f68ae', ref)
    expect(() => expectPinnedCoreRevision(workflow)).toThrow()
  })
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
