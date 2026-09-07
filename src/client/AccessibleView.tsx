import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type {
  AssistantBlock, ConversationNode, ToolCallBlock,
} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { SessionSnapshot } from '@deepseek-ai/dsh-api-session-controller/client'
import type { ChatSnapshot } from '@deepseek-ai/dsh-client-ui-chat/client'
import { MarkdownText, writeClipboard } from '@deepseek-ai/dsh-client-ui-primitives'
import type { MarkdownLabels } from '@deepseek-ai/dsh-client-ui-primitives'
import { conversationNodeKey, messageClipboardText } from './accessible-conversation.ts'
import type { AccessibilityKey } from './locales.ts'

export interface AccessibleViewInjected {
  loadOlder: () => Promise<void>
}

type Translate = (key: AccessibilityKey, params?: Record<string, unknown>) => string
type MessageContent = Extract<ConversationNode, { kind: 'user' }>['content']

type SnapshotSelectorHook<Value> = <Selection>(selector: (value: Value) => Selection) => Selection

interface AccessibleViewProps extends AccessibleViewInjected {
  useSession: SnapshotSelectorHook<SessionSnapshot>
  useChat: SnapshotSelectorHook<ChatSnapshot>
  t: Translate
}

const viewStyle: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 960,
  margin: '0 auto',
  padding: '20px clamp(16px, 4vw, 40px) 48px',
  color: 'var(--dsw-alias-label-primary)',
}

const controlsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  margin: '16px 0',
}

const buttonStyle: CSSProperties = {
  minHeight: 36,
  padding: '8px 14px',
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 8,
  background: 'var(--dsw-alias-bg-layer-2)',
  color: 'inherit',
  cursor: 'pointer',
  // The conversation shell publishes its sticky composer height as an
  // inherited custom property. Include that occluding region in the button's
  // focus scroll area so keyboard focus never settles underneath the composer.
  scrollMarginBlock: 'calc(var(--dsh-composer-height, 152px) + 24px)',
}

const messageListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  margin: '20px 0 0',
  padding: 0,
  listStyle: 'none',
}

const articleStyle: CSSProperties = {
  padding: 16,
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 12,
  background: 'var(--dsw-alias-bg-layer-1)',
  overflowWrap: 'anywhere',
}

const preStyle: CSSProperties = {
  maxWidth: '100%',
  overflow: 'auto',
  padding: 12,
  borderRadius: 8,
  background: 'var(--dsw-alias-bg-layer-2)',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
}

function timestamp(time: number): { dateTime: string; label: string } | null {
  const date = new Date(time)
  if (!Number.isFinite(date.getTime())) return null
  return { dateTime: date.toISOString(), label: date.toLocaleString() }
}

interface DisclosureProps {
  id: string
  show: string
  hide: string
  children: ReactNode
}

function AccessibleMarkdown({ text, streaming = false, t }: {
  text: string
  streaming?: boolean
  t: Translate
}) {
  const labels = useMemo<MarkdownLabels>(() => ({
    code: {
      copyLabel: t('view.markdown.code.copy'),
      copiedLabel: t('view.markdown.code.copied'),
    },
    footnotes: t('view.markdown.footnotes'),
  }), [t])
  return <MarkdownText text={text} streaming={streaming} labels={labels} />
}

/** A disclosure that does not even mount sensitive content before activation. */
function ExplicitDisclosure({ id, show, hide, children }: DisclosureProps) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button
        type="button"
        style={buttonStyle}
        aria-expanded={expanded}
        aria-controls={expanded ? id : undefined}
        onClick={() => { setExpanded(value => !value) }}
      >
        {expanded ? hide : show}
      </button>
      {expanded && <div id={id}>{children}</div>}
    </div>
  )
}

function ToolBlockSummary({ block, t }: { block: ToolCallBlock; t: Translate }) {
  const settled = 'kind' in block
  const name = settled ? block.call?.name : block.name
  return (
    <p>
      {t(settled
        ? block.isError ? 'view.tool.failed' : 'view.tool.completed'
        : 'view.tool.running', { name: name ?? t('view.tool.unknown') })}
    </p>
  )
}

