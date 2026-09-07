/** External-plugin assembled browser evidence. Copied temporarily into DSH's Web test lane. */
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { arch, platform, release, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import type { Browser, BrowserContext, BrowserType, Page } from 'playwright'
import { chromium, firefox, webkit } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  fixtureUserPrompts, launchWebScaffold, seedSession, type WebScaffold,
} from './scaffold.ts'
import {
  NON_AT_BROWSER_PROTOCOL,
  assertFocusNotObscured,
  assertNoHorizontalPageOverflow,
  inspectForcedColors,
  inspectReducedMotion,
} from './dsh-accessibility.browser-contract.helper.ts'

interface AxeResult {
  violations: Array<{ id: string; impact: string | null; nodes: unknown[] }>
}

const pluginRoot = process.env.DSH_ACCESSIBILITY_PLUGIN_ROOT
if (pluginRoot === undefined || pluginRoot === '') {
  throw new Error('DSH_ACCESSIBILITY_PLUGIN_ROOT is required')
}

const pluginManifest = JSON.parse(await readFile(join(pluginRoot, 'package.json'), 'utf8')) as {
  name?: string
  version?: string
}
if (pluginManifest.name !== '@oh-my-dsh/dsh-accessibility') throw new Error('external package identity mismatch')

type EvidenceBrowser = 'chromium' | 'firefox' | 'webkit'
const browserTypes: Record<EvidenceBrowser, BrowserType> = { chromium, firefox, webkit }
const evidenceBrowsers = (process.env.DSH_ACCESSIBILITY_BROWSERS ?? 'chromium')
  .split(',').map(value => value.trim()).filter(Boolean)
if (evidenceBrowsers.length === 0
  || evidenceBrowsers.some(name => !(name in browserTypes))) {
  throw new Error(`invalid DSH_ACCESSIBILITY_BROWSERS: ${String(process.env.DSH_ACCESSIBILITY_BROWSERS)}`)
}
const dshRevision = process.env.DSH_ACCESSIBILITY_DSH_REVISION ?? 'unavailable'
const pluginRevision = process.env.DSH_ACCESSIBILITY_PLUGIN_REVISION ?? 'unavailable'

const fixturePath = join(process.cwd(), 'snapshots/web/seeded-history/session.jsonl')
const fixture = await readFile(fixturePath, 'utf8')
const [prompt] = fixtureUserPrompts(fixture)
if (prompt === undefined || prompt === '') throw new Error('assembled browser fixture has no user prompt')

