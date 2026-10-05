/** Launch the disposable DSH authoring task for human AT or product-only verification. */
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { assertAuthoringBaseline } from './authoring-baseline.mjs'
import { exactGitRevision } from './lab-source-state.mjs'
import { installAuthoringPackageConsumer, packAuthoringPackages } from './authoring-package-install-lib.mjs'

const rawArguments = process.argv.slice(2)
const args = rawArguments[0] === '--' ? rawArguments.slice(1) : rawArguments
const [dshArgument, localPreviewArgument, browserArgument = 'none', timeoutArgument = '0'] = args
if (dshArgument === undefined || localPreviewArgument === undefined) {
  throw new Error(
    'usage: node scripts/run-authoring-at-lab.mjs <dsh-checkout> '
    + '<dsh-a11y-local-preview-checkout> [none|system|safari|chrome|verify|verify-reject] [timeout-ms]',
  )
}

const allowedBrowsers = new Set(['none', 'system', 'safari', 'chrome', 'verify', 'verify-reject'])
if (!allowedBrowsers.has(browserArgument)) {
  throw new Error(`browser must be none, system, safari, chrome, verify, or verify-reject; received ${browserArgument}`)
}
const timeoutMs = Number(timeoutArgument)
if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 0 || timeoutMs > 86_400_000) {
  throw new Error(`timeout-ms must be an integer from 0 through 86400000; received ${timeoutArgument}`)
}

const invocationCwd = process.cwd()
const dshRoot = resolve(invocationCwd, dshArgument)
const localPreviewRoot = resolve(invocationCwd, localPreviewArgument)
const packageRoot = resolve(import.meta.dirname, '..')
const dshManifest = JSON.parse(await readFile(join(dshRoot, 'package.json'), 'utf8'))
const localPreviewManifest = JSON.parse(await readFile(join(localPreviewRoot, 'package.json'), 'utf8'))
const labManifest = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))
assertAuthoringBaseline(dshManifest, localPreviewManifest, labManifest)
await readFile(join(dshRoot, 'apps/web/dist/index.html'), 'utf8').catch(() => {
  throw new Error('DSH Web dist is missing; run `pnpm run build` in the DSH checkout first')
})
await readFile(join(localPreviewRoot, 'lib/index.js'), 'utf8').catch(() => {
  throw new Error('local-preview build is missing; run `pnpm run build` in its checkout first')
})
if (labManifest.name !== '@oh-my-dsh/dsh-accessibility') {
  throw new Error('authoring AT lab must run from the @oh-my-dsh/dsh-accessibility checkout')
}
const dshRevision = exactGitRevision(dshRoot, 'DSH checkout')
const localPreviewRevision = exactGitRevision(localPreviewRoot, 'Local preview checkout')
const labRevision = exactGitRevision(packageRoot, 'Accessibility lab checkout')

const template = await readFile(join(packageRoot, 'scripts/authoring-at-lab.template.ts'), 'utf8')
const replayFixture = join(packageRoot, 'scripts/authoring-at-replay.jsonl')
const relativeTarget = 'apps/web/tests/dsh-accessibility.authoring-at-lab.e2e.ts'
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
let packageTemporaryRoot
try {
  packageTemporaryRoot = await mkdtemp(join(tmpdir(), 'dsh-a11y-authoring-at-packages-'))
  const tarballRoot = join(packageTemporaryRoot, 'tarballs')
  const installRoot = join(packageTemporaryRoot, 'consumer')
  await mkdir(tarballRoot)
  const authoringPolicy = JSON.parse(await readFile(join(packageRoot, 'AUTHORING-PACKAGES.json'), 'utf8'))
  const packedAuthoringPackages = await packAuthoringPackages(
    authoringPolicy,
    resolve(localPreviewRoot, '..'),
    tarballRoot,
  )
  await installAuthoringPackageConsumer(packedAuthoringPackages, installRoot)
  const compositionTarball = packedAuthoringPackages.find(item => item.name === localPreviewManifest.name)
  if (compositionTarball === undefined) throw new Error('authoring AT lab did not pack the local-preview composition')
  await writeFile(target, template, { flag: 'wx' })
  wroteTarget = true
  const childEnvironment = { ...process.env }
  delete childEnvironment.DEEPSEEK_API_KEY
  exitCode = await new Promise((resolveExit, reject) => {
    child = spawn('pnpm', [
      'exec', 'vitest', 'run', relativeTarget, '--config', 'vitest.web.config.ts',
    ], {
      cwd: dshRoot,
      stdio: 'inherit',
      env: {
        ...childEnvironment,
        DSH_SNAPSHOT: 'replay',
        DSH_ACCESSIBILITY_DSH_VERSION: dshManifest.version,
        DSH_ACCESSIBILITY_DSH_REVISION: dshRevision,
        DSH_ACCESSIBILITY_AUTHORING_INSTALL_ROOT: installRoot,
        DSH_ACCESSIBILITY_AUTHORING_COMPOSITION_INTEGRITY: compositionTarball.integrity,
        DSH_ACCESSIBILITY_AUTHORING_PACKAGE_COUNT: String(packedAuthoringPackages.length),
        DSH_ACCESSIBILITY_LOCAL_PREVIEW_VERSION: localPreviewManifest.version,
        DSH_ACCESSIBILITY_LOCAL_PREVIEW_REVISION: localPreviewRevision,
        DSH_ACCESSIBILITY_LAB_VERSION: String(labManifest.version),
        DSH_ACCESSIBILITY_LAB_REVISION: labRevision,
        DSH_ACCESSIBILITY_AUTHORING_AT_FIXTURE: replayFixture,
        DSH_ACCESSIBILITY_AUTHORING_AT_BROWSER: browserArgument,
        DSH_ACCESSIBILITY_AUTHORING_AT_TIMEOUT_MS: String(timeoutMs),
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
  if (packageTemporaryRoot !== undefined) await rm(packageTemporaryRoot, { force: true, recursive: true })
}

if (exitCode !== 0) process.exitCode = exitCode
