# DSH live-announcement assistive-technology lab

[简体中文](AT-LIVE-LAB.zh.md) | English

Status: exploratory protocol for public review

Protocol: `dsh-live-at-lab/1.0.0-draft`

Tracking: [alpha.2 core migration #22](https://github.com/omdsh-dev/dsh-accessibility/issues/22), [VoiceOver #2](https://github.com/omdsh-dev/dsh-accessibility/issues/2), and [NVDA #1](https://github.com/omdsh-dev/dsh-accessibility/issues/1)

## Purpose and evidence boundary

This lab gives a human tester six deterministic, keyless DSH `0.1.7-alpha.1` replay scenarios: completed response, stopped response, failed response, question, plan review, and tool approval. Each run creates one disposable DSH home, Workspace, and blank Session and prints the exact synthetic input. Chrome mode also creates a disposable browser profile; system and Safari modes do not guarantee browser-profile isolation.

The lab exists to observe real speech or braille and focus behavior from DSH's polite live region. A Host `turn/end` line proves only the durable product boundary; it does not prove that a screen reader announced it, announced it once, used understandable wording, or left the tester able to continue. Lab readiness, DOM text, an accessibility-tree dump, and visible captions are not AT passes. Disabled-user evidence additionally requires informed consent and a de-identified task record.

## Exact setup

The launcher checks the companion manifest's exact DSH target. Existing campaign records stay bound to their original revisions; do not attach a new-version observation to an older campaign row.

Build the current candidate and install this tooling as described in [the Core AT Lab](AT-CORE-LAB.md). Then run one scenario at a time from the companion checkout:

```sh
pnpm run lab:at:live ../deepseek-harness complete system
pnpm run lab:at:live ../deepseek-harness stop system
pnpm run lab:at:live ../deepseek-harness fail system
pnpm run lab:at:live ../deepseek-harness question system
pnpm run lab:at:live ../deepseek-harness plan system
pnpm run lab:at:live ../deepseek-harness approval system
```

The shared launcher provenance gate rejects a dirty DSH or accessibility-lab checkout before it creates state. Prefer `chrome` to `system` on macOS, Windows, or Linux for a fresh temporary Chrome/Chromium profile with background networking disabled and non-loopback host resolution blocked. `safari` may be used only with a dedicated clean profile. `system` may reuse the current default-browser context. Use `none` to print the one-use local sign-in URL without opening a browser. Do not publish that URL. The readiness JSON records browser-context isolation, the exact DSH and lab revisions, scenario, operating system, synthetic Session id, and `taskInput`.

Copy `taskInput` exactly. If the Session is not already selected, open the only Session under `live-at-workspace`. Do not submit another prompt: replay fixtures are intentionally finite and a second call must fail rather than reaching a network model.

Return to the terminal and press Ctrl+C after the scenario. The launcher closes isolated Chrome and removes its browser profile, DSH home, persistence, Workspace, replay override, and temporary state. It creates no upload, recording, or public artifact. Close an inactive `system` or `safari` tab manually.

A bounded command is startup/cleanup smoke only:

```sh
pnpm run lab:at:live ../deepseek-harness complete none 500
```

Bounded smoke parses the selected fixture and builds the disposable Workspace/Session, but deliberately does not mount a callable replay because no human is present to consume it. It is not live-state or AT evidence.

## Shared observation procedure

Before every scenario, record the OS build, browser version, AT/version, UI and speech language, voice, verbosity, punctuation, browse/focus mode, input/output devices, and exact DSH revision. Start listening before submitting `taskInput`.

For every announced transition, record:

- the actual speech or braille, including order and repetition;
- whether the previous announcement was interrupted or coalesced;
- the virtual cursor and keyboard focus before and after the announcement;
- whether the user understood the available next action without seeing the screen;
- whether reading the transcript or operating the composer was disrupted;
- any workaround and whether the task remained independently completable.

Historical state must stay silent when the Session first opens or is reopened. Token chunks, elapsed-time ticks, nested tool dispatches, and repeated renders must not flood the live region. Actual output may be localized; record what was heard rather than translating it into expected English.

## Scenario tasks

Each backticked scenario name is also its stable evidence-catalog task ID. Preserve it verbatim; numbering is only for reading order.

### 1. `complete`

Submit `taskInput` and do not move focus merely to chase speech. Verify that the response start is announced once and the durable successful end is announced once. Confirm that terminal success is not announced before the final response is available and that reopening the Session does not replay either announcement as new activity.

### 2. `stop`

Submit `taskInput`, wait until partial output begins, then find and activate **Stop generating** without a pointer. Verify that start and stopped states are distinguishable, the partial response remains readable, the composer recovers, and no later completed announcement contradicts the stop.

### 3. `fail`

Submit `taskInput` and wait for the synthetic authentication failure. Verify that failure is announced rather than completion, error recovery is understandable, focus remains usable, and no credential-like or private value is spoken. The synthetic failure contains no real credential.

### 4. `question`

Submit `taskInput`. Record the response start, root tool activity, and question-needs-answer announcement. Answer the synthetic question entirely with AT and keyboard, then record tool settlement and response completion. Check that option names, checked state, custom-answer field, validation, and focus progression remain understandable while live announcements occur.

### 5. `plan`

Submit the printed `/plan ...` input. Record response/tool activity and the plan-needs-review announcement. Read the complete synthetic plan, approve it with keyboard/AT, and verify the decision, tool settlement, response completion, and focus recovery are announced or otherwise discoverable without duplicate noise.

### 6. `approval`

Before submitting, set **Access mode** to **Read Only** so the synthetic write command requires approval. Submit `taskInput`, locate the approval request, read its bounded command details, approve it, and record response/tool/request transitions. Verify that the action and risk are understandable, controls remain reachable, the approved tool settles, and the final response completes. The command writes only into the disposable Workspace.

## Copyable result template

```md
### DSH live AT lab result

- Protocol: dsh-live-at-lab/1.0.0-draft
- Scenario/task ID: complete / stop / fail / question / plan / approval
- Date/time and tester time zone:
- Consent to publish this de-identified result: yes / no
- Disabled-user evidence: no / yes (only the access need the tester chose to disclose)
- OS and build:
- Browser and exact version:
- AT and exact version:
- UI/speech language, voice, verbosity, punctuation, browse/focus mode:
- DSH revision:
- Accessibility lab version and revision:
- Input/output devices:

| Transition/task | Actual speech/braille | Focus/cursor result | Repeated/coalesced/interrupted? | Completed independently? | Workaround | Pass/fail/partial | Severity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Open/reopen historical baseline | | | | | | | |
| Response start | | | | | | | |
| Tool or request activity | | | | | | | |
| Required user action | | | | | | | |
| Durable terminal state | | | | | | | |
| Recovery and next task | | | | | | | |

- Unexpected announcements, silence, cursor traps, or transcript disruption:
- Sensitive output check:
- Untested transitions:
- Sanitized evidence link, if consented:
- Reviewer and review date:
```

Submit one Issue per exact OS/browser/AT/language/scenario combination using the assistive-technology result form. Reference issue #22 plus VoiceOver #2 or NVDA #1 where applicable. Partial, failed, and contradictory results must be preserved rather than merged into a generic pass.

## Privacy and safety

- Use only `taskInput` and the disposable `live-at-workspace`; never paste a real prompt, credential, path, or conversation.
- Prefer `chrome` for its disposable browser profile. Use `system` or `safari` only with a dedicated clean profile, and stop before testing if personal tabs, history, bookmarks, accounts, extensions, or autofill surfaces appear.
- Do not publish the one-use sign-in URL, raw speech history, or unsanitized Host output.
- Do not record or publish identifiable audio, video, screenshots, logs, or braille output without separate consent and frame/line review.
- Stop if a non-local URL, personal profile, unexpected network model, or non-synthetic content appears.
- A forced termination may leave only the exact printed `dsh-live-at-lab-...` directory under the OS temporary directory. Inspect and move that exact directory to Trash; never delete a broad temporary or home path.
