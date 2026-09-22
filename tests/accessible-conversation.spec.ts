import type { ConversationNode } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { describe, expect, it } from 'vitest'
import { conversationNodeKey, messageClipboardText } from '../src/client/accessible-conversation.ts'

describe('accessible conversation privacy helpers', () => {
  it('copies visible user message text without hidden content or source metadata', () => {
    const node = {
      kind: 'user',
      seq: 7,
      time: 1,
      content: [
        { type: 'text', text: 'Visible prompt' },
        { type: 'reasoning', text: 'hidden reasoning' },
        { type: 'tool-call', id: 'call-1', name: 'secret-tool', arguments: '{"token":"secret"}' },
      ],
      source: { username: 'private-user', cwd: '/private/path' },
    } as unknown as ConversationNode

    expect(messageClipboardText(node)).toBe('Visible prompt')
    expect(conversationNodeKey(node)).toBe('user:7')
  })

  it('copies only visible assistant text and refuses implicit exports for other record kinds', () => {
    const assistant = {
      kind: 'assistant',
      seq: 8,
      time: 2,
      turn: 1,
      step: 1,
      blocks: [
        { kind: 'text', text: 'Visible answer' },
        { kind: 'reasoning', text: 'private chain of thought' },
        { kind: 'tool-call', callId: 'call-1', name: 'read', argsRaw: '/private/path' },
      ],
    } as unknown as ConversationNode
    const error = {
      kind: 'turn-error', seq: 9, time: 3, turn: 1, step: 1, message: '/private/error',
    } as ConversationNode

    expect(messageClipboardText(assistant)).toBe('Visible answer')
    expect(messageClipboardText(error)).toBeNull()
  })
})