describe('external dsh-accessibility Accessible View', () => {
  let temporaryRoot: string
  let scaffold: WebScaffold
  let browser: Browser
  let context: BrowserContext
  let page: Page
  const browserErrors: string[] = []

  beforeAll(async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), 'dsh-accessible-view-assembled-'))
    const harnessHome = join(temporaryRoot, 'dsh-home')
    const moduleLink = join(harnessHome, 'profiles', 'node_modules', '@oh-my-dsh', 'dsh-accessibility')
    const overlayPath = join(temporaryRoot, 'accessibility.overlay.yml')
    await mkdir(dirname(moduleLink), { recursive: true })
    await symlink(pluginRoot, moduleLink, 'dir')
    await writeFile(overlayPath, [
      '- insert:',
      '    - id: accessibility-external-e2e',
      "      name: '@oh-my-dsh/dsh-accessibility'",
      '',
    ].join('\n'))

    scaffold = await launchWebScaffold({ extraOverlayPath: overlayPath, harnessHome })
    await seedSession(scaffold, fixture, 'dsh-accessible-view-e2e')

    browser = await chromium.launch({ headless: true })
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US' })
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: scaffold.baseUrl })
    page = await context.newPage()
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })
    page.on('pageerror', error => browserErrors.push(error.message))
    await page.goto(scaffold.authenticatedUrl, { waitUntil: 'load' })
    const requireFromPlugin = createRequire(join(pluginRoot, 'package.json'))
    await page.addScriptTag({ path: requireFromPlugin.resolve('axe-core/axe.min.js') })
  }, 120_000)

  afterAll(async () => {
    const failures: unknown[] = []
    await context?.close().catch(error => failures.push(error))
    await browser?.close().catch(error => failures.push(error))
    await scaffold?.close().catch(error => failures.push(error))
    await rm(temporaryRoot, { recursive: true, force: true }).catch(error => failures.push(error))
    if (failures.length > 0) throw new AggregateError(failures, 'assembled browser cleanup failed')
  })

  it('gates content and preserves keyboard, semantics, copy, and clear behavior in Chromium', async () => {
    const groupRow = page.locator('[role="treeitem"]').first()
    await groupRow.waitFor({ state: 'visible', timeout: 30_000 })
    await groupRow.click()
    const sessionRow = page.locator('[role="treeitem"]').nth(1)
    await sessionRow.waitFor({ state: 'visible', timeout: 15_000 })
    await sessionRow.click()
    await page.getByText(prompt, { exact: true }).waitFor({ state: 'visible', timeout: 20_000 })

    const accessibleTab = page.getByRole('tab', { name: 'Accessible view' })
    await accessibleTab.waitFor({ state: 'visible', timeout: 15_000 })
    await accessibleTab.focus()
    await page.keyboard.press('Enter')

    const viewHeading = page.getByRole('heading', { level: 2, name: 'Accessible reading view' })
    await viewHeading.waitFor({ state: 'visible' })
    expect(await page.getByText(prompt, { exact: true }).count(), 'conversation content leaked before Load').toBe(0)

    const runAxe = async (): Promise<AxeResult> => await viewHeading.evaluate(async (heading): Promise<AxeResult> => {
      const root = heading.closest('section')
      if (root === null) throw new Error('accessible view section missing')
      return await (window as unknown as {
        axe: { run(node: Element, options: unknown): Promise<AxeResult> }
      }).axe.run(root, { rules: { 'color-contrast': { enabled: false } } })
    })
    const idleAxe = await runAxe()
    expect(idleAxe.violations, JSON.stringify(idleAxe.violations, null, 2)).toHaveLength(0)

    const loadButton = page.getByRole('button', { name: 'Load reading view' })
    await loadButton.focus()
    await page.keyboard.press('Enter')
    await page.getByText(prompt, { exact: true }).waitFor({ state: 'visible', timeout: 15_000 })
    expect(await viewHeading.evaluate(element => document.activeElement === element)).toBe(true)

    const records = page.getByRole('list', { name: 'Conversation records in source order' })
    expect(await records.getAttribute('aria-live')).toBe('off')
    expect(await records.locator('article').count()).toBeGreaterThan(1)

    const toolArticle = page.getByRole('article').filter({
      has: page.getByText(/^Record \d+: Tool result$/u),
    }).first()
    const outputDisclosure = toolArticle.getByRole('button', { name: 'Show tool output' })
    await outputDisclosure.waitFor({ state: 'visible' })
    expect(await outputDisclosure.getAttribute('aria-expanded')).toBe('false')
    await outputDisclosure.focus()
    await outputDisclosure.press('Enter')
    const hideOutputDisclosure = toolArticle.getByRole('button', { name: 'Hide tool output' })
    await hideOutputDisclosure.waitFor({ state: 'visible' })
    expect(await hideOutputDisclosure.getAttribute('aria-expanded')).toBe('true')
    expect(await hideOutputDisclosure.evaluate(element => document.activeElement === element)).toBe(true)

    const copyButton = page.getByRole('button', {
      name: /Copy visible message text from record \d+, Your message/u,
    }).first()
    await copyButton.waitFor({ state: 'visible' })
    await copyButton.click()
    await page.getByText(/was copied to the system clipboard/u).waitFor({ state: 'visible' })
    expect(await page.evaluate(async () => await navigator.clipboard.readText())).toBe(prompt)

    const loadedAxe = await runAxe()
    expect(loadedAxe.violations, JSON.stringify(loadedAxe.violations, null, 2)).toHaveLength(0)

    const clearButton = page.getByRole('button', { name: 'Clear reading view and return' })
    await clearButton.focus()
    await page.keyboard.press('Enter')
    await loadButton.waitFor({ state: 'visible' })
    expect(await loadButton.evaluate(element => document.activeElement === element)).toBe(true)
    expect(await page.getByText(prompt, { exact: true }).count()).toBe(0)
    expect(browserErrors, `browser console errors: ${JSON.stringify(browserErrors)}`).toHaveLength(0)

    process.stdout.write(`${JSON.stringify({
      protocol: 'dsh-accessible-view/1.0.0-draft',
      evidence: 'assembled-browser',
      dsh: '0.1.2-rc.1',
      plugin: pluginManifest.version,
      engine: 'chromium',
      idleAxeViolations: idleAxe.violations.length,
      loadedAxeViolations: loadedAxe.violations.length,
      contentGated: true,
      focusRestored: true,
      clipboardProjection: true,
    }, null, 2)}\n`)
  }, 120_000)

  it('runs contextual diagnostics, focus inspection, and strict redacted export in real DSH', async () => {
    await page.getByRole('button', { name: 'Settings', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Settings' })
    await dialog.waitFor({ state: 'visible', timeout: 15_000 })
    await dialog.getByRole('button', { name: 'Accessibility', exact: true }).click()
    const heading = dialog.getByRole('heading', { level: 2, name: 'Accessibility and screen readers' })
    await heading.waitFor({ state: 'visible', timeout: 15_000 })
    const section = heading.locator('..').locator('..')

    try {
      await section.getByRole('button', { name: 'Run synthetic diagnostic practice' }).click()
      await section.getByText('1 of 17 checks need attention.', { exact: true })
        .waitFor({ state: 'visible' })
      const controlResult = section.getByText('Interactive control names', { exact: true }).locator('..')
      await controlResult.getByText('Show inspection and repair guidance', { exact: true }).click()
      await section.getByText(/Inspect control names in the browser accessibility tree/u)
        .waitFor({ state: 'visible' })

      await section.getByRole('button', { name: 'Check current page' }).click()
      await section.getByText('All 17 checks passed.', { exact: true }).waitFor({ state: 'visible' })
      await section.getByRole('button', { name: 'Start tracking focus' }).click()
      await dialog.getByRole('button', { name: 'Accessibility', exact: true }).focus()
      await section.getByRole('button', { name: 'Stop tracking focus' }).focus()
      await section.getByText('Accessibility', { exact: true }).waitFor({ state: 'visible' })
      await section.getByText('aria-current=true', { exact: true }).waitFor({ state: 'visible' })

      await section.getByRole('button', { name: 'Prepare and review redacted JSON' }).click()
      await section.getByRole('region', { name: 'Redacted JSON to be copied' }).waitFor({ state: 'visible' })
      await section.getByRole('button', { name: 'Copy redacted JSON report' }).click()
      await section.getByText('The redacted diagnostic report was copied to the system clipboard.')
        .waitFor({ state: 'visible' })
      const reportText = await page.evaluate(async () => await navigator.clipboard.readText())
      const report = JSON.parse(reportText) as {
        protocol?: string
        claim?: string
        checks?: Array<{ id?: string, outcome?: string, affected?: number }>
      }
      expect(report.protocol).toBe('dsh-accessibility-diagnostic/1.0.0-draft')
      expect(report.claim).toBe('none')
      expect(report.checks?.find(check => check.id === 'controls')).toEqual({
        id: 'controls', outcome: 'passed', affected: 0,
      })
      expect(report.checks?.every(check => (
        Object.keys(check).toSorted().join(',') === 'affected,id,outcome'
      ))).toBe(true)
      expect(reportText).not.toMatch(/aria-current|about:blank|HTMLButtonElement/iu)

      const result = await heading.evaluate(async (title): Promise<AxeResult> => {
        const root = title.closest('section')
        if (root === null) throw new Error('accessibility settings section missing')
        return await (window as unknown as {
          axe: { run(node: Element, options: unknown): Promise<AxeResult> }
        }).axe.run(root, { rules: { 'color-contrast': { enabled: false } } })
      })
      expect(result.violations, JSON.stringify(result.violations, null, 2)).toHaveLength(0)
      expect(browserErrors, `browser console errors: ${JSON.stringify(browserErrors)}`).toHaveLength(0)

      process.stdout.write(`${JSON.stringify({
        protocol: 'dsh-accessibility-diagnostic/1.0.0-draft',
        evidence: 'assembled-browser-not-at-or-disabled-user-evidence',
        dsh: '0.1.2-rc.1',
        plugin: pluginManifest.version,
        contextualGuidance: true,
        focusInspection: true,
        reportRedaction: true,
        axeViolations: result.violations.length,
      }, null, 2)}\n`)
    } finally {
      await page.keyboard.press('Escape')
    }
  }, 120_000)
})

