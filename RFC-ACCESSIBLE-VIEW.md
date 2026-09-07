# Accessible View MVP design and privacy review

[简体中文](RFC-ACCESSIBLE-VIEW.zh.md) | English

- Status: experimental implementation under public review
- Tracking issue: [#10](https://github.com/omdsh-dev/dsh-accessibility/issues/10)
- Protocol identifier: `dsh-accessible-view/1.0.0-draft`
- Compatibility target: DSH client packages `0.1.2-rc.1` only
- Last reviewed: 2026-09-07

## Decision

The companion may add an `accessible` entry to DSH's additive, session-scoped `conversation.view` slot. The entry reads DSH's exported structured conversation snapshot only after the user activates a second, in-view load control. It must not scrape the host DOM, observe generated classes, patch host roles, or create a parallel session store.

This is an alternative reading presentation, not an overlay that claims to repair the owning Chat implementation. A defect in Chat semantics, focus, keyboard behavior, or announcements remains a DSH core defect.

## User outcome

A screen-reader or keyboard user can choose a stable reading surface, load it deliberately, navigate conversation records in source order, read semantic Markdown and code, inspect sensitive technical details on demand, copy one addressed message, load older history, recover from errors, and clear the surface with predictable focus return.

The MVP is read-oriented. Sending, stopping, approving, editing queued work, and operating full tool cards remain in Chat. The view must say so rather than silently presenting itself as a complete Chat replacement.

## Product boundary

The implementation uses these version-pinned public contracts:

- `conversation.view`, a list slot owned by `@deepseek-ai/dsh-client-ui-conversation`;
- the session-standard `useSession` selector supplied by `@deepseek-ai/dsh-client-ui-session` for lifecycle, queue counts, pagination, and error state;
- the session-standard `useChat` selector supplied by `@deepseek-ai/dsh-client-ui-chat`;
- `ChatSnapshot.legacy`, the rc1 exported compatibility projection of finalized records, the in-progress assistant, and running Tool calls;
- the session face's `loadOlder()` action;
- DSH's `MarkdownText` and `writeClipboard` primitives.

The rc1 `ChatSnapshot.legacy` field is explicitly a compatibility projection. It is accepted only for this exact peer range. The removed `dsh-client-runtime` contract and beta.6 implementation are not used by beta.7, and support for a later DSH line requires a fresh projection and assembled-browser audit.

## Consent and data-flow states

1. **Selected, idle.** The tab renders instructions and a load button. Its Session and Chat selectors both return `null`; no lifecycle or conversation snapshot is retained by the component.
2. **Loaded.** Activating the load button admits the current structured snapshot. Focus moves to the reading-view title. Finalized records and an in-progress assistant record render in source order.
3. **Detail disclosed.** Context content, reasoning, tool arguments, tool output, command input, and raw error details are not mounted until their own disclosure button is activated.
4. **Message copied.** A message-level button writes only the ordinary visible text of that user, steering, or finalized assistant record to the operating-system clipboard. It excludes context, reasoning, tool arguments, tool results, source objects, usernames, workspace paths, and environment metadata by construction.
5. **Cleared or unmounted.** The component releases its selected snapshot and disclosure trees. Focus returns to the load button when clearing. DSH still owns its ordinary session snapshot; the companion cannot erase host history or an operating-system clipboard entry.

Loading older history invokes the current session's existing `loadOlder()` privilege. The companion does not add filesystem, workspace, network, model, tool, telemetry, recording, or persistence privileges.

## Semantic and focus contract

- One named section and a level-two view title identify the surface.
- Records are an ordered list of labelled `article` elements. Record labels are strong prose rather than extra headings so user-authored Markdown heading levels remain intact.
- DSH's untrusted-Markdown renderer preserves GFM headings, lists, tables, links, code, and math while disabling raw HTML and unsafe protocols.
- Exact tool output, command input, arguments, and errors render as preformatted code only after disclosure.
- The load action moves focus to the title. Clear unmounts content and returns focus to Load. Disclosure buttons keep focus while changing `aria-expanded`.
- Every view button includes the conversation shell's inherited composer height in its focus scroll margin, preventing keyboard focus from settling underneath the sticky composer at narrow reflow widths.
- A polite, atomic status reports record count, response-in-progress state, copy result, pagination result, and recoverable failure. The transcript itself is not a token-by-token live region.
- Current errors are announced generically; raw error text requires disclosure and is never placed in the live alert.
- History loading exposes `aria-busy`; unavailable and removed-session states remain readable.

## Privacy and threat review

| Risk | Control | Residual limitation |
| --- | --- | --- |
| Tab selection unexpectedly exposes a private conversation | A separate load action gates snapshot selection | Once loaded, primary prompts and replies are intentionally present in the accessibility tree |
| Collapsed technical material leaks through hidden DOM | Sensitive disclosure bodies are not mounted before activation | The loaded DSH snapshot already exists in host memory |
| Copy exports unrelated secrets | Copy is per-message and structurally includes visible text blocks only | The visible message itself may contain a secret or path; the user must treat the system clipboard as an export |
| Failure messages disclose paths or identifiers | Live errors use fixed localized copy; raw detail is opt-in | An explicitly opened raw error can contain sensitive text |
| Diagnostics or logs capture content | No content is sent to diagnostics, console, telemetry, storage, URL, or network | Browser extensions and the host environment remain outside this plugin's control |
| DOM coupling silently breaks after a DSH update | No host DOM query, class observer, or role rewrite exists; peers are exact | Every new DSH line still needs a projection and assembled-browser review |
| A reading view masks an inaccessible Chat control | Scope and limitations are stated; no conformance claim is upgraded | Users must return to Chat for write and approval tasks in the MVP |

Public fixtures use synthetic markers only. Screenshots, logs, issue comments, and CI artifacts must not include real prompts, model output, usernames, absolute paths, environment identifiers, tokens, or credentials.

## Automated evidence required for review

- Registration test proving the additive view waits for the owning slot and uses a session-bound action.
- Selector test proving the unloaded state selects `null`.
- Keyboard/focus tests for load, clear, disclosure, copy feedback, history success, and history failure.
- Content tests for source order, Markdown headings/code, live partial output, unsupported records, and delayed mounting of sensitive details.
- Privacy tests proving the default clipboard projection excludes context, reasoning, tool material, and source metadata.
- axe-core checks in idle and loaded states.
- Typecheck, host/client build, package-content inspection, and assembled DSH browser tests on the exact supported line.
- The versioned [non-AT browser contract](RFC-BROWSER-EVIDENCE.md) runs the assembled candidate in Chromium, Firefox, and WebKit at 640/320 CSS px and checks sampled focus obscuration, reduced motion, and Chromium forced-color participation.

Automated evidence can reach only the project's `automated` evidence level. It does not prove spoken output, screen-reader browse-mode behavior, clipboard announcements, or independent task completion.

## Real assistive-technology protocol

Use a disposable workspace and synthetic conversation containing a heading, list, code fence, table, link, reasoning marker, context marker, tool arguments, tool output, interrupted reply, error, and enough history to paginate.

For each exact AT/browser row:

1. Select Accessible View and confirm the synthetic prompt marker is not exposed before Load.
2. Activate Load by keyboard and record the announced destination and actual focus target.
3. Navigate the ordered records, user-authored headings, list, table, link, inline code, and code block without switching to object-inspection workarounds.
4. Generate a response and verify the in-progress status is understandable without token-by-token speech flooding.
5. Open and close every sensitive disclosure; record name, expanded state, focus stability, and spoken result.
6. Copy one user and one assistant message; verify the success/failure announcement and that hidden context, reasoning, tool data, and metadata are absent.
7. Load older records, verify reading order and `busy`/completion feedback, then exercise a sanitized failure and retry.
8. Clear the view and verify focus returns to Load and conversation content leaves the accessibility tree.
9. Return to Chat and confirm the source conversation was not changed.

Record OS, browser, AT, language, verbosity, punctuation, DSH commit/tag, companion commit/package, exact spoken output, focus target, task outcome, workaround, severity, and sanitized evidence location.

Before a stable support claim, the current candidate needs listener-verified VoiceOver and NVDA runs and an independent task-completion round with disabled developers under [RESEARCH.md](RESEARCH.md). JAWS, Narrator, Orca, braille-display, forced-colors, zoom/reflow, and reduced-motion results remain separately versioned matrix rows.

## Known limitations

- Image records expose a generic attachment notice because the exact rc1 compatibility projection does not supply an authored text alternative through this view.
- Queued-message bodies and pending-interaction payloads are not rendered; only counts are announced. The user returns to Chat to manage them.
- Running tools are counted; full interactive tool controls remain in Chat.
- Technical output uses a generic preformatted presentation, not every tool's specialized card.
- The transcript deliberately avoids automatic token speech. Users navigate the in-progress record when they want updated content.
- Clearing the view releases companion references but does not delete DSH history or clear the operating-system clipboard.
- No current evidence justifies “fully accessible,” “certified,” or stable-support language.

## Release decision

The MVP may merge as experimental after code, security, privacy, and package review. It must retain `needs-at-verification` until the real-AT protocol has current VoiceOver and NVDA evidence. Stable npm publication remains governed by the repository-wide release gates; merging this RFC or passing axe does not satisfy them.
