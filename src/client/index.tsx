import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { AccessibilitySection } from './AccessibilitySection.tsx'
import { AccessibleView, type AccessibleViewInjected } from './AccessibleView.tsx'
import { en, zh, type AccessibilityKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    accessibility: AccessibilityKey
  }
}

export { AccessibilitySection } from './AccessibilitySection.tsx'
export { AccessibleView } from './AccessibleView.tsx'
export { conversationNodeKey, messageClipboardText } from './accessible-conversation.ts'
export {
  ACCESSIBILITY_CHECK_IDS,
  hasAccessibleName,
  hasAuthorName,
  runAccessibilityAudit,
  runSyntheticAccessibilityExample,
} from './audit.ts'
export type { AccessibilityCheck, AccessibilityCheckId } from './audit.ts'
export {
  createRedactedDiagnosticReport,
  REDACTED_DIAGNOSTIC_PROTOCOL,
  redactedDiagnosticReportText,
} from './diagnostic-report.ts'
export type { RedactedDiagnosticCheck, RedactedDiagnosticReport } from './diagnostic-report.ts'
export { inspectFocusedElement } from './focus-inspector.ts'
export type { FocusInspection, FocusNameSource, FocusState } from './focus-inspector.ts'
export type { AccessibilityKey } from './locales.ts'

export const inject = ['slots', 'locale', 'sessions']

/** Register the diagnostics page only after the Settings shell declares its slot. */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register('accessibility', { zh, en }), 'dsh-accessibility: dictionaries')
  const t = ctx.locale.bind('accessibility')
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'accessibility',
    order: 40,
    label: () => t('nav'),
    locale: 'accessibility',
  }, AccessibilitySection))

  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'accessible',
    order: 40,
    label: () => t('view.nav'),
    locale: 'accessibility',
    inject: (sessionId): AccessibleViewInjected => ({
      loadOlder: async () => {
        const binding = ctx.sessions.binding(sessionId)
        if (binding === undefined) throw new Error('dsh-accessibility: session is unavailable')
        await binding.session.loadOlder()
      },
    }),
  }, AccessibleView))
}