describe.each(evidenceBrowsers)('external non-AT browser contract: %s', (browserName) => {
  const engine = browserName as EvidenceBrowser
  let temporaryRoot: string
  let scaffold: WebScaffold
  let browser: Browser
  let context: BrowserContext
  let page: Page
  const browserErrors: string[] = []

  beforeAll(async () => {
    temporaryRoot = await mkdtemp(join(tmpdir(), `dsh-non-at-${engine}-`))
    const harnessHome = join(temporaryRoot, 'dsh-home')
    const moduleLink = join(harnessHome, 'profiles', 'node_modules', '@oh-my-dsh', 'dsh-accessibility')
    const overlayPath = join(temporaryRoot, 'accessibility.overlay.yml')
    await mkdir(dirname(moduleLink), { recursive: true })
    await symlink(pluginRoot, moduleLink, 'dir')
    await writeFile(overlayPath, [
      '- insert:',
      `    - id: accessibility-non-at-${engine}`,
      "      name: '@oh-my-dsh/dsh-accessibility'",
      '',
    ].join('\n'))

    scaffold = await launchWebScaffold({ extraOverlayPath: overlayPath, harnessHome })
    await seedSession(scaffold, fixture, `dsh-non-at-${engine}`)

    browser = await browserTypes[engine].launch({ headless: true })
    context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US' })
    page = await context.newPage()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    page.on('console', (message) => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })
    page.on('pageerror', error => browserErrors.push(error.message))
    await page.goto(scaffold.authenticatedUrl, { waitUntil: 'load' })
  }, 180_000)

  afterAll(async () => {
    const failures: unknown[] = []
    await context?.close().catch(error => failures.push(error))
    await browser?.close().catch(error => failures.push(error))
    await scaffold?.close().catch(error => failures.push(error))
    await rm(temporaryRoot, { recursive: true, force: true }).catch(error => failures.push(error))
    if (failures.length > 0) throw new AggregateError(failures, `${engine} non-AT cleanup failed`)
  })

  it('reflows and preserves focus, forced-color participation, and reduced motion', async () => {
    const groupRow = page.locator('[role="treeitem"]').first()
    await groupRow.waitFor({ state: 'visible', timeout: 30_000 })
    await groupRow.click()
    const sessionRow = page.locator('[role="treeitem"]').nth(1)
    await sessionRow.waitFor({ state: 'visible', timeout: 15_000 })
    await sessionRow.click()
    await page.getByText(prompt, { exact: true }).waitFor({ state: 'visible', timeout: 20_000 })

    const accessibleTab = page.getByRole('tab', { name: 'Accessible view' })
    await accessibleTab.focus()
    await accessibleTab.press('Enter')
    const viewHeading = page.getByRole('heading', { level: 2, name: 'Accessible reading view' })
    await viewHeading.waitFor({ state: 'visible' })
    const viewRoot = viewHeading.locator('..')
    const loadButton = page.getByRole('button', { name: 'Load reading view' })
    await loadButton.focus()
    await loadButton.press('Enter')
    await page.getByText(prompt, { exact: true }).waitFor({ state: 'visible', timeout: 15_000 })

    const viewportEvidence = []
    for (const width of [640, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await expect.poll(() => page.evaluate(() => window.innerWidth), { timeout: 5_000 }).toBe(width)
      viewportEvidence.push(await assertNoHorizontalPageOverflow(page, `${engine}:${String(width)}csspx`))
    }

    const clearButton = page.getByRole('button', { name: 'Clear reading view and return' })
    const copyButton = page.getByRole('button', {
      name: /Copy visible message text from record \d+, Your message/u,
    }).first()
    const toolArticle = page.getByRole('article').filter({
      has: page.getByText(/^Record \d+: Tool result$/u),
    }).first()
    const outputDisclosure = toolArticle.getByRole('button', { name: 'Show tool output' })
    const focusEvidence = [
      await assertFocusNotObscured(clearButton, `${engine}:clear@320`),
      await assertFocusNotObscured(copyButton, `${engine}:copy@320`),
      await assertFocusNotObscured(outputDisclosure, `${engine}:tool-disclosure@320`),
    ]

    await outputDisclosure.press('Enter')
    await toolArticle.getByRole('button', { name: 'Hide tool output' }).waitFor({ state: 'visible' })
    const reducedMotion = await inspectReducedMotion(viewRoot)

    let forcedColors = null
    if (engine === 'chromium') {
      await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' })
      await expect.poll(() => page.evaluate(() => matchMedia('(forced-colors: active)').matches), {
        timeout: 5_000,
      }).toBe(true)
      forcedColors = await inspectForcedColors(viewRoot)
      focusEvidence.push(await assertFocusNotObscured(clearButton, 'chromium:clear@forced-colors'))
    }

    expect(browserErrors, `${engine} browser console errors: ${JSON.stringify(browserErrors)}`).toHaveLength(0)
    process.stdout.write(`${JSON.stringify({
      protocol: NON_AT_BROWSER_PROTOCOL,
      evidence: 'assembled-browser-non-at',
      standards: ['WCAG-2.2:1.4.10', 'WCAG-2.2:2.4.11', 'WCAG-2.2:2.3.3', 'CSS-COLOR-ADJUST-1'],
      dsh: { version: '0.1.2-rc.1', revision: dshRevision },
      plugin: { version: pluginManifest.version, revision: pluginRevision },
      environment: {
        os: platform(),
        osRelease: release(),
        architecture: arch(),
        engine,
        engineVersion: browser.version(),
      },
      viewportEvidence,
      focusEvidence,
      reducedMotion,
      forcedColors,
      limitations: [
        'headless browser evidence, not assistive-technology or disabled-user evidence',
        'forced colors is browser emulation, not a Windows High Contrast observation',
        'focus sampling does not replace visual focus-indicator contrast review',
      ],
    }, null, 2)}\n`)
  }, 180_000)
})
