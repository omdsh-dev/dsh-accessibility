/** Fail before launching or building a mismatched or publication-blocked companion. */
import { readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function assertCompanionBaseline(dshManifest, pluginManifest) {
  if (pluginManifest.name !== '@oh-my-dsh/dsh-accessibility') {
    throw new Error('assembled baseline received the wrong companion package')
  }
  const expected = pluginManifest.devDependencies?.['@deepseek-ai/dsh']
  if (typeof expected !== 'string' || expected !== pluginManifest.peerDependencies?.['@deepseek-ai/dsh-client-ui-chat']) {
    throw new Error('assembled baseline requires matching exact DSH development and client targets')
  }
  if (dshManifest.version !== expected) {
    throw new Error(`assembled baseline requires DSH ${expected}, received ${String(dshManifest.version)}`)
  }
  if (pluginManifest.private === true) {
    throw new Error('Companion integration is blocked: identify the exact upstream core source, migrate and pin the accessibility core, then review the publication hold. See COMPATIBILITY-0.1.3-alpha.2.md.')
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [dshRoot, pluginRoot = '.'] = process.argv.slice(2)
  if (!dshRoot) throw new Error('usage: node scripts/verify-assembled-baseline.mjs <dsh-checkout> [plugin-checkout]')
  const readManifest = async root => JSON.parse(await readFile(join(resolve(root), 'package.json'), 'utf8'))
  assertCompanionBaseline(await readManifest(dshRoot), await readManifest(pluginRoot))
}
