/** Launch a disposable, synthetic DSH world for human assistive-technology testing. */
import { readFile, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { exactGitRevision } from './lab-source-state.mjs'
import { assertCompanionBaseline } from './verify-assembled-baseline.mjs'

const [dshArgument, pluginArgument = '.', browserArgument = 'none', timeoutArgument = '0'] = process.argv.slice(2)
if (dshArgument === undefined) {
  throw new Error(
    'usage: node scripts/run-at-lab.mjs <dsh-checkout> [plugin-checkout] '
    + '[none|system|safari|chrome] [timeout-ms]',
  )
}

const allowedBrowsers = new Set(['none', 'system', 'safari', 'chrome'])
if (!allowedBrowsers.has(browserArgument)) {
  throw new Error(`browser must be none, system, safari, or chrome; received ${browserArgument}`)
}
const timeoutMs = Number(timeoutArgument)
if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 0 || timeoutMs > 86_400_000) {
  throw new Error(`timeout-ms must be an integer from 0 through 86400000; received ${timeoutArgument}`)
}

const invocationCwd = process.cwd()
const dshRoot = resolve(invocationCwd, dshArgument)
const pluginRoot = resolve(invocationCwd, pluginArgument)
const dshManifest = JSON.parse(await readFile(join(dshRoot, 'package.json'), 'utf8'))
const pluginManifest = JSON.parse(await readFile(join(pluginRoot, 'package.json'), 'utf8'))
assertCompanionBaseline(dshManifest, pluginManifest)
await readFile(join(pluginRoot, 'lib/client.js'), 'utf8')
const dshRevision = exactGitRevision(dshRoot, 'DSH checkout')
const pluginRevision = exactGitRevision(pluginRoot, 'Accessibility companion checkout')

const template = await readFile(join(pluginRoot, 'scripts/at-lab.template.ts'), 'utf8')
const relativeTarget = 'apps/web/tests/dsh-accessibility.at-lab.e2e.ts'
const target = join(dshRoot, relativeTarget)
let child
let forwardedSignal
const forwardSignal = (signal) => {
  forwardedSignal = signal
  child?.kill(signal)
}
const onInterrupt = () => { forwardSignal('SIGINT') }
const onTerminate = () => { forwardSignal('SIGTERM') }
process.on('SIGINT', onInterrupt)
process.on('SIGTERM', onTerminate)

let exitCode = 1
let wroteTarget = false
try {
  await writeFile(target, template, { flag: 'wx' })
  wroteTarget = true
  exitCode = await new Promise((resolveExit, reject) => {
    child = spawn('pnpm', [
      'exec', 'vitest', 'run', relativeTarget, '--config', 'vitest.web.config.ts',
    ], {
      cwd: dshRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        DSH_SNAPSHOT: 'replay',
        DSH_ACCESSIBILITY_PLUGIN_ROOT: pluginRoot,
        DSH_ACCESSIBILITY_DSH_REVISION: dshRevision,
        DSH_ACCESSIBILITY_PLUGIN_REVISION: pluginRevision,
        DSH_ACCESSIBILITY_AT_LAB_BROWSER: browserArgument,
        DSH_ACCESSIBILITY_AT_LAB_TIMEOUT_MS: String(timeoutMs),
      },
    })
    if (forwardedSignal !== undefined) child.kill(forwardedSignal)
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (forwardedSignal !== undefined) resolveExit(0)
      else if (signal !== null) resolveExit(signal === 'SIGINT' ? 130 : 143)
      else resolveExit(code ?? 1)
    })
  })
} finally {
  process.off('SIGINT', onInterrupt)
  process.off('SIGTERM', onTerminate)
  if (wroteTarget) await rm(target, { force: true })
}

if (exitCode !== 0) process.exitCode = exitCode
