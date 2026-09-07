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
]

function reportUrl(file) {
  return new URL(`../automated-evidence/core-browser/${file}`, import.meta.url)
}

const currentReportUrl = reportUrl(reports.at(-1).file)

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

  it('requires all three engines, every stable check, and the nine catalog tasks on the campaign revision', async () => {
    const report = JSON.parse(await readFile(currentReportUrl, 'utf8'))
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

  it('retains the non-AT and non-user evidence boundaries', async () => {
    const report = JSON.parse(await readFile(currentReportUrl, 'utf8'))
    const limitations = report.limitations.join(' ')
    expect(limitations).toMatch(/not assistive-technology/iu)
    expect(limitations).toMatch(/not a real browser-zoom/iu)
    expect(limitations).toMatch(/not a Windows High Contrast/iu)
    expect(limitations).toMatch(/do not prove independent, effective, or safe human completion/iu)
  })
})
