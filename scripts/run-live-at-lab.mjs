/** Launch a disposable DSH replay scenario for human live-announcement testing. */
import { readFile, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { exactGitRevision } from './lab-source-state.mjs'
import { assertCompanionBaseline } from './verify-assembled-baseline.mjs'

const [dshArgument, scenarioArgument = 'complete', browserArgument = 'none', timeoutArgument = '0']
  = process.argv.slice(2)
if (dshArgument === undefined) {
  throw new Error(
    'usage: node scripts/run-live-at-lab.mjs <dsh-checkout> '
    + '[complete|stop|fail|question|plan|approval] [none|system|safari|chrome] [timeout-ms]',
  )
}

const allowedScenarios = new Set(['complete', 'stop', 'fail', 'question', 'plan', 'approval'])
if (!allowedScenarios.has(scenarioArgument)) {
  throw new Error(`invalid live AT scenario: ${scenarioArgument}`)
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
const dshManifest = JSON.parse(await readFile(join(dshRoot, 'package.json'), 'utf8'))
const labManifest = JSON.parse(await readFile(join(invocationCwd, 'package.json'), 'utf8'))
assertCompanionBaseline(dshManifest, labManifest)
if (labManifest.name !== '@oh-my-dsh/dsh-accessibility') {
  throw new Error('Live AT lab must run from the @oh-my-dsh/dsh-accessibility checkout')
}
const dshRevision = exactGitRevision(dshRoot, 'DSH checkout')
const labRevision = exactGitRevision(invocationCwd, 'Accessibility lab checkout')

const template = await readFile(join(invocationCwd, 'scripts/live-at-lab.template.ts'), 'utf8')
const relativeTarget = 'apps/web/tests/dsh-accessibility.live-at-lab.e2e.ts'
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
        DSH_ACCESSIBILITY_DSH_VERSION: String(dshManifest.version),
        DSH_ACCESSIBILITY_DSH_REVISION: dshRevision,
        DSH_ACCESSIBILITY_LAB_VERSION: String(labManifest.version),
        DSH_ACCESSIBILITY_LAB_REVISION: labRevision,
        DSH_ACCESSIBILITY_LIVE_AT_SCENARIO: scenarioArgument,
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
