import { readFile } from 'node:fs/promises'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { describe, expect, it } from 'vitest'

const evidenceUrl = new URL(
  '../automated-evidence/authoring-agent/2026-08-31-dsh-0.1.2-alpha.2-5803bfcfdd-lab-abc773b69b.json',
  import.meta.url,
)

async function readEvidence() {
  return JSON.parse(await readFile(evidenceUrl, 'utf8'))
}

describe('archived authoring agent evidence', () => {
  it('validates against the exact versioned public schema', async () => {
    const [schema, evidence] = await Promise.all([
      readFile(new URL('../AUTHORING-AGENT-LAB.schema.json', import.meta.url), 'utf8').then(JSON.parse),
      readEvidence(),
    ])
    const ajv = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajv)
    const validate = ajv.compile(schema)
    expect(validate(evidence), JSON.stringify(validate.errors)).toBe(true)
  })

  it('binds the installed product loop and unresolved plan to exact clean source revisions', async () => {
    const evidence = await readEvidence()
    expect(evidence.dsh).toEqual({
      version: '0.1.2-alpha.2',
      revision: '5803bfcfdd502adac26ae9b8eec12d6aed263ec6',
    })
    expect(evidence.lab.revision).toBe('abc773b69b38a40d66ae0aef0b0c3286aeaf1515')
    expect(evidence.composition.revision).toBe('3675b8ea8133d0aad051d42d4bbce9a902c326ab')
    expect(evidence.composition.installation).toMatchObject({
      kind: 'fresh-local-tarball',
      dependencyPackageCount: 6,
    })
    expect(evidence.task).toMatchObject({
      toolSequence: ['a11y_check', 'read', 'edit', 'a11y_check'],
      authorReviewPlan: {
        auditResultsValidated: 2,
        protocol: 'dsh-a11y-author-review-plan/0.1.0-draft',
        claim: 'none',
        status: 'unresolved',
        unresolvedRows: 11,
      },
    })
  })

  it('retains the automated-only evidence boundary', async () => {
    const evidence = await readEvidence()
    expect(evidence.evidence).toBe('keyless-replay-product-loop-not-model-or-at-evidence')
    expect(evidence.before).toMatchObject({ failed: 2, ruleIds: ['button-name', 'image-alt'] })
    expect(evidence.after).toMatchObject({ failed: 0, ruleIds: [] })
    expect(evidence.limitations.join(' ')).toMatch(/not model reasoning.*No assistive technology.*not a WCAG/iu)
  })
})

describe('archived DSH 0.2.0 authoring agent evidence', () => {
  const currentEvidenceUrl = new URL(
    '../automated-evidence/authoring-agent/2026-10-06-dsh-0.2.0-rc.2-19ea4ee861-lab-e0161fca0e.json',
    import.meta.url,
  )

  async function readCurrentEvidence() {
    return JSON.parse(await readFile(currentEvidenceUrl, 'utf8'))
  }

  it('validates against the current exact versioned schema without replacing the historical record', async () => {
    const [schema, evidence] = await Promise.all([
      readFile(new URL('../AUTHORING-AGENT-LAB-0.2.0.schema.json', import.meta.url), 'utf8').then(JSON.parse),
      readCurrentEvidence(),
    ])
    const ajv = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajv)
    const validate = ajv.compile(schema)
    expect(validate(evidence), JSON.stringify(validate.errors)).toBe(true)
  })

  it('binds native V4 tool results and the six installed packages to exact source revisions', async () => {
    const evidence = await readCurrentEvidence()
    expect(evidence.dsh).toEqual({
      version: '0.2.0-rc.2',
      revision: '19ea4ee861327dfb5f195925f04564b96ecec764',
    })
    expect(evidence.lab).toEqual({
      package: '@oh-my-dsh/dsh-accessibility',
      version: '0.1.3-rc.1',
      revision: 'e0161fca0e7b1f7553bd3e4c9150c66dd778ad67',
    })
    expect(evidence.composition).toMatchObject({
      version: '0.1.0-alpha.1',
      revision: '9c32ecce4a593eb5cb5214a7980e5c35f3f6666c',
      installation: {
        kind: 'fresh-local-tarball',
        integrity: 'sha512-bTEiVebUXtbu3yh/XwJoO+VqJhrU6VH58Ka61eq4Q0hTRjlI9HYT2zDXtTxvTOIaSbnYlIGA0FtvpQptpN/AXg==',
        dependencyPackageCount: 6,
      },
    })
    expect(evidence.task).toMatchObject({
      outcome: 'completed',
      fileChanged: true,
      toolSequence: ['a11y_check', 'read', 'edit', 'a11y_check'],
      untrustedReportFraming: {
        auditResultsValidated: 2,
        boundaryWarningPresent: true,
        subjectDataQuoted: true,
      },
      authorReviewPlan: {
        auditResultsValidated: 2,
        claim: 'none',
        status: 'unresolved',
        unresolvedRows: 11,
      },
    })
  })

  it('does not promote automated repair into model, AT, or WCAG evidence', async () => {
    const evidence = await readCurrentEvidence()
    expect(evidence.evidence).toBe('keyless-replay-product-loop-not-model-or-at-evidence')
    expect(evidence.before).toMatchObject({ failed: 2, ruleIds: ['button-name', 'image-alt'] })
    expect(evidence.after).toMatchObject({ failed: 0, ruleIds: [] })
    expect(evidence.limitations.join(' ')).toMatch(/not model reasoning.*No assistive technology.*not a WCAG/iu)
  })
})
