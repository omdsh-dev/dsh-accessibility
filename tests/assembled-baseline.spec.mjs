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
  expect(normalized).toContain('repository: omdsh-dev/deepseek-harness\n          ref: bc345ae4124f35560276b3666130d7e6dd6ee19a')
  expect(normalized).not.toContain('ref: feat/a11y-core-0.2.0-rc.2')
}

function expectNativeWindowsGate(workflow) {
  const normalized = workflow.replaceAll('\r\n', '\n')
  const nativeJob = normalized.split('\n  core-windows-acl:\n')[1]?.split('\n  ci:\n')[0]
  expect(nativeJob).toBeDefined()
  expect(nativeJob).toContain('runs-on: windows-latest')
  expect(nativeJob).toContain('repository: omdsh-dev/deepseek-harness\n          ref: bc345ae4124f35560276b3666130d7e6dd6ee19a')
  expect(nativeJob).toContain('pnpm exec vitest run packages/sandbox/sandbox-windows-acl/tests/diagnose-script.spec.ts --maxWorkers=2')
  expect(normalized).toContain('needs: [validate, assembled-browser, core-windows-acl]')
  expect(normalized).toContain('WINDOWS_ACL_RESULT: ${{ needs.core-windows-acl.result }}')
  expect(normalized).toContain('test "$WINDOWS_ACL_RESULT" = success')
}

function expectEarlyIntegrationPreflight(workflow) {
  const preflight = workflow.indexOf('run: node scripts/verify-assembled-baseline.mjs .assembled/dsh .')
  expect(preflight).toBeGreaterThanOrEqual(0)
  expect(preflight).toBeLessThan(workflow.indexOf('name: Install and build companion'))
  expect(preflight).toBeLessThan(workflow.indexOf('name: Install and build DSH baseline'))
}

describe('assembled baseline preflight', () => {
  it('rejects a held or mismatched CI integration before installing and building the two graphs', () => {
    expectEarlyIntegrationPreflight(readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8'))
  })

  it('rejects removing the early integration preflight', () => {
    const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
      .replace('run: node scripts/verify-assembled-baseline.mjs .assembled/dsh .', 'run: true')
    expect(() => expectEarlyIntegrationPreflight(workflow)).toThrow()
  })
  it.each(['\n', '\r\n'])('requires an independent native Windows fixture verdict with %j line endings', (lineEnding) => {
    const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
    expectNativeWindowsGate(workflow.replaceAll('\r\n', '\n').replaceAll('\n', lineEnding))
  })
  it.each([
    ['runs-on: windows-latest', 'runs-on: ubuntu-latest'],
    ['needs: [validate, assembled-browser, core-windows-acl]', 'needs: [validate, assembled-browser]'],
    ['test "$WINDOWS_ACL_RESULT" = success', 'true'],
  ])('rejects a missing native Windows gate guarantee %s', (source, replacement) => {
    const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8').replaceAll(source, replacement)
    expect(() => expectNativeWindowsGate(workflow)).toThrow()
  })
  it.each(['\n', '\r\n'])('pins assembled CI to the exact patched rc.2 core revision with %j line endings', (lineEnding) => {
    const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
    expectPinnedCoreRevision(workflow.replaceAll('\r\n', '\n').replaceAll('\n', lineEnding))
  })
  it.each(['0'.repeat(40), 'feat/a11y-core-0.2.0-rc.2'])('still rejects a wrong or moving CI core ref %s', (ref) => {
    const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')
      .replaceAll('bc345ae4124f35560276b3666130d7e6dd6ee19a', ref)
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

  it.each([null, '0.2.0-rc.2', [], { dsh: undefined }, { dsh: '*' }, { dsh: '0.2.1-alpha.5' }])('rejects malformed or overriding engines %j before creating lab state', (engines) => {
    expect(() => assertCompanionBaseline({ version: '0.2.0-rc.2' }, { ...companion(), engines }))
      .toThrow('exact matching engines.dsh target')
  })

  it('admits the consistent primary compatibility declaration but retains the publication hold', () => {
    const candidate = { ...companion(), engines: { node: '^22.19.0 || >=24.0.0', dsh: '0.2.0-rc.2' } }
    expect(() => assertCompanionBaseline({ version: '0.2.0-rc.2' }, candidate)).not.toThrow()
    expect(() => assertCompanionBaseline({ version: '0.2.0-rc.2' }, { ...candidate, private: true }))
      .toThrow('Companion integration is blocked')
  })

  it('keeps the actual alpha migration manifest closed even on its exact target', () => {
    const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
    expect(manifest.engines.dsh).toBe('0.2.1-alpha.5')
    expect(() => assertCompanionBaseline({ version: '0.2.1-alpha.5' }, manifest))
      .toThrow('Companion integration is blocked')
    expect(() => assertCompanionBaseline({ version: '0.2.0-rc.2' }, manifest))
      .toThrow('requires DSH 0.2.1-alpha.5')
  })
})
