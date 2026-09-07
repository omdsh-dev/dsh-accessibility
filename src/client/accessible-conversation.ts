import type { ConversationNode } from '@deepseek-ai/dsh-client-ui-conversation/client'

type MessageContentBlock = Extract<ConversationNode, { kind: 'user' }>['content'][number]

/** Return only ordinary visible message text for an explicit clipboard action. */
function visibleContentText(content: readonly MessageContentBlock[]): string {
  return content
    .flatMap((block) => {
      if (block.type === 'text') return [block.text]
      return []
    })
    .filter(text => text.length > 0)
    .join('\n\n')
}

/**
 * Build the exact text copied by one message-level action.
 *
 * Context, reasoning, tool arguments, tool results, source metadata, and
 * environment identifiers are deliberately outside this default copy path.
 */
export function messageClipboardText(node: ConversationNode): string | null {
  switch (node.kind) {
    case 'user':
    case 'steering': {
      const text = visibleContentText(node.content)
      return text === '' ? null : text
    }
    case 'assistant': {
      const text = node.blocks
        .flatMap(block => block.kind === 'text' ? [block.text] : [])
        .filter(part => part.length > 0)
        .join('\n\n')
      return text === '' ? null : text
    }
    default:
      return null
  }
}

/** Stable item identity without including session, path, or user metadata. */
export function conversationNodeKey(node: ConversationNode): string {
  return `${node.kind}:${node.seq}`
}
