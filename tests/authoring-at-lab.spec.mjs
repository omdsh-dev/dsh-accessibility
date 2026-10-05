import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const protocol = 'dsh-a11y-authoring-at-lab/0.1.0-draft'
const fixturePath = new URL('../scripts/authoring-at-replay.jsonl', import.meta.url)
const templatePath = new URL('../scripts/authoring-at-lab.template.ts', import.meta.url)
const launcherPath = new URL('../scripts/run-authoring-at-lab.mjs', import.meta.url)

function replayBlocks() {
  return readFileSync(fixturePath, 'utf8')
    .split(/\r?\n/u)
    .filter(Boolean)
    .map(line => JSON.parse(line))
    .flatMap((event) => {
      const chunk = event?.type === 'assistant/chunk' ? event.data?.chunk : undefined
      return chunk?.type === 'block-end' ? [chunk.block] : []
    })
}

describe('authoring assistive-technology lab', () => {
  it('pins a neutral, bounded replay with an explicit one-shot escalation', () => {
    const blocks = replayBlocks()
    const calls = blocks.filter(block => block?.type === 'tool-call')
    expect(calls.map(call => call.name)).toEqual(['a11y_check', 'read', 'edit', 'a11y_check'])
    const edit = JSON.parse(calls[2].arguments)
    expect(edit).toMatchObject({
      file_path: 'index.html',
      sandbox_permissions: 'workspace-write',
    })
    expect(edit.justification).toMatch(/one-time permission.*index\.html/i)
    expect(edit.old_string).toContain('<button type="button"></button>')
    expect(edit.new_string).toContain('alt="Blue hiking backpack"')
    expect(edit.new_string).toContain('>Add to cart</button>')
    expect(blocks.filter(block => block?.type === 'text').map(block => block.text)).toEqual([
      'The bounded repair flow finished; review the tool and audit results.',
    ])
  })

  it('keeps product verification and human AT evidence in separate classes', () => {
    const template = readFileSync(templatePath, 'utf8')
    expect(template).toContain(`const protocol = '${protocol}'`)
    expect(template).toContain("evidence: 'lab-ready-not-at-evidence'")
    expect(template).toContain("evidence: 'host-terminal-boundary-not-at-evidence'")
    expect(template).toContain("evidence: 'automated-product-verification-not-at-evidence'")
    expect(template).toContain('actual speech or braille')
    expect(template).toContain("browserMode === 'verify-reject' ? 'reject' : 'allow'")
    expect(template).toContain("sourceUnchanged: decision === 'reject'")
    expect(template).toContain("kind: 'fresh-local-tarball-consumer'")
    expect(template).toContain('installedLocalPreviewRoot')
    expect(template).not.toContain('evidence: \'at-pass\'')
  })

  it('checks native V4 result flags for every matching call rather than old content wrappers', () => {
    const template = readFileSync(templatePath, 'utf8')
    expect(template).toContain('return event.data.message.isError')
    expect(template).not.toContain('event.data.message.content.some(content => content.isError)')
    expect(template).toContain('expect(results).toHaveLength(calls.length)')
    expect(template).toContain('result.data.message.toolCallId === call.data.callId')
    expect(template).toContain('expect(matching).toHaveLength(1)')
    expect(template).toContain("decision === 'reject' && call.data.name === 'edit'")
  })

  it('keeps the one-use URL out of readiness JSON and secrets out of the child', () => {
    const template = readFileSync(templatePath, 'utf8')
    const readinessStart = template.indexOf("evidence: 'lab-ready-not-at-evidence'")
    const readinessEnd = template.indexOf("if (!browserMode.startsWith('verify'))", readinessStart)
    const readiness = template.slice(readinessStart, readinessEnd)
    expect(readiness).not.toContain('authenticatedUrl')
    expect(readiness).not.toContain('previewOrigin')
    expect(template).toContain('One-use local sign-in URL (do not publish)')

    const launcher = readFileSync(launcherPath, 'utf8')
    expect(launcher).toContain('delete childEnvironment.DEEPSEEK_API_KEY')
    expect(launcher).toContain('packAuthoringPackages(')
    expect(launcher).toContain('installAuthoringPackageConsumer(')
    expect(launcher).not.toContain('DSH_ACCESSIBILITY_LOCAL_PREVIEW_ROOT:')
    expect(launcher).toContain("await writeFile(target, template, { flag: 'wx' })")
    expect(launcher).toContain('if (wroteTarget) await rm(target, { force: true })')
  })
})
