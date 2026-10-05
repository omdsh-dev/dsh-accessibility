# DSH accessibility authoring agent lab

[简体中文](AUTHORING-AGENT-LAB.zh.md) | English

Protocol: `dsh-a11y-authoring-agent-lab/0.1.2-draft`. Machine-readable contract: [AUTHORING-AGENT-LAB-0.2.0.schema.json](AUTHORING-AGENT-LAB-0.2.0.schema.json).

This disposable lab verifies one bounded DSH authoring task: inspect a rendered local preview, read its source, repair a missing image alternative and empty button name through DSH's existing filesystem tools, and audit the repaired page. It exercises the installed product composition instead of importing its adapter directly.

## What one passing run proves

A passing replay run proves all of the following for the exact revisions in its output:

- the real DSH `0.2.0-rc.2` product entry and plugin manager load a freshly packed `@oh-my-dsh/dsh-a11y-local-preview@0.1.0-alpha.1` tarball whose complete six-package internal graph also resolves from fresh tarballs;
- a real literal-loopback HTTP page is audited in a fresh real Chromium context;
- the real DSH agent loop executes exactly `a11y_check → read → edit → a11y_check`;
- every durable tool call has one matching successful result, both audits remain scoped to `main` and the approved opaque handle, and filesystem access remains limited to `index.html`;
- both persisted audit results carry the exact untrusted-data security boundary and keep an injection-like provider subject inside one JSON-quoted `Subject data` record rather than exposing it as an instruction or new transcript record;
- both model-visible audit results append the complete `dsh-a11y-author-review-plan/0.1.0-draft`, retain all eleven rows as `unresolved`, and make no conformance claim or automated substitution for direct human evidence;
- the initial page has exactly the intended `button-name` and `image-alt` failures, the final source is the exact bounded repair rather than deletion or unrelated rewriting, and the final automated report has zero findings;
- the final `dsh-headless-result/1.0.0` record reports completion; and
- the public evidence object contains versions, revisions, aggregate findings and limitations, but no temporary directory, DSH home, workspace path or loopback origin.

The runner always removes its temporary workspace and DSH home. It never uses the tester's normal browser profile or DSH state.

## Evidence levels

| Mode or activity | What it adds | What it does not prove |
| --- | --- | --- |
| `replay` | Real product, plugin, browser, provider, tool, filesystem-policy and persistence integration driven by a fixed keyless model transcript | Model reasoning, model reliability, AT output, disabled-author independence, WCAG conformance |
| `live` | The same product loop driven by a live DeepSeek model, subject to the exact bounded trace and repair gates | General model reliability, AT usability, disabled-author independence, WCAG conformance |
| Human AT task | A named AT/browser/language combination can expose and operate the complete report-and-repair flow | Other AT/platform combinations or independent disabled-user success |
| Disabled-author study | A disabled developer can complete the representative task independently, effectively and safely under the research protocol | Universal accessibility or certification |

Never promote a replay result into model evidence, or either automated mode into assistive-technology or disabled-user evidence. A clean automated audit covers only the pinned rules and rendered state.

## Run it

Prerequisites:

- Node.js and pnpm versions accepted by the repositories;
- local checkouts of DSH `0.2.0-rc.2` and `dsh-a11y-local-preview@0.1.0-alpha.1` with their dependencies installed;
- the Playwright Chromium binary required by the local-preview package; and
- npm access when the replay plugin is not already cached.

From this repository, with the three checkouts as siblings:

```sh
pnpm run lab:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview replay
```

Replay mode is keyless. The runner builds DSH host libraries and the composition, creates a disposable page and DSH home, freshly packs the exact six-package authoring graph, installs it through the real `dsh plugin` command with profile-local tarball overrides, runs the task, validates the durable session, emits one JSON evidence object, and cleans up.

Before creating any disposable state, the runner requires clean DSH, composition, and accessibility-lab Git worktrees and records all three full revisions. Tracked, staged, or untracked changes make both replay and live modes fail closed.

For a live-model run, place `DEEPSEEK_API_KEY` in the process environment through the operator's normal secret-management mechanism, then run:

```sh
pnpm run lab:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview live
```

Do not use real product data or a normal authenticated preview in live mode. The task, tool descriptions, page findings and tool results may be sent to the configured model provider. The runner refuses live mode without the key, removes the key from build and plugin-install subprocesses, supplies it only to the final DSH agent process, and never prints or stores it in evidence.

## Security and privacy boundary

The preview binds to an ephemeral literal `127.0.0.1` port and contains only synthetic data. The composition rejects query strings, fragments, credentials, DNS hostnames and remote origins before mounting. The provider permits only bounded read-oriented requests to the approved origin and blocks cross-origin requests, unsafe methods, WebSockets, downloads, service workers and ambient authentication headers. DSH runs in `workspace-write` mode inside the disposable directory, while the trace gate rejects `bash`, `write`, any unapproved tool, any other file, failed tool results, extra steps and changed audit scope. The configured subject intentionally contains an instruction-like phrase; the evidence gate reads both real persisted `a11y_check` results and fails unless the phrase occurs exactly once in each result, inside the expected JSON-quoted data record accompanied by the authority warning. The same gate also fails if any of the eleven manual review rows disappears, loses its direct-evidence requirement, or is promoted from `unresolved` by automation.

Raw session logs are private diagnostic material: they contain the task, tool arguments, selectors and temporary paths. The runner reads them locally only to enforce the trace and deletes them at completion. Share only the final bounded JSON after reviewing it under [RESEARCH.md](RESEARCH.md).

## Real assistive-technology validation still required

The next evidence tier must use the complete interactive DSH surface, not this headless replay alone. The versioned [authoring AT lab](AUTHORING-AT-LAB.md) now supplies the disposable Web task, real approval interaction, allow/reject safety rows, and exact human record format. At minimum, retain separate VoiceOver/Safari and NVDA/Chrome or Edge results under that protocol. Disabled-author evidence remains a separate gate even after those AT rows pass.

## Known limitations

- The fixture covers two common deterministic barriers in one small static page; it does not represent an application, dynamic state, authentication or cross-origin content.
- Exact-source validation is intentionally strict and may reject a semantically equivalent live-model edit; this is a conformance fixture, not a general repair benchmark.
- Alternative-text quality is known by fixture construction here. Real content still requires author judgment.
- Chromium and axe-core results do not expose platform accessibility APIs or screen-reader speech/braille.
- The local-preview composition and its dependencies have public-alpha package metadata but no active remote repositories or npm releases; this lab is pre-release evidence only.

## Historical evidence and current candidate

Historical `0.1.2-alpha.2` evidence and its original schema are preserved; they do not prove this candidate passes. Current launchers require DSH `0.2.0-rc.2`, local-preview `0.1.0-alpha.1`, and lab `0.1.3-rc.1`, rejecting old combinations. Publication metadata is not authorization to create public repositories or npm packages; publication must satisfy current visibility authorization and all release gates.
