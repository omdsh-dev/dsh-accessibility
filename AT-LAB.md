# Hermetic assistive-technology lab

[简体中文](AT-LAB.zh.md) | English

Status: exploratory protocol for public review

Protocol: `dsh-at-lab/1.0.0-draft`

Tracking: [VoiceOver #2](https://github.com/omdsh-dev/dsh-accessibility/issues/2), [NVDA #1](https://github.com/omdsh-dev/dsh-accessibility/issues/1), and [Accessible View #10](https://github.com/omdsh-dev/dsh-accessibility/issues/10)

This protocol tests the `0.1.0-beta.7` companion, Accessible View, and diagnostic feedback loop on DSH `0.1.2-rc.1` plus the matching accessibility core candidate. The [DSH core AT lab](AT-CORE-LAB.md) remains the historical first-campaign protocol pinned to its exact alpha.2 revisions; results from that campaign do not transfer to rc1.

## Purpose and evidence boundary

The launcher creates a temporary, keyless DSH Web world with the exact external companion and DSH's committed synthetic seeded-history fixture. It makes real VoiceOver, NVDA, Narrator, JAWS, Orca, braille-display, magnifier, switch, voice-input, and keyboard-only observation easier without exposing a tester's normal DSH profile.

Starting the lab, inspecting the accessibility tree, or showing a VoiceOver caption panel is not a screen-reader pass. A valid AT result still needs a person to observe actual speech or braille, focus/cursor behavior, task completion, errors, and workarounds. A disabled-user result additionally needs informed consent and a de-identified task record.

## Exact candidate setup

Build the tagged DSH baseline and the candidate branch first:

```sh
git clone https://github.com/omdsh-dev/deepseek-harness.git
git clone https://github.com/omdsh-dev/dsh-accessibility.git

cd deepseek-harness
git checkout dsh-v0.1.2-rc.1-a11y.4
pnpm install
pnpm run build:official

cd ../dsh-accessibility
git checkout v0.1.0-beta.7
pnpm install --frozen-lockfile
pnpm run build
```

The launcher refuses a DSH or companion checkout with tracked, staged, or untracked changes. Its revisions therefore identify all executable product and lab source used for the run instead of silently attributing a dirty tree to `HEAD`.

From the companion checkout, start one of these modes:

```sh
# Print the local URL without opening a browser (all platforms).
pnpm run lab:at ../deepseek-harness . none

# Open the system default browser (all platforms).
pnpm run lab:at ../deepseek-harness . system

# Open Safari on macOS. Use a dedicated clean browser profile.
pnpm run lab:at ../deepseek-harness . safari

# Open Chrome on macOS or Windows, or Chrome/Chromium on Linux, with a fresh
# temporary profile, blocked background networking, and non-loopback host
# resolution disabled.
pnpm run lab:at ../deepseek-harness . chrome
```

The launcher prints a versioned JSON readiness record with exact Git revisions, OS information, browser-context isolation, the local origin, and explicit limitations. It prints the temporary local sign-in URL separately: use it locally, but do not paste it into a public result while the lab is active. It creates no screenshot, recording, upload, or public artifact. The cross-platform `chrome` mode is the safest local default because it finds an installed Chrome/Chromium executable and never opens the tester's ordinary profile. `system` and `safari` may reuse an existing browser context and require a dedicated clean profile. Return to the terminal and press Ctrl+C to request cleanup. The launcher closes isolated Chrome and removes its temporary profile, disposable DSH home, session persistence, workspace, and temporary plugin link. Close an inactive `system` or `safari` tab manually.

For an automated startup-and-cleanup smoke check only, pass a timeout in milliseconds:

```sh
pnpm run lab:at ../deepseek-harness . none 1000
```

That smoke result proves only that the lab booted and cleaned up; it is not AT evidence.

## Human observation procedure

Record the macOS/Windows/Linux build, browser version, AT name/version, language, speech voice, verbosity, punctuation, companion revision, and exact DSH revision before the task.

Use only the synthetic session. The backticked names below are stable catalog task IDs; retain them verbatim in evidence records. Then:

1. `discover-structure` — Find DSH's application title and major landmarks without a pointer.
2. `open-synthetic-session` — Locate and open the synthetic conversation from the session tree.
3. `activate-accessible-view` — Move to the Accessible view tab and activate it.
4. `verify-unloaded-privacy` — Confirm that conversation content is absent until Load reading view is activated and the privacy notice is understandable.
5. `load-reading-view` — Load the view; record the announced title, focus target, record count/status, and whether source order is understandable.
6. `read-semantic-content` — Navigate headings, records, code, links, and tool disclosures in browse/reading mode and with ordinary keyboard focus where appropriate.
7. `operate-tool-disclosure` — Expand and collapse tool output; confirm name, expanded state, content boundary, and focus stability.
8. `copy-visible-message` — Copy a visible message; record the announcement and verify that hidden context, reasoning, tool material, paths, and source metadata are not copied.
9. `clear-reading-view` — Clear the view; verify that sensitive content unmounts and focus returns to Load reading view.
10. `return-to-chat` — Return to Chat and complete the ordinary keyboard route without pointer recovery.
11. `use-diagnostic-guidance` — Open Settings → Accessibility, run the detached synthetic diagnostic practice, understand that exactly one of seventeen checks needs attention, expand the control-name guidance, and identify the missing-name repair without relying on color or visual location. Confirm that the practice neither changes nor scans the current page.
12. `inspect-focused-control` — Start focus tracking, move to the Accessibility navigation control outside the inspector panel, return to the inspector, and understand its element, approximate name and source, role, Tab position, and current state. Confirm the snapshot is retained when focus returns, is not continuously announced while browsing, and stops changing after Stop tracking focus.
13. `copy-redacted-diagnostic` — Run the current-page diagnostic, activate Prepare and review redacted JSON, read enough of the exact preview to identify `protocol`, `claim: none`, check IDs/counts, exclusions, and limitations, then activate the separate Copy action. Confirm the copy announcement is understandable and the preview contains no page URL/title, DOM/selector, element or focus name, conversation content, or browser identity. Do not paste it into a public destination during the task.

For VoiceOver, use the rotor, VO+Left/Right, VO+Space, and Tab/Shift+Tab according to the control. For NVDA, test both browse and focus modes and record mode switches. Do not normalize a surprising utterance: record it exactly enough to reproduce while omitting synthetic content that is not needed for the defect.

## Copyable result template

```md
### AT lab result

- Date/time and tester time zone:
- Consent to publish this de-identified result: yes / no
- Disabled-user evidence: no / yes (state only the relevant access need the tester chose to disclose)
- OS and build:
- Browser and exact version:
- AT and exact version:
- UI/speech language, voice, verbosity, punctuation:
- DSH revision:
- Companion revision:
- Input/output devices:

| Task | Actual speech/braille and focus/cursor result | Completed independently? | Workaround | Pass/fail | Severity |
| --- | --- | --- | --- | --- | --- |
| `discover-structure` | | | | | |
| `open-synthetic-session` | | | | | |
| `activate-accessible-view` | | | | | |
| `verify-unloaded-privacy` | | | | | |
| `load-reading-view` | | | | | |
| `read-semantic-content` | | | | | |
| `operate-tool-disclosure` | | | | | |
| `copy-visible-message` | | | | | |
| `clear-reading-view` | | | | | |
| `return-to-chat` | | | | | |
| `use-diagnostic-guidance` | | | | | |
| `inspect-focused-control` | | | | | |
| `copy-redacted-diagnostic` | | | | | |

- Unexpected announcements, repetitions, silence, or cursor traps:
- Recovery path:
- Sanitized evidence link, if consented:
- Reviewer and review date:
```

Submit VoiceOver results to issue #2 and NVDA results to issue #1. Accessible View-specific findings should also reference issue #10. Partial and failed results are useful and must remain labeled as such.

## Privacy and safety

- Do not use a normal DSH home, real workspace, API key, prompt, conversation, username, or private path.
- Prefer `chrome` for its disposable browser profile. Use `system` or `safari` only with a dedicated clean profile, and stop before testing if personal tabs, history, bookmarks, accounts, extensions, or autofill surfaces appear.
- Do not publish the local sign-in URL while the lab is active.
- Do not publish raw speech history, screen/audio recordings, logs, screenshots, or braille output without reviewing every frame/line and obtaining consent from identifiable participants.
- Stop if the browser opens a non-local URL, an unexpected account/profile surface appears, or synthetic content cannot be distinguished from personal data.
- A launcher crash should still remove its owned state. If the process is forcibly killed, inspect only the printed lab prefix under the OS temporary directory and move that exact directory to Trash; never remove a broad temporary or home directory.
