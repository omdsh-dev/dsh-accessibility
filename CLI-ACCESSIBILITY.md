# DSH CLI accessibility protocol

[简体中文](CLI-ACCESSIBILITY.zh.md) | English

Protocol: `dsh-cli-accessibility/1.0.0-draft`

This protocol defines the stable process output and the human assistive-technology evidence required for the DSH one-shot headless CLI. The current launcher targets DSH `0.2.0-rc.2` exactly; archived alpha.2 results remain scoped to their original revisions. Passing its automated checks is necessary process evidence, not proof that a named screen reader, terminal, or disabled developer can use the workflow.

## Normative process contract

The product entry point must expose both `--accessibility` and `--output-format <text|json>` under the headless profile.

For `dsh --profile headless --accessibility "task"`:

- stderr starts with exactly one `dsh: task started` line and ends with exactly one durable terminal-state line;
- provider reasoning deltas are suppressed;
- final assistant text is written to stdout;
- output contains no terminal escape sequence, BEL, backspace, carriage-return redraw, C0/C1 control other than line feed or tab, color, spinner, cursor movement, or updating counter;
- error diagnostics are sanitized and collapsed to one terminal-state line; and
- the process exits `0` only when the durable turn completed.

For `dsh --profile headless --output-format json "task"`:

- stdout contains exactly one newline-terminated JSON object after the owned session is flushed, while stderr contains no outcome diagnostics;
- `type` is `dsh-headless-result`, `schemaVersion` is `1.0.0`, and the object contains `status`, `text`, and `reason`;
- `status` is `completed` only for a durable completed turn and `failed` otherwise;
- `reason` projects completed, structured error, aborted cause, blocked, max-token, interrupted, missing-turn, and merge-extensible terminal reasons; and
- JSON is the sole presentation when both flags are supplied.

A missing task or unsupported output format must fail before a model request. Default text output remains a compatibility mode with reasoning streaming and is outside this accessibility claim.

## Automated process check

From this repository, run:

```console
pnpm run lab:cli -- ../deepseek-harness-alpha17 automated
```

The launcher first refuses tracked, staged, or untracked changes in either the DSH or accessibility-lab checkout. It then verifies the exact DSH package version, builds the local product, injects one disposable product-entry E2E test into the DSH checkout, runs it, and removes it. The result records the full DSH and lab Git revisions and checks help discovery, fail-closed argument handling, successful accessible text and JSON, and failed accessible text and JSON.

The emitted `automated-process-output-not-at-evidence` record proves only the inspected stdout, stderr, exit status, and request boundary. It cannot observe speech, braille, terminal cursor behavior, comprehension, or independent task completion.

Run this check locally before a release candidate and in CI when the CLI output implementation, launcher, or protocol changes. It does not need to run on every unrelated commit.

## Manual terminal and screen-reader lab

Run:

```console
pnpm run lab:cli -- ../deepseek-harness-alpha17 manual
```

The launcher builds the same local DSH revision, creates a disposable DSH home, and starts local synthetic model servers. It uses no real API key or personal workspace. Two commands run with inherited terminal I/O. The backticked names are stable evidence-catalog task IDs:

1. `completed-response` — expect one start line, `Accessible CLI response complete.`, and one completed line;
2. `authentication-failure` — expect one start line and one failure line, then exit status `1`.

Operate the terminal with the assistive technology under test. Confirm that token fragments do not flood the speech queue, cursor redraw does not repeat content, output order is understandable, the answer and terminal state are distinguishable, review commands can revisit the result, interruption remains discoverable, and the user can determine whether the task succeeded without sighted assistance.

Launching the lab or seeing its terminal text is not an AT pass. A human must observe and record the actual speech or braille output and task result.

## Required evidence record

Create one de-identified record per environment and scenario with:

- protocol ID, DSH version and Git revision, plus the accessibility-lab version and revision;
- operating system, terminal and version, shell, and whether a PTY or redirected stream was used;
- assistive technology and version, speech language, verbosity, punctuation, braille display and table when applicable;
- stable catalog task ID, expected result, actual speech or braille in order, cursor or review-mode behavior, task completion, and pass/fail;
- workarounds, defects with severity, and observer;
- whether the tester was an assistive-technology specialist or a disabled developer completing the task independently.

Disabled-user studies, recordings, quotations, compensation, consent, de-identification, storage, and withdrawal follow [RESEARCH.md](RESEARCH.md). Never upload credentials, private prompts, raw participant data, or unredacted paths to CI artifacts or public issues.

## Release matrix

The minimum candidate matrix is:

| Platform | Terminal | Assistive technology | Evidence required |
| --- | --- | --- | --- |
| macOS | Terminal and iTerm2 | VoiceOver | speech order, review navigation, success and failure |
| Windows 11 | Windows Terminal / PowerShell | NVDA | speech order, review navigation, success and failure |
| Windows 11 | Windows Terminal / PowerShell | JAWS | speech order, review navigation, success and failure |
| Windows 11 | Windows Terminal / PowerShell | Narrator | compatibility signal; not a replacement for NVDA or JAWS |
| Linux | GNOME Terminal or a documented equivalent | Orca | speech order, flat review, success and failure |
| At least one supported platform | tester's terminal | refreshable braille | line boundaries, status distinction, review navigation |

Automated conformance is recorded per candidate revision. Human AT rows are repeated for releases that alter terminal output, dependencies that affect terminal behavior, or the documented platform matrix. At least one disabled developer must independently complete representative core CLI tasks before an `a11y-user-validated` claim.

## Current limitations

- This is a draft protocol for a one-shot, non-interactive headless command, not the full DSH Web or future TUI experience.
- The automated check sees process streams, not the terminal accessibility API or a screen reader's speech and braille presentation.
- Separate stdout and stderr redirection does not preserve a combined cross-stream display order; JSON exists for machine consumers that require one stream.
- Default text mode remains intentionally verbose and is not covered by the accessibility candidate.
- No release may be called fully screen-reader adapted until the named AT matrix and disabled-user task evidence are complete and publicly scoped.