function AssistantContent({ blocks, idPrefix, t, streaming = false }: {
  blocks: readonly AssistantBlock[]
  idPrefix: string
  t: Translate
  streaming?: boolean
}) {
  return blocks.map((block, index) => {
    const key = `${block.kind}:${index}`
    switch (block.kind) {
      case 'text':
        return <AccessibleMarkdown key={key} text={block.text} streaming={streaming} t={t} />
      case 'reasoning':
        return (
          <ExplicitDisclosure
            key={key}
            id={`${idPrefix}-reasoning-${index}`}
            show={t('view.reasoning.show')}
            hide={t('view.reasoning.hide')}
          >
            <AccessibleMarkdown text={block.text} streaming={streaming} t={t} />
          </ExplicitDisclosure>
        )
      case 'image':
        return <p key={key}>{t('view.image.unavailable')}</p>
      case 'tool-call':
        return (
          <div key={key}>
            <p>{t('view.tool.requested', { name: block.name || t('view.tool.unknown') })}</p>
            {block.argsRaw !== '' && (
              <ExplicitDisclosure
                id={`${idPrefix}-tool-arguments-${index}`}
                show={t('view.tool.arguments.show')}
                hide={t('view.tool.arguments.hide')}
              >
                <pre style={preStyle}><code>{block.argsRaw}</code></pre>
              </ExplicitDisclosure>
            )}
          </div>
        )
      default:
        return <p key={key}>{t('view.content.unsupported')}</p>
    }
  })
}

function LiveAssistantEntry({ blocks, idPrefix, t }: {
  blocks: readonly AssistantBlock[]
  idPrefix: string
  t: Translate
}) {
  const labelId = `${idPrefix}-label`
  return (
    <article style={articleStyle} aria-labelledby={labelId} aria-busy="true">
      <p id={labelId} style={{ marginTop: 0 }}><strong>{t('view.liveAssistant')}</strong></p>
      <AssistantContent blocks={blocks} idPrefix={idPrefix} t={t} streaming />
    </article>
  )
}

function MessageContentBlocks({ content, idPrefix, mode, t }: {
  content: MessageContent
  idPrefix: string
  mode: 'message' | 'tool'
  t: Translate
}) {
  return content.map((block, index) => {
    const key = `${block.type}:${index}`
    switch (block.type) {
      case 'text':
        return mode === 'tool'
          ? <pre key={key} style={preStyle}><code>{block.text}</code></pre>
          : <AccessibleMarkdown key={key} text={block.text} t={t} />
      case 'reasoning':
        return (
          <ExplicitDisclosure
            key={key}
            id={`${idPrefix}-reasoning-${index}`}
            show={t('view.reasoning.show')}
            hide={t('view.reasoning.hide')}
          >
            <AccessibleMarkdown text={block.text} t={t} />
          </ExplicitDisclosure>
        )
      case 'image':
        return <p key={key}>{t('view.image.unavailable')}</p>
      case 'tool-call':
        return <p key={key}>{t('view.tool.requested', { name: block.name || t('view.tool.unknown') })}</p>
      case 'tool-result':
        return (
          <ExplicitDisclosure
            key={key}
            id={`${idPrefix}-nested-tool-result-${index}`}
            show={t('view.tool.output.show')}
            hide={t('view.tool.output.hide')}
          >
            <MessageContentBlocks
              content={block.content}
              idPrefix={`${idPrefix}-nested-${index}`}
              mode="tool"
              t={t}
            />
          </ExplicitDisclosure>
        )
      default:
        return <p key={key}>{t('view.content.unsupported')}</p>
    }
  })
}

function roleLabel(node: ConversationNode, t: Translate): string {
  switch (node.kind) {
    case 'user': return t('view.role.user')
    case 'steering': return t('view.role.steering')
    case 'context': return t('view.role.context')
    case 'assistant': return t('view.role.assistant')
    case 'tool-result': return t('view.role.tool')
    case 'command': return t('view.role.command')
    case 'compaction': return t('view.role.compaction')
    case 'model-retry': return t('view.role.retry')
    case 'turn-error': return t('view.role.error')
    case 'turn-max-tokens': return t('view.role.limit')
    case 'unknown': return t('view.role.unknown')
  }
}

interface ConversationEntryProps {
  index: number
  node: ConversationNode
  idPrefix: string
  t: Translate
  onCopy: (node: ConversationNode, index: number) => Promise<void>
}

