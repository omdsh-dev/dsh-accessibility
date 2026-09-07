# Accessibility support and verification

[简体中文](ACCESSIBILITY.zh.md)

This project targets operable, understandable DeepSeek Harness Web and CLI workflows for keyboard-only and screen-reader users. The companion diagnostics are additive evidence; the owning DSH components remain responsible for semantics, focus, keyboard models, announcements, and stable terminal output.

## Supported core

- Official baseline: `@deepseek-ai/dsh@0.1.2-rc.1`.
- Complete candidate build: [`dsh-v0.1.2-rc.1-a11y.5`](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.5).
- Companion candidate: `@oh-my-dsh/dsh-accessibility@0.1.0-beta.8`.
- Upstream tracking: [deepseek-ai/deepseek-harness Discussion #4546](https://github.com/deepseek-ai/deepseek-harness/discussions/4546).

Installing this npm package into an unpatched official build adds diagnostics and guidance, but cannot replace missing core focus or composite-widget behavior.

The beta.8 companion contains an experimental Accessible View candidate migrated to rc1's Session and Chat projections. Its automated component evidence is not an assistive-technology support claim. See [RFC-ACCESSIBLE-VIEW.md](RFC-ACCESSIBLE-VIEW.md).

The rc1 accessibility core candidate also contains the one-shot CLI accessibility work first developed on alpha.2. Its low-noise text and versioned JSON output are implemented, while the archived alpha.2 process result does not transfer automatically and real terminal, screen-reader, braille, and disabled-developer evidence remain pending. See [CLI-ACCESSIBILITY.md](CLI-ACCESSIBILITY.md).

## Assistive-technology matrix

| Platform | Browser | Assistive technology | Status |
| --- | --- | --- | --- |
| macOS | Chrome 151 | VoiceOver | Browser accessibility-tree and keyboard regression passed; complete spoken-output record pending |
| macOS | Safari 18.5 | VoiceOver 10 | VoiceOver-enabled native tree and focus-route regression passed; listener-verified spoken-output record pending |
| Windows 11 | Chrome / Firefox | NVDA | Automated Windows gate passed; physical screen-reader regression pending |
| Windows 11 | Edge / Chrome | JAWS | Automated Windows gate passed; physical screen-reader regression pending |
| Windows 11 | Edge | Narrator | Recommended compatibility signal; not a replacement for NVDA or JAWS |
| Linux | Firefox | Orca | Physical screen-reader regression pending |
| Supported desktop platforms | Browser / terminal | Named screen-reader and refreshable-braille-display stack | Core Web and CLI human braille records pending |
| Supported desktop platforms | Browser | Named voice-input, switch-input, or magnification technology | Core Web human task records pending |

This matrix is a planning and limitation summary, not a support claim by itself. A row may support `a11y-at-tested` or `a11y-user-validated` only when its current, exact-version human result appears in the validated [human evidence ledger](HUMAN-EVIDENCE.md) and uses an eligible task from the authoritative [evidence catalog](EVIDENCE-CATALOG.json). The [aggregate coverage policy](EVIDENCE-COVERAGE.md) additionally prevents incompatible rows from being combined. The ledger currently contains only a non-evidence template, so every listener-verified and disabled-user row and all twenty-six aggregate requirements remain pending.

## Recorded macOS evidence

The 2026-08-26 regression used macOS 15.5 (24F74), Chrome 151.0.7922.170, Safari 18.5, and VoiceOver 10. On the patched production build, the native Safari accessibility tree exposed named navigation, one application heading, main and complementary landmarks, conversation log and message articles, the Chat/Trajectory tab set, timeline composites, menus, dialogs, composer controls, and adjustable separators. Keyboard checks covered tab switching, menu dismissal, a forty-Tab modal-containment loop, collapsed-search exclusion and Escape restoration, and the named Settings trigger in the collapsed rail. The installed companion reported every deterministic diagnostic passing.

The VoiceOver-enabled Safari run started the real system VoiceOver process and exercised the Chinese onboarding and empty-shell flow. Sequential focus moved through Open sidebar, New session, Add workspace, Search sessions, Settings, Select workspace, Agent preset, and the composer. Settings opened from the keyboard, its controls remained reachable, and Escape returned focus to Settings. The native tree exposed each visited control with a role and localized name.

This evidence verifies the real VoiceOver-enabled environment, browser mappings, exposed structure, and focus/key behavior available to the automation surface. The runner cannot reliably capture audio utterances or the VoiceOver cursor overlay, so the matrix keeps listener-verified speech pending rather than upgrading this run into an assistive-technology certification.

## Required manual scenarios

1. Traverse landmarks and headings without visiting every control.
2. Open and close Settings, image previews, and nested dialogs; verify containment and focus return.
3. Enter the workspace and subagent trees once with Tab, then use Arrow, Home, End, Enter, and Space.
4. Operate model and action menus, submenus, typeahead, Escape, and Tab exit.
5. Operate command comboboxes and listboxes with active-descendant announcements.
6. Complete single- and multi-select questions, including custom text answers.
7. Read conversation articles, reasoning, tool output, code, tables, math, images, errors, and completion status.
8. Resize both panel separators from the keyboard and confirm value announcements.
9. Select trajectory rows and ranges, switch views, and leave composite widgets with one Tab.
10. Open feedback notes, traverse boundaries, submit or cancel, and verify returned focus.
11. Exercise offline, reconnecting, loading, authentication-error, interrupted, and retried states.
12. Repeat critical flows at 200% and 400% zoom and with reduced motion or forced colors enabled.
13. Select Accessible View and prove conversation markers are absent before the explicit Load action; then load and verify focus moves to the view title.
14. Navigate source-order records and semantic Markdown/code; inspect context, reasoning, tool arguments/output, command input, and errors through their separate disclosures without losing focus.
15. Copy addressed messages, load older history through success and sanitized failure, clear the view, verify focus returns to Load, and confirm Chat source data is unchanged.
16. Run the detached synthetic diagnostic practice, understand its fixed one-of-seventeen failure, open contextual guidance, and determine the missing-name repair without relying on color or visual location alone.
17. Start focus tracking, move to a named stateful control, return to the inspector, and verify its name, role, Tab position, and state are understandable; confirm the snapshot is not announced continuously while browsing.
18. Run the current-page diagnostic, separately prepare and review the exact redacted JSON, then copy it; confirm it contains no page title, URL, selector, element/focus name, practice result, conversation content, or browser identity and is not described as AT or WCAG evidence.

Record the browser, assistive-technology version, language, scenario, spoken result, focus result, and pass/fail outcome. Do not convert an automated DOM pass into a manual assistive-technology pass.

Use the [hermetic AT lab](AT-LAB.md) to launch an exact candidate with a disposable DSH home and synthetic session. Lab readiness and caption-panel output still require a human-observed speech/braille and task-completion record.

For the one-shot terminal candidate, use the [CLI accessibility manual lab](CLI-ACCESSIBILITY.md#manual-terminal-and-screen-reader-lab). Record the real speech or braille sequence and independent task result separately from its automated process output.

For the complete audit/read/approve-or-reject/edit/re-audit flow, use the [authoring AT lab](AUTHORING-AT-LAB.md). Publish only a consented, de-identified result, then encode any reviewed support evidence with `dsh-a11y-human-evidence/0.1.0-draft`; failures and partial results remain valuable with `claim: none`.

## Automated gates

- Seventeen deterministic semantic diagnostics in the installed settings page.
- Localized per-check repair guidance, ephemeral focus-name/role/state inspection, and strict allowlist projection under [dsh-accessibility-diagnostic/1.0.0-draft](DIAGNOSTIC-REPORT.md); focus snapshots never enter the report.
- Unit tests for names, references, landmarks, headings, list ownership, nested controls, menus, listboxes, trees, radio groups, tabs, dialogs, and separators.
- axe-core regression for the rendered plugin settings surface.
- Accessible View registration, unloaded-selector, focus lifecycle, delayed-sensitive-content, clipboard-projection, pagination, source-order, and idle/loaded axe-core tests.
- Versioned `dsh-non-at-browser/1.0.0-draft` assembled evidence for Accessible View in Chromium, Firefox, and WebKit: 640/320 CSS px page reflow, sampled focus visibility/obscuration, reduced motion, and Chromium forced-color participation. Scope and limitations are defined in [RFC-BROWSER-EVIDENCE.md](RFC-BROWSER-EVIDENCE.md).
- Schema-validated `dsh-core-browser-non-at` evidence on exact clean rc1 revision `1e7f105934eeb8d93dedcf738c480fab30069109`: fourteen required checks cover all nine cataloged static P0 Web tasks in Chromium, Firefox, and WebKit. The [current rc1 report](automated-evidence/core-browser/2026-09-07-dsh-0.1.2-rc.1-1e7f105934.json) remains non-AT and non-user evidence. The [previous rc1 report](automated-evidence/core-browser/2026-09-07-dsh-0.1.2-rc.1-21859d968c.json) and original [alpha.2 campaign report](automated-evidence/core-browser/2026-08-31-dsh-0.1.2-alpha.2-5803bfcfdd.json) remain bound only to their exact revisions.
- Versioned `dsh-cli-accessibility/1.0.0-draft` product-entry process conformance for discoverability, fail-closed arguments, low-noise text, one-line JSON, terminal controls, exit status, and success/failure projection. This is explicitly non-AT evidence.
- `dsh-a11y-human-evidence/0.1.0-draft` schema and repository validator plus the pinned `dsh-a11y-evidence-catalog/0.1.0-draft` for exact scope, known stable tasks, authoritative core/safety/claim classification, consent flags, privacy, assistance, task safety/effectiveness, public review, and evidence freshness. This gate can reject an unsupported claim; it cannot manufacture human evidence.
- `dsh-a11y-evidence-coverage-policy/0.1.0-draft` and its versioned report aggregate only compatible exact-environment AT records, require disabled-developer task sets to stay within one record, and expose every missing baseline row without turning coverage into release readiness.
- Cross-platform Node, type, unit, build, and package-content checks in GitHub Actions.
- The patched core retains its component, GUI, production-build, and browser-replay suites.

## Reporting

Report regressions through [GitHub Issues](https://github.com/omdsh-dev/dsh-accessibility/issues) and include the exact matrix row and scenario. Security-sensitive reports should follow [SECURITY.md](SECURITY.md).
