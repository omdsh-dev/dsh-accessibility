/** Run the external-plugin browser scenario inside an exact DSH checkout. */
import { readFile, rm, writeFile } from 'node:fs/promises'
import { spawn, spawnSync } from 'node:child_process'
import { resolve, join } from 'node:path'
import { assertCompanionBaseline } from './verify-assembled-baseline.mjs'

const [dshArgument, pluginArgument = '.', browserArgument = 'chromium'] = process.argv.slice(2)
if (dshArgument === undefined) {
  throw new Error('usage: node scripts/run-assembled-browser.mjs <dsh-checkout> [plugin-checkout] [browser-list]')
}

const browserNames = browserArgument.split(',').map(value => value.trim()).filter(Boolean)
const allowedBrowsers = new Set(['chromium', 'firefox', 'webkit'])
if (browserNames.length === 0 || browserNames.some(name => !allowedBrowsers.has(name))) {
  throw new Error(`browser-list must contain only chromium,firefox,webkit; received ${browserArgument}`)
}

const invocationCwd = process.cwd()
const dshRoot = resolve(invocationCwd, dshArgument)
const pluginRoot = resolve(invocationCwd, pluginArgument)
const dshManifest = JSON.parse(await readFile(join(dshRoot, 'package.json'), 'utf8'))
const pluginManifest = JSON.parse(await readFile(join(pluginRoot, 'package.json'), 'utf8'))
assertCompanionBaseline(dshManifest, pluginManifest)
await readFile(join(pluginRoot, 'lib/client.js'), 'utf8')

function gitRevision(root) {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' })
  return result.status === 0 ? String(result.stdout).trim() : 'unavailable'
}

const template = await readFile(join(pluginRoot, 'scripts/assembled-browser.e2e.template.ts'), 'utf8')
const helper = await readFile(join(pluginRoot, 'scripts/browser-contract.e2e-helper.ts'), 'utf8')
const relativeTarget = 'apps/web/tests/dsh-accessibility.external.e2e.ts'
const relativeHelper = 'apps/web/tests/dsh-accessibility.browser-contract.helper.ts'
const targets = [
  { absolute: join(dshRoot, relativeHelper), content: helper },
  { absolute: join(dshRoot, relativeTarget), content: template },
]

let exitCode = 1
const written = []
try {
  for (const target of targets) {
    await writeFile(target.absolute, target.content, { flag: 'wx' })
    written.push(target.absolute)
  }
  exitCode = await new Promise((resolveExit, reject) => {
    const child = spawn('pnpm', [
      'exec', 'vitest', 'run', relativeTarget, '--config', 'vitest.web.config.ts',
    ], {
      cwd: dshRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        DSH_SNAPSHOT: 'replay',
        DSH_ACCESSIBILITY_PLUGIN_ROOT: pluginRoot,
        DSH_ACCESSIBILITY_BROWSERS: browserNames.join(','),
        DSH_ACCESSIBILITY_DSH_REVISION: gitRevision(dshRoot),
        DSH_ACCESSIBILITY_PLUGIN_REVISION: gitRevision(pluginRoot),
      },
    })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (signal !== null) reject(new Error(`assembled browser runner ended with signal ${signal}`))
      else resolveExit(code ?? 1)
    })
  })
} finally {
  await Promise.all(written.map(path => rm(path, { force: true })))
}

if (exitCode !== 0) process.exitCode = exitCode