function ConversationEntry({ index, node, idPrefix, t, onCopy }: ConversationEntryProps) {
  const headingId = `${idPrefix}-heading`
  const time = timestamp(node.time)
  const clipboardText = messageClipboardText(node)
  const title = t('view.item.heading', { index, role: roleLabel(node, t) })

  let content: ReactNode
  switch (node.kind) {
    case 'user':
    case 'steering':
      content = <MessageContentBlocks content={node.content} idPrefix={idPrefix} mode="message" t={t} />
      break
    case 'context':
      content = (
        <ExplicitDisclosure
          id={`${idPrefix}-context`}
          show={t('view.context.show')}
          hide={t('view.context.hide')}
        >
          <MessageContentBlocks content={node.content} idPrefix={idPrefix} mode="message" t={t} />
        </ExplicitDisclosure>
      )
      break
    case 'assistant':
      content = (
        <>
          {node.interrupted && <p>{t('view.assistant.interrupted')}</p>}
          <AssistantContent blocks={node.blocks} idPrefix={idPrefix} t={t} />
        </>
      )
      break
    case 'tool-result':
      content = (
        <>
          <ToolBlockSummary block={node} t={t} />
          <ExplicitDisclosure
            id={`${idPrefix}-tool-output`}
            show={t('view.tool.output.show')}
            hide={t('view.tool.output.hide')}
          >
            <MessageContentBlocks content={node.content} idPrefix={idPrefix} mode="tool" t={t} />
          </ExplicitDisclosure>
          {node.subCalls.length > 0 && <p>{t('view.tool.subcalls', { count: node.subCalls.length })}</p>}
        </>
      )
      break
    case 'command':
      content = (
        <>
          <p>{t(node.outcome === null
            ? 'view.command.running'
            : node.outcome.kind === 'success'
              ? 'view.command.completed'
              : 'view.command.failed', { name: node.name ?? t('view.command.unknown') })}</p>
          {node.args !== null && node.args !== '' && (
            <ExplicitDisclosure
              id={`${idPrefix}-command-input`}
              show={t('view.command.input.show')}
              hide={t('view.command.input.hide')}
            >
              <pre style={preStyle}><code>{node.args}</code></pre>
            </ExplicitDisclosure>
          )}
        </>
      )
      break
    case 'compaction':
      content = node.summary === null
        ? <p>{t('view.compaction.unavailable')}</p>
        : <AccessibleMarkdown text={node.summary} t={t} />
      break
    case 'model-retry':
      content = <p>{t(`view.retry.${node.retryState}`)}</p>
      break
    case 'turn-error':
      content = (
        <>
          <p>{t('view.error.turn')}</p>
          <ExplicitDisclosure
            id={`${idPrefix}-error-detail`}
            show={t('view.error.detail.show')}
            hide={t('view.error.detail.hide')}
          >
            <pre style={preStyle}><code>{node.message}</code></pre>
          </ExplicitDisclosure>
        </>
      )
      break
    case 'turn-max-tokens':
      content = <p>{t('view.maxTokens')}</p>
      break
    case 'unknown':
      content = <p>{t('view.content.unsupported')}</p>
      break
  }

  return (
    <article style={articleStyle} aria-labelledby={headingId}>
      <p id={headingId} style={{ marginTop: 0 }}><strong>{title}</strong></p>
      {time !== null && <p><time dateTime={time.dateTime}>{time.label}</time></p>}
      {content}
      {clipboardText !== null && (
        <button
          type="button"
          style={buttonStyle}
          aria-label={t('view.copy.label', { index, role: roleLabel(node, t) })}
          onClick={() => { void onCopy(node, index) }}
        >
          {t('view.copy.action')}
        </button>
      )}
    </article>
  )
}

