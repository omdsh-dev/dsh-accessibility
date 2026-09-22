# DSH core assistive-technology lab

[简体中文](AT-CORE-LAB.zh.md) | English

Status: exploratory protocol for public review

Protocol: `dsh-core-at-lab/1.0.0-draft`

Tracking: [alpha.2 core migration #22](https://github.com/omdsh-dev/dsh-accessibility/issues/22), [VoiceOver #2](https://github.com/omdsh-dev/dsh-accessibility/issues/2), and [NVDA #1](https://github.com/omdsh-dev/dsh-accessibility/issues/1)

## Purpose and evidence boundary

This lab launches the exact DSH `0.1.7-alpha.1` core candidate with two copies of DSH's committed synthetic seeded-history Session. It uses a disposable DSH home, persistence root, and workspace, and needs no API key or companion plugin. It covers the core shell, Workspace tree, Session views, Chat history, Trajectory, Settings dialog, menus, disclosures, and adjustable separators.

Lab readiness, an accessibility-tree dump, or a visible screen-reader caption is not an assistive-technology pass. A valid result needs a person to observe actual speech or braille, focus or cursor behavior, independent task completion, errors, and workarounds. Disabled-user evidence additionally requires informed consent and a de-identified task record. This static fixture does not test live response, tool, approval, question, or plan-review announcements; use the separate [live-announcement lab](AT-LIVE-LAB.md) for those evidence rows.

## Exact candidate setup

This checkout targets the version pinned by the companion manifest. The existing primary AT campaign remains frozen to its original revisions; a run on this candidate is a separate observation and must not fill an older campaign row.

```sh
git clone https://github.com/omdsh-dev/deepseek-harness.git
git clone https://github.com/omdsh-dev/dsh-accessibility.git

cd deepseek-harness
git checkout feat/a11y-core-0.1.7-alpha.1
pnpm install
pnpm run build

cd ../dsh-accessibility
git checkout feat/compat-0.1.7-alpha.1
pnpm install --frozen-lockfile
```

The launcher fails before creating any lab state unless both the DSH checkout and this accessibility-lab checkout are Git repositories with clean tracked, staged, and untracked state. The readiness record identifies the full commit and package version for each checkout; a branch name or a commit that omits local changes is never accepted as evidence provenance.

Launch from the companion checkout:

```sh
# Print a one-use local sign-in URL without opening a browser.
pnpm run lab:at:core ../deepseek-harness none

# Open the system default browser on macOS, Windows, or Linux.
pnpm run lab:at:core ../deepseek-harness system

# Open Safari on macOS. This can reuse its existing browser context, so use a
# dedicated clean profile and stop immediately if any personal UI appears.
pnpm run lab:at:core ../deepseek-harness safari

# Open Google Chrome on macOS or Windows, or Chrome/Chromium on Linux, with a
# fresh temporary profile. Background networking is disabled and non-loopback
# host resolution is blocked.
pnpm run lab:at:core ../deepseek-harness chrome
```

The launcher prints a versioned JSON readiness record with the exact DSH and lab revisions, operating-system information, and browser-context isolation. It prints the temporary one-use sign-in URL separately: use it locally, but do not paste it into a public result. It creates no screenshot, recording, upload, or public artifact. The cross-platform `chrome` mode is the safest local default because it finds an installed Chrome/Chromium executable and never opens the tester's ordinary profile; `system` and `safari` may reuse an existing browser context and therefore require a dedicated clean profile.

Return to the terminal and press Ctrl+C to request cleanup. The launcher then closes an isolated Chrome process and removes its temporary profile, disposable DSH home, Session persistence, and workspace. Close a now-inactive `system` or `safari` tab manually. A forcibly killed process may leave only its printed `dsh-core-at-lab-...` directory under the operating system's temporary directory; inspect and move that exact directory to Trash rather than deleting a broad temporary path.

For an automated startup-and-cleanup smoke check only:

```sh
pnpm run lab:at:core ../deepseek-harness none 1000
```

That result proves only that the lab booted and cleaned up. It is not AT evidence.

## Human core-task procedure

Before testing, record the OS build, browser version, AT name/version, UI and speech language, voice, verbosity, punctuation, input/output devices, and the exact DSH revision from the readiness record. Use only the two synthetic Sessions. The backticked names below are stable catalog task IDs; do not renumber or replace them with free text in evidence records.

1. `discover-structure` — Find the DSH application title, named Sidebar navigation, main content, and Details complementary region without a pointer.
2. `navigate-sessions` — Enter the Sessions tree once, announce its level and expanded/selected states, navigate with arrows/Home/End and typeahead, activate the second synthetic Session, and return to the tree after visiting a row action.
3. `search-sessions` — Open Session search, enter and clear a query, close it with Escape, and confirm focus returns to Search sessions.
4. `adjust-layout` — Find the Sidebar and Details separators, hear their names, orientation, values, and bounds, adjust with arrows/Home/End, toggle Details with Enter, and confirm focus remains on the separator.
5. `switch-session-view` — Find the Session views tab list. Move between Chat and Trajectory with arrow keys/Home/End, verify selected state and the newly named panel, and confirm the tab list uses one ordinary Tab stop.
6. `read-conversation` — In Chat, read the synthetic conversation in source order. Record whether message authors, text, code, links, tool name, and the running/completed/failed/stopped state vocabulary are understandable. Expand and collapse a tool disclosure and verify its controlled-content boundary and focus stability.
7. `inspect-trajectory` — In Trajectory, enter the event table once, navigate rows with arrows/Home/End, open one row, move through Event details tabs, adjust the event-details separator, close details, and confirm a predictable return path.
8. `configure-settings` — Open Settings, confirm the dialog name and initial focus, open a settings menu, verify checked choices and movement with arrows/Home/End/typeahead, dismiss only the menu with Escape, then dismiss Settings and confirm focus returns to its trigger.
9. `edit-composer-draft` — Return to Chat, locate the message composer and its send control, type and edit a synthetic draft, then clear it without submitting. Confirm ordinary Tab/Shift+Tab navigation does not require pointer recovery.
10. `nonvisual-repeat` — Repeat the most failure-prone route with the display visually ignored or off when safe. Record every unexpected repetition, silence, browse/focus-mode switch, cursor trap, focus loss, workaround, and whether the task remained independently completable. This exploratory repetition is cataloged but is not independently eligible for a support claim.

VoiceOver testers should use the rotor, VO+Left/Right, VO+Space, and Tab/Shift+Tab according to the control. NVDA testers should exercise both browse and focus modes and record mode switches. Do not normalize a surprising utterance; record enough exact wording to reproduce it while excluding unnecessary synthetic content.

## Copyable result template

```md
### DSH core AT lab result

- Protocol: dsh-core-at-lab/1.0.0-draft
- Date/time and tester time zone:
- Consent to publish this de-identified result: yes / no
- Disabled-user evidence: no / yes (category only; do not include an access need, diagnosis, or disability detail)
- OS and build:
- Browser and exact version:
- AT and exact version:
- UI/speech language, voice, verbosity, punctuation:
- DSH revision:
- Accessibility lab version and revision:
- Input/output devices:

| Task | Actual speech/braille and focus/cursor result | Completed independently? | Workaround | Pass/fail/partial | Severity |
| --- | --- | --- | --- | --- | --- |
| `discover-structure` | | | | | |
| `navigate-sessions` | | | | | |
| `search-sessions` | | | | | |
| `adjust-layout` | | | | | |
| `switch-session-view` | | | | | |
| `read-conversation` | | | | | |
| `inspect-trajectory` | | | | | |
| `configure-settings` | | | | | |
| `edit-composer-draft` | | | | | |
| `nonvisual-repeat` | | | | | |

- Unexpected announcements, repetitions, silence, or cursor traps:
- Recovery path:
- Untested rows, including live announcements:
- Sanitized evidence link, if consented:
- Reviewer and review date:
```

Submit one public result per OS/browser/AT/language combination through the assistive-technology result form. Reference issue #22 plus VoiceOver #2 or NVDA #1 where applicable. Partial and failed results are useful and must remain labeled as such.

## Privacy and safety

- Never use a normal DSH home, real workspace, API key, prompt, conversation, username, or private path.
- Prefer `chrome` for its disposable browser profile. Use `system` or `safari` only with a dedicated clean profile, and stop before testing if personal tabs, history, bookmarks, accounts, extensions, or autofill surfaces appear.
- Do not publish the one-use local sign-in URL or raw speech history. Do not publish screen/audio recordings, logs, screenshots, or braille output without reviewing every frame or line and obtaining consent from identifiable participants.
- Stop if the browser opens a non-local URL, an unexpected account/profile surface appears, or synthetic content cannot be distinguished from personal data.
- Lab output is local test metadata. It must not be uploaded automatically or used to claim whole-product accessibility.
