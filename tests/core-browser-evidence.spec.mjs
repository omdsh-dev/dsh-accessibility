import { readFile } from 'node:fs/promises'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { describe, expect, it } from 'vitest'

const reports = [
  {
    file: '2026-08-31-dsh-0.1.2-alpha.2-33eb2d9e1e.json',
    version: '0.1.2-alpha.2',
    revision: '33eb2d9e1ed6bc44712941f4bf40d4eda154ab9e',
  },
  {
    file: '2026-08-31-dsh-0.1.2-alpha.2-5803bfcfdd.json',
    version: '0.1.2-alpha.2',
    revision: '5803bfcfdd502adac26ae9b8eec12d6aed263ec6',
  },
  {
    file: '2026-09-07-dsh-0.1.2-rc.1-21859d968c.json',
    version: '0.1.2-rc.1',
    revision: '21859d968ce8eed23fba8f781b55300a729cc29b',
  },
  {
    file: '2026-09-07-dsh-0.1.2-rc.1-1e7f105934.json',
    version: '0.1.2-rc.1',
    revision: '1e7f105934eeb8d93dedcf738c480fab30069109',
  },
  {
    file: '2026-10-05-dsh-0.2.0-rc.2-ecef752eb2.json',
    version: '0.2.0-rc.2',
    revision: 'ecef752eb2b95f8a8f3c7863ed633a466355115a',
  },
  {
    file: '2026-10-05-dsh-0.2.0-rc.2-7042120c03.json',
    version: '0.2.0-rc.2',
    revision: '7042120c039a874499ce8754de7975b4ef05cb41',
  },
  {
    file: '2026-10-05-dsh-0.2.0-rc.2-1001be8032.json',
    version: '0.2.0-rc.2',
    revision: '1001be8032d1ba0d6c9c3fb7a8ef65f28151d9d6',
  },
  {
    file: '2026-10-06-dsh-0.2.0-rc.2-19ea4ee861.json',
    version: '0.2.0-rc.2',
    revision: '19ea4ee861327dfb5f195925f04564b96ecec764',
  },
  {
    file: '2026-10-06-dsh-0.2.0-rc.2-1d321f2053.json',
    version: '0.2.0-rc.2',
    revision: '1d321f2053c547d353c0ab033444e0dd148f68ae',
  },
  {
    file: '2026-10-06-dsh-0.2.0-rc.2-9efb400069.json',
    version: '0.2.0-rc.2',
    revision: '9efb40006952158d75fbdce459a0c4958f4e02be',
  },
]

function reportUrl(file) {
  return new URL(`../automated-evidence/core-browser/${file}`, import.meta.url)
}

// Keep the first campaign bound to its original revision; the new candidate
// must satisfy the same contracts independently, without replacing that record.
const contractReports = [reports[3], reports[4], reports[5], reports[6], reports[7], reports[8], reports[9]]

const expectedTasks = [
  'discover-structure',
  'navigate-sessions',
  'search-sessions',
  'adjust-layout',
  'switch-session-view',
  'read-conversation',
  'inspect-trajectory',
  'configure-settings',
  'edit-composer-draft',
]

const expectedChecks = [
  'core.shell-and-splitters',
  'core.workspace-tree-and-search',
  'core.session-view-tabs',
  'core.trajectory-navigation',
  'core.composer-draft',
  'core.model-and-command-menus',
  'core.file-disclosure',
  'core.settings-focus',
  'core.full-access-risk',
  'environment.reflow',
  'environment.transcript',
  'environment.focus-not-obscured',
  'environment.forced-colors',
  'environment.reduced-motion',
]

describe('archived core browser evidence', () => {
  it.each(reports)('validates $file and its exact revision against the public schema', async ({ file, version, revision }) => {
    const [schema, report] = await Promise.all([
      readFile(new URL('../CORE-BROWSER-EVIDENCE.schema.json', import.meta.url), 'utf8').then(JSON.parse),
      readFile(reportUrl(file), 'utf8').then(JSON.parse),
    ])
    const ajv = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajv)
    const validate = ajv.compile(schema)
    expect(validate(report), JSON.stringify(validate.errors)).toBe(true)
    expect(report.dsh).toEqual({
      package: '@deepseek-ai/dsh-root',
      version,
      revision,
      dirty: false,
    })
    expect(file).toContain(revision.slice(0, 10))
  })

  it.each(contractReports)('requires all engines, checks, and tasks independently for $revision', async ({ file }) => {
    const report = JSON.parse(await readFile(reportUrl(file), 'utf8'))
    expect(report.result).toBe('pass')
    expect(report.engines.map(item => item.engine)).toEqual(['chromium', 'firefox', 'webkit'])
    expect(report.scope.coreTasks.map(item => item.id)).toEqual(expectedTasks)
    for (const engine of report.engines) {
      expect(engine.checks.map(item => item.id)).toEqual(expectedChecks)
      expect(engine.testProcess.failed).toBe(0)
      const forcedColors = engine.checks.find(item => item.id === 'environment.forced-colors')
      expect(forcedColors.status).toBe(engine.engine === 'chromium' ? 'passed' : 'not-run')
      expect(engine.checks.filter(item => item.id !== 'environment.forced-colors')
        .every(item => item.status === 'passed')).toBe(true)
    }
  })

  it.each(contractReports)('retains non-AT and non-user evidence boundaries for $revision', async ({ file }) => {
    const report = JSON.parse(await readFile(reportUrl(file), 'utf8'))
    const limitations = report.limitations.join(' ')
    expect(limitations).toMatch(/not assistive-technology/iu)
    expect(limitations).toMatch(/not a real browser-zoom/iu)
    expect(limitations).toMatch(/not a Windows High Contrast/iu)
    expect(limitations).toMatch(/do not prove independent, effective, or safe human completion/iu)
  })
})
