// @vitest-environment jsdom
import axe from 'axe-core'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { ComponentProps } from 'react'
import type { SessionSnapshot } from '@deepseek-ai/dsh-client-ui-session/client'
import type { ChatSnapshot, LegacyConversationSlice } from '@deepseek-ai/dsh-client-ui-chat/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AccessibleView } from '../src/client/AccessibleView.tsx'
import { en } from '../src/client/locales.ts'

const userNode = {
  kind: 'user',
  seq: 1,
  time: Date.UTC(2026, 7, 30, 1, 2, 3),
  content: [
    { type: 'text', text: '# Visible prompt\n\nRun `pnpm test`.' },
    { type: 'image', attachment: { id: 'private-image' } },
  ],
  source: { username: 'private-user', cwd: '/private/workspace' },
} as const

const contextNode = {
  kind: 'context',
  seq: 2,
  time: Date.UTC(2026, 7, 30, 1, 2, 4),
  content: [{ type: 'text', text: 'Private context content' }],
  source: { env: 'SECRET_ENV' },
  producer: { role: 'inject', label: 'fixture' },
  form: null,
} as const

const assistantNode = {
  kind: 'assistant',
  seq: 3,
  time: Date.UTC(2026, 7, 30, 1, 2, 5),
  turn: 1,
  step: 1,
  blocks: [
    { kind: 'text', text: '## Visible answer\n\nDone.' },
    { kind: 'reasoning', text: 'Private reasoning content' },
    { kind: 'tool-call', callId: 'call-1', name: 'read', argsRaw: '{"path":"/private/path"}' },
  ],
} as const

const toolNode = {
  kind: 'tool-result',
  seq: 4,
  time: Date.UTC(2026, 7, 30, 1, 2, 6),
  callId: 'call-1',
  call: { name: 'read', argsRaw: '{"path":"/private/path"}' },
  callTime: Date.UTC(2026, 7, 30, 1, 2, 5),
  content: [{ type: 'text', text: 'Private tool output' }],
  isError: false,
  callView: null,
  resultView: null,
  subCalls: [],
} as const

function conversationSnapshot(overrides: Partial<LegacyConversationSlice> = {}): LegacyConversationSlice {
  return {
    nodes: [userNode, contextNode, assistantNode, toolNode],
    partial: null,
    runningCalls: [],
    turnTimings: new Map(),
    turnEnds: new Map(),
    ...overrides,
  } as unknown as LegacyConversationSlice
}

function sessionSnapshot(overrides: Partial<SessionSnapshot> = {}): SessionSnapshot {
  return {
    sessionId: 'session-1',
    pendingSubmissions: [],
    running: false,
    subagent: null,
    removed: false,
    openState: 'open',
    openError: null,
    hasMore: true,
    loadingOlder: false,
    promptError: null,
    blank: false,
    lastAgentError: null,
    promptAttempted: true,
    awaitingFirstTurn: false,
    ...overrides,
  } as unknown as SessionSnapshot
}

function translate(key: keyof typeof en, params?: Record<string, unknown>): string {
  let result: string = en[key]
  for (const [name, value] of Object.entries(params ?? {})) {
    result = result.replaceAll(`{${name}}`, String(value))
  }
  return result
}

function viewProps(
  conversation: LegacyConversationSlice,
  loadOlder = vi.fn(async () => {}),
  session = sessionSnapshot(),
  queueCount = 0,
) {
  const selectedSession: unknown[] = []
  const selectedChat: unknown[] = []
  const useSession = <S,>(selector: (current: SessionSnapshot) => S): S => {
    const selection = selector(session)
    selectedSession.push(selection)
    return selection
  }
  const chat = { legacy: conversation } as unknown as ChatSnapshot
  const useChat = <S,>(selector: (current: ChatSnapshot) => S): S => {
    const selection = selector(chat)
    selectedChat.push(selection)
    return selection
  }
  return {
    props: { useSession, useChat, useInput: (selector: (value: { queue: unknown[] }) => unknown) => selector({ queue: Array.from({ length: queueCount }, () => ({})) }), loadOlder, t: translate } as unknown as ComponentProps<typeof AccessibleView>,
    selectedSession,
    selectedChat,
    loadOlder,
  }
}

