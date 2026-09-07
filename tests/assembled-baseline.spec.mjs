import { describe, expect, it } from 'vitest'
import { assertCompanionBaseline } from '../scripts/verify-assembled-baseline.mjs'

function companion(privateBuild = false) {
  return {
    name: '@oh-my-dsh/dsh-accessibility',
    private: privateBuild,
    devDependencies: { '@deepseek-ai/dsh': '0.1.3-alpha.2' },
    peerDependencies: { '@deepseek-ai/dsh-client-ui-chat': '0.1.3-alpha.2' },
  }
}

describe('assembled baseline preflight', () => {
  it('rejects an rc1 checkout for an alpha companion', () => {
    expect(() => assertCompanionBaseline({ version: '0.1.2-rc.1' }, companion()))
      .toThrow('requires DSH 0.1.3-alpha.2, received 0.1.2-rc.1')
  })

  it('keeps the source/publication hold even when the version string matches', () => {
    expect(() => assertCompanionBaseline({ version: '0.1.3-alpha.2' }, companion(true)))
      .toThrow('Companion integration is blocked')
  })

  it('rejects another package or inconsistent targets', () => {
    expect(() => assertCompanionBaseline({}, { ...companion(), name: 'other' }))
      .toThrow('wrong companion package')
    expect(() => assertCompanionBaseline({}, { ...companion(), peerDependencies: {} }))
      .toThrow('matching exact DSH')
  })

  it('admits a matching target after the explicit hold is removed', () => {
    expect(() => assertCompanionBaseline({ version: '0.1.3-alpha.2' }, companion()))
      .not.toThrow()
  })
})