/** User-loaded semantic reading surface over DSH's supported conversation projection. */
export function AccessibleView({ useSession, useChat, loadOlder, t }: AccessibleViewProps) {
  const [loaded, setLoaded] = useState(false)
  const [requestingOlder, setRequestingOlder] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const loadButtonRef = useRef<HTMLButtonElement>(null)
  const focusOnLoadRef = useRef(false)
  const restoreLoadFocusRef = useRef(false)
  const copyAttemptRef = useRef(0)
  const historyAttemptRef = useRef(0)
  const baseId = useId()
  const session = useSession(value => loaded ? value : null)
  const conversation = useChat(value => loaded ? value.legacy : null)

  useEffect(() => {
    if (loaded && focusOnLoadRef.current) {
      focusOnLoadRef.current = false
      headingRef.current?.focus()
    }
    if (!loaded && restoreLoadFocusRef.current) {
      restoreLoadFocusRef.current = false
      loadButtonRef.current?.focus()
    }
  }, [loaded])

  useEffect(() => () => {
    copyAttemptRef.current += 1
    historyAttemptRef.current += 1
  }, [])

  const load = () => {
    focusOnLoadRef.current = true
    setFeedback(null)
    setLoaded(true)
  }

  const clear = () => {
    copyAttemptRef.current += 1
    historyAttemptRef.current += 1
    restoreLoadFocusRef.current = true
    setRequestingOlder(false)
    setFeedback(null)
    setLoaded(false)
  }

  const copyMessage = async (node: ConversationNode, index: number) => {
    const text = messageClipboardText(node)
    if (text === null) return
    const attempt = copyAttemptRef.current + 1
    copyAttemptRef.current = attempt
    const accepted = await writeClipboard(text)
    if (copyAttemptRef.current !== attempt) return
    setFeedback(t(accepted ? 'view.copy.success' : 'view.copy.failure', { index }))
  }

  const requestOlder = async () => {
    const attempt = historyAttemptRef.current + 1
    historyAttemptRef.current = attempt
    setRequestingOlder(true)
    setFeedback(t('view.history.loading'))
    try {
      await loadOlder()
      if (historyAttemptRef.current !== attempt) return
      setFeedback(t('view.history.loaded'))
    } catch {
      if (historyAttemptRef.current !== attempt) return
      setFeedback(t('view.history.failure'))
    } finally {
      if (historyAttemptRef.current === attempt) setRequestingOlder(false)
    }
  }

  const recordCount = conversation === null
    ? 0
    : conversation.nodes.length + Number(conversation.partial != null)
  const summary = session === null || conversation === null
    ? t('view.privacy.idle')
    : session.removed
      ? t('view.session.removed')
      : session.openState === 'cold' || session.openState === 'loading'
        ? t('view.history.opening')
        : session.running
          ? t('view.summary.running', { count: recordCount })
          : t('view.summary.ready', { count: recordCount })

  return (
    <section style={viewStyle} aria-labelledby={`${baseId}-title`}>
      <h2 id={`${baseId}-title`} ref={headingRef} tabIndex={-1} style={{ marginTop: 0 }}>
        {t('view.title')}
      </h2>
      <p>{t('view.description')}</p>
      <p id={`${baseId}-privacy`}><strong>{t('view.privacy.notice')}</strong></p>

      {!loaded ? (
        <button
          ref={loadButtonRef}
          type="button"
          style={buttonStyle}
          aria-describedby={`${baseId}-privacy`}
          onClick={load}
        >
          {t('view.load')}
        </button>
      ) : (
        <div style={controlsStyle} aria-label={t('view.controls')}>
          {session?.hasMore && (
            <button
              type="button"
              style={buttonStyle}
              disabled={session.loadingOlder || requestingOlder}
              onClick={() => { void requestOlder() }}
            >
              {session.loadingOlder || requestingOlder ? t('view.history.loading') : t('view.history.load')}
            </button>
          )}
          <button type="button" style={buttonStyle} onClick={clear}>{t('view.clear')}</button>
        </div>
      )}

      <p role="status" aria-live="polite" aria-atomic="true">
        {feedback ?? summary}
      </p>

      {session !== null && conversation !== null && (
        <>
          {(session.queue.length > 0
            || session.pendingSubmissions.length > 0
            || conversation.runningCalls.length > 0) && (
            <p>
              {t('view.activity', {
                queued: session.queue.length,
                pending: session.pendingSubmissions.length,
                tools: conversation.runningCalls.length,
              })}
            </p>
          )}
          {session.openState === 'error' && <p role="alert">{t('view.history.error')}</p>}
          {session.promptError != null && <p role="alert">{t('view.prompt.error')}</p>}
          {conversation.nodes.length === 0 && conversation.partial == null ? (
            <p>{t('view.empty')}</p>
          ) : (
            <ol
              style={messageListStyle}
              aria-label={t('view.messages')}
              aria-live="off"
              aria-busy={session.loadingOlder || requestingOlder}
            >
              {conversation.nodes.map((node, offset) => (
                <li key={conversationNodeKey(node)}>
                  <ConversationEntry
                    index={offset + 1}
                    node={node}
                    idPrefix={`${baseId}-item-${offset + 1}`}
                    t={t}
                    onCopy={copyMessage}
                  />
                </li>
              ))}
              {conversation.partial != null && (
                <li key={`partial:${conversation.partial.turn}:${conversation.partial.step}`}>
                  <LiveAssistantEntry
                    blocks={conversation.partial.blocks}
                    idPrefix={`${baseId}-live-assistant`}
                    t={t}
                  />
                </li>
              )}
            </ol>
          )}
        </>
      )}
    </section>
  )
}