beforeEach(() => {
  document.documentElement.lang = 'en'
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn(async () => {}) },
  })
})

afterEach(() => {
  cleanup()
  document.body.replaceChildren()
  document.documentElement.removeAttribute('lang')
  vi.restoreAllMocks()
})

describe('AccessibleView', () => {
  it('reads queued activity from the current input projection only after explicit loading', () => {
    const fixture = viewProps(conversationSnapshot(), undefined, sessionSnapshot(), 2)
    render(<AccessibleView {...fixture.props} />)
    expect(screen.queryByText(/2 queued messages/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Load reading view' }))
    expect(screen.getByText('Current activity: 2 queued messages, 0 pending interactions, and 0 running tools.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Clear reading view and return' }))
    expect(screen.queryByText(/2 queued messages/)).toBeNull()
  })

  it('isolates disclosure, content, identifiers, and focus across simultaneous occurrences', () => {
    const first = viewProps(conversationSnapshot())
    const second = viewProps(conversationSnapshot({ nodes: [] }))
    render(<><div data-testid="first"><AccessibleView {...first.props} /></div><div data-testid="second"><AccessibleView {...second.props} /></div></>)
    const left = within(screen.getByTestId('first'))
    const right = within(screen.getByTestId('second'))
    fireEvent.click(left.getByRole('button', { name: 'Load reading view' }))
    expect(left.getByText('Visible prompt')).toBeTruthy()
    expect(right.queryByText('Visible prompt')).toBeNull()
    expect(right.getByRole('button', { name: 'Load reading view' })).toBeTruthy()
    fireEvent.click(right.getByRole('button', { name: 'Load reading view' }))
    expect(document.activeElement).toBe(right.getByRole('heading', { name: 'Accessible reading view' }))
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    fireEvent.click(left.getByRole('button', { name: 'Clear reading view and return' }))
    expect(document.activeElement).toBe(left.getByRole('button', { name: 'Load reading view' }))
    expect(right.getByRole('button', { name: 'Clear reading view and return' })).toBeTruthy()
  })

  it('requires explicit loading, preserves semantic content, and restores focus when cleared', async () => {
    const fixture = viewProps(conversationSnapshot())
    render(<AccessibleView {...fixture.props} />)

    expect(screen.queryByText('Visible prompt')).toBeNull()
    expect(screen.queryByText('Private context content')).toBeNull()
    expect(fixture.selectedSession.at(-1)).toBeNull()
    expect(fixture.selectedChat.at(-1)).toBeNull()

    const load = screen.getByRole('button', { name: 'Load reading view' })
    fireEvent.click(load)

    const heading = await screen.findByRole('heading', { level: 2, name: 'Accessible reading view' })
    await waitFor(() => { expect(document.activeElement).toBe(heading) })
    expect(screen.getByRole('heading', { name: 'Visible prompt' })).toBeTruthy()
    expect(screen.getByText('pnpm test')).toBeTruthy()
    expect(screen.getByText('Image attachment: this projection has no text alternative available to read.')).toBeTruthy()
    expect(screen.queryByText('Private context content')).toBeNull()
    expect(screen.queryByText('Private reasoning content')).toBeNull()
    expect(screen.queryByText('{"path":"/private/path"}')).toBeNull()
    expect(screen.queryByText('Private tool output')).toBeNull()
    const copy = screen.getByRole('button', {
      name: 'Copy visible message text from record 1, Your message',
    }) as HTMLButtonElement
    expect(copy.style.scrollMarginBlock).toContain('--dsh-composer-height')

    fireEvent.click(screen.getByRole('button', { name: 'Clear reading view and return' }))
    const restored = await screen.findByRole('button', { name: 'Load reading view' })
    await waitFor(() => { expect(document.activeElement).toBe(restored) })
    expect(screen.queryByText('Visible prompt')).toBeNull()
    expect(fixture.selectedSession.at(-1)).toBeNull()
    expect(fixture.selectedChat.at(-1)).toBeNull()
  })

  it('mounts context, reasoning, tool arguments, and tool output only after separate disclosures', async () => {
    const fixture = viewProps(conversationSnapshot())
    render(<AccessibleView {...fixture.props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Load reading view' }))

    fireEvent.click(await screen.findByRole('button', { name: 'Show context content' }))
    expect(screen.getByText('Private context content')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Show reasoning content' }))
    expect(screen.getByText('Private reasoning content')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Show tool arguments' }))
    expect(screen.getByText('{"path":"/private/path"}')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Show tool output' }))
    expect(screen.getByText('Private tool output')).toBeTruthy()
  })

  it('copies only the addressed visible message and announces clipboard outcomes', async () => {
    const fixture = viewProps(conversationSnapshot())
    render(<AccessibleView {...fixture.props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Load reading view' }))

    const copy = await screen.findByRole('button', {
      name: 'Copy visible message text from record 1, Your message',
    })
    fireEvent.click(copy)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('# Visible prompt\n\nRun `pnpm test`.')
    })
    expect((await screen.findByRole('status')).textContent).toBe('Message 1 was copied to the system clipboard.')
  })

  it('renders the in-progress assistant record at the end without turning the transcript into a live region', async () => {
    const fixture = viewProps(conversationSnapshot({
      partial: {
        turn: 2,
        step: 1,
        blocks: [{ kind: 'text', text: 'Streaming answer in progress' }],
      },
    }), undefined, sessionSnapshot({ running: true }))
    render(<AccessibleView {...fixture.props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Load reading view' }))

    const list = await screen.findByRole('list', { name: 'Conversation records in source order' })
    expect(list.getAttribute('aria-live')).toBe('off')
    expect(screen.getByText('Assistant response in progress').closest('article')?.getAttribute('aria-busy')).toBe('true')
    expect(screen.getByText('Streaming answer in progress')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toContain('the assistant is responding')
  })

  it('supports history pagination and reports recoverable failures without raw error data', async () => {
    const loadOlder = vi.fn()
      .mockRejectedValueOnce(new Error('/private/path should not render'))
      .mockResolvedValueOnce(undefined)
    const fixture = viewProps(conversationSnapshot(), loadOlder)
    render(<AccessibleView {...fixture.props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Load reading view' }))

    const older = await screen.findByRole('button', { name: 'Load older records' })
    fireEvent.click(older)
    expect(await screen.findByText('Older records could not be loaded. Retry or return to Chat.')).toBeTruthy()
    expect(screen.queryByText('/private/path should not render')).toBeNull()

    fireEvent.click(older)
    expect(await screen.findByText('The older-records request completed.')).toBeTruthy()
    expect(loadOlder).toHaveBeenCalledTimes(2)
  })

  it('ignores an older-history result after the reading view is cleared', async () => {
    let finishOlder: (() => void) | undefined
    const loadOlder = vi.fn(() => new Promise<void>((resolve) => { finishOlder = resolve }))
    const fixture = viewProps(conversationSnapshot(), loadOlder)
    render(<AccessibleView {...fixture.props} />)
    fireEvent.click(screen.getByRole('button', { name: 'Load reading view' }))

    const older = await screen.findByRole('button', { name: 'Load older records' })
    fireEvent.click(older)
    expect((screen.getByRole('button', { name: 'Loading older records…' }) as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Clear reading view and return' }))
    await act(async () => { finishOlder?.() })

    expect((await screen.findByRole('status')).textContent).toBe('Conversation content has not been loaded.')
    expect(screen.queryByText('The older-records request completed.')).toBeNull()
  })

  it('has no automatically detectable axe violations before or after loading', async () => {
    const fixture = viewProps(conversationSnapshot(), undefined, sessionSnapshot({ hasMore: false }))
    const { container } = render(<AccessibleView {...fixture.props} />)
    const initial = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(initial.violations, JSON.stringify(initial.violations, null, 2)).toHaveLength(0)

    fireEvent.click(screen.getByRole('button', { name: 'Load reading view' }))
    await screen.findByRole('list', { name: 'Conversation records in source order' })
    const loaded = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(loaded.violations, JSON.stringify(loaded.violations, null, 2)).toHaveLength(0)
  })
})
