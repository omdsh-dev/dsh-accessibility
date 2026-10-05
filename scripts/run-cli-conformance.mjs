/** Build and verify DSH's versioned headless accessibility output. */
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { arch, platform, release, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { exactGitRevision } from './lab-source-state.mjs'
import { assertCompanionBaseline } from './verify-assembled-baseline.mjs'

const rawArguments = process.argv.slice(2)
const launcherArguments = rawArguments[0] === '--' ? rawArguments.slice(1) : rawArguments
const [dshArgument, modeArgument = 'automated'] = launcherArguments
if (dshArgument === undefined) {
  throw new Error('usage: node scripts/run-cli-conformance.mjs <dsh-checkout> [automated|manual]')
}
if (modeArgument !== 'automated' && modeArgument !== 'manual') {
  throw new Error(`mode must be automated or manual; received ${modeArgument}`)
}

const invocationCwd = process.cwd()
const dshRoot = resolve(invocationCwd, dshArgument)
const dshManifest = JSON.parse(await readFile(join(dshRoot, 'package.json'), 'utf8'))
const labManifest = JSON.parse(await readFile(join(invocationCwd, 'package.json'), 'utf8'))
assertCompanionBaseline(dshManifest, labManifest)
const dshRevision = exactGitRevision(dshRoot, 'DSH checkout')
const labRevision = exactGitRevision(invocationCwd, 'Accessibility lab checkout')

let child
let forwardedSignal
const forwardSignal = (signal) => {
  forwardedSignal = signal
  child?.kill(signal)
}
const onInterrupt = () => {
  forwardSignal('SIGINT')
}
const onTerminate = () => {
  forwardSignal('SIGTERM')
}
process.on('SIGINT', onInterrupt)
process.on('SIGTERM', onTerminate)

function run(command, args, options = {}) {
  return new Promise((resolveExit, reject) => {
    child = spawn(command, args, {
      cwd: dshRoot,
      stdio: 'inherit',
      ...options,
    })
    if (forwardedSignal !== undefined) child.kill(forwardedSignal)
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      child = undefined
      if (forwardedSignal !== undefined) resolveExit(0)
      else if (signal !== null) resolveExit(signal === 'SIGINT' ? 130 : 143)
      else resolveExit(code ?? 1)
    })
  })
}

async function runManualLab(revision) {
  const moduleUrl = pathToFileURL(
    join(dshRoot, 'packages/test-support/llm-mock-server/lib/index.js'),
  ).href
  const { startMockLlmServer } = await import(moduleUrl)
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'dsh-cli-at-lab-'))
  const apiKey = 'dsh-cli-at-lab-synthetic-key'
  const successServer = await startMockLlmServer({
    sequence: ['slow_success'],
    apiKey,
    successText: 'Accessible CLI response complete.',
    chunkSize: 5,
    chunkDelayMs: 300,
  })
  const failureServer = await startMockLlmServer({
    sequence: ['auth_error'],
    repeatLast: true,
    apiKey,
  })
  const commonEnvironment = {
    ...process.env,
    DSH_HOME: join(temporaryRoot, 'dsh-home'),
    DSH_TELEMETRY_DISABLED: '1',
    DEEPSEEK_API_KEY: apiKey,
  }
  const bin = join(dshRoot, 'apps/cli/lib/bin.js')

  process.stdout.write(
    `${JSON.stringify(
      {
        protocol: 'dsh-cli-accessibility/1.0.0-draft',
        evidence: 'manual-lab-ready-not-at-evidence',
        dsh: { version: String(dshManifest.version), revision },
        lab: {
          package: '@oh-my-dsh/dsh-accessibility',
          version: String(labManifest.version),
          revision: labRevision,
        },
        environment: {
          os: platform(),
          osRelease: release(),
          architecture: arch(),
        },
        persistence: 'temporary; removed when the launcher exits',
        scenarios: ['completed', 'error'],
        limitations: [
          'launching the lab is not assistive-technology evidence',
          'a human must record actual speech or braille, terminal cursor behavior, and task completion',
        ],
      },
      null,
      2,
    )}\n`,
  )

  try {
    process.stdout.write(
      '\nCLI AT scenario 1 of 2: completed response. Listen for one start line, the answer, and one completed line.\n\n',
    )
    const completed = await run(
      process.execPath,
      [
        bin,
        '--profile',
        'headless',
        '--accessibility',
        'Return the synthetic accessible CLI response.',
      ],
      {
        env: { ...commonEnvironment, DEEPSEEK_BASE_URL: successServer.baseURL },
      },
    )
    if (forwardedSignal !== undefined) return
    if (completed !== 0) throw new Error(`completed CLI AT scenario exited ${String(completed)}`)

    process.stdout.write(
      '\nCLI AT scenario 2 of 2: model failure. Listen for one start line and one failure line.\n\n',
    )
    const failed = await run(
      process.execPath,
      [
        bin,
        '--profile',
        'headless',
        '--accessibility',
        'Trigger the synthetic accessible CLI failure.',
      ],
      {
        env: { ...commonEnvironment, DEEPSEEK_BASE_URL: failureServer.baseURL },
      },
    )
    if (forwardedSignal !== undefined) return
    if (failed !== 1)
      throw new Error(`failed CLI AT scenario exited ${String(failed)} instead of 1`)

    process.stdout.write(
      '\nThe disposable scenarios ended. Record the result using CLI-ACCESSIBILITY.md; this launcher does not mark an AT pass.\n',
    )
  } finally {
    await Promise.allSettled([successServer.close(), failureServer.close()])
    await rm(temporaryRoot, { recursive: true, force: true })
  }
}

let exitCode = 1
let target
try {
  exitCode = await run('pnpm', ['run', 'build:lib:host'])
  if (exitCode === 0 && forwardedSignal === undefined) {
    const revision = dshRevision
    if (modeArgument === 'manual') {
      await runManualLab(revision)
    } else {
      const template = await readFile(
        join(invocationCwd, 'scripts/cli-conformance.template.ts'),
        'utf8',
      )
      const relativeTarget = 'apps/cli/tests/dsh-accessibility.cli-conformance.e2e.ts'
      target = join(dshRoot, relativeTarget)
      await writeFile(target, template, { flag: 'wx' })
      exitCode = await run(
        'pnpm',
        ['exec', 'vitest', 'run', '--config', 'vitest.e2e.config.ts', relativeTarget],
        {
          env: {
            ...process.env,
            DSH_ACCESSIBILITY_DSH_VERSION: String(dshManifest.version),
            DSH_ACCESSIBILITY_DSH_REVISION: revision,
            DSH_ACCESSIBILITY_LAB_VERSION: String(labManifest.version),
            DSH_ACCESSIBILITY_LAB_REVISION: labRevision,
          },
        },
      )
    }
  }
} finally {
  process.off('SIGINT', onInterrupt)
  process.off('SIGTERM', onTerminate)
  if (target !== undefined) await rm(target, { force: true })
}

if (exitCode !== 0) process.exitCode = exitCode
