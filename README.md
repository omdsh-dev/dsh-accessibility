# @oh-my-dsh/dsh-accessibility

English | [简体中文](README.zh.md)

An optional DeepSeek Harness companion for screen-reader guidance, semantic diagnostics, and an experimental user-loaded conversation reading view. It intentionally uses DSH slots and structured projections; it does not patch or observe hashed DOM classes.

This repository is also the public project hub of the [DSH Accessibility Working Group](https://github.com/omdsh-dev/community/blob/main/working-groups/accessibility.md). Its mission is to enable disabled developers to complete DSH's core tasks independently, effectively, and safely; help every developer produce more accessible digital content with DSH; and validate both goals with versioned standards, real assistive technology, and evidence from disabled users.

Project links: [Accessibility statement](ACCESSIBILITY_STATEMENT.md) · [Roadmap](ROADMAP.md) · [Governance](GOVERNANCE.md) · [Community validation](COMMUNITY-VALIDATION.md) · [Primary AT campaign](PRIMARY-AT-CAMPAIGN.md) · [Research protocol](RESEARCH.md) · [Human evidence ledger](HUMAN-EVIDENCE.md) · [Evidence task catalog](EVIDENCE-CATALOG.json) · [Aggregate coverage policy](EVIDENCE-COVERAGE.md) · [Redacted diagnostic protocol](DIAGNOSTIC-REPORT.md) · [Accessible View RFC](RFC-ACCESSIBLE-VIEW.md) · [Browser evidence RFC](RFC-BROWSER-EVIDENCE.md) · [Authoring/testkit RFC](RFC-A11Y-AUTHORING.md) · [Authoring agent lab](AUTHORING-AGENT-LAB.md) · [Authoring AT lab](AUTHORING-AT-LAB.md) · [CLI accessibility protocol](CLI-ACCESSIBILITY.md) · [Core AT lab](AT-CORE-LAB.md) · [Live-announcement AT lab](AT-LIVE-LAB.md) · [Companion AT lab](AT-LAB.md) · [Contributing](CONTRIBUTING.md)

## Compatibility

`0.1.0-beta.7` targets exactly `@deepseek-ai/dsh@0.1.2-rc.1` plus accessibility core candidate [`dsh-v0.1.2-rc.1-a11y.2`](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.2). The companion was migrated from the removed `dsh-client-runtime` package to rc1's `ui-session` and `ui-chat` projections, and its DSH peers are deliberately exact. `0.1.0-beta.6` remains the maintenance build for DSH `0.1.1-rc.2`. The companion reports missing core semantics; it cannot safely replace focus traps, composite-widget keyboard behavior, landmarks, or live-region policy from outside the owning components.

## Install from npm

```sh
dsh plugin --profile web add @oh-my-dsh/dsh-accessibility@0.1.0-beta.7
dsh --profile web
```

The npm companion does not patch the owning DSH components. Until the changes are included in an official DSH release, use the organization-pinned [DSH accessibility build](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.2) for the complete candidate behavior:

```sh
git clone https://github.com/omdsh-dev/deepseek-harness.git
cd deepseek-harness
git checkout dsh-v0.1.2-rc.1-a11y.2
pnpm install
pnpm run build:official
pnpm dsh plugin --profile web add @oh-my-dsh/dsh-accessibility@0.1.0-beta.7
pnpm dsh web
```

## Install from a checkout

```sh
pnpm install
pnpm run build
dsh plugin --profile web add file:.
dsh --profile web
```

Open Settings → Accessibility to run the current-page diagnostic and read the VoiceOver/NVDA/JAWS quick guide.

## Accessible View candidate

`0.1.0-beta.7` registers the experimental Accessible View through DSH's official `conversation.view` slot. It remains a beta feature and is not a stable-support claim.

Selecting the tab alone does not retain conversation content. Activate **Load reading view** to admit DSH's structured session snapshot. The view then presents finalized and in-progress records in source order, preserves semantic Markdown and code, offers explicit disclosures for context, reasoning, tool arguments/output, command input, and errors, and supports per-message copy plus older-history loading. **Clear reading view and return** unmounts the content and restores focus to Load.

This MVP remains read-oriented. Return to Chat to send, stop, approve, edit queued work, or use specialized tool controls. See [RFC-ACCESSIBLE-VIEW.md](RFC-ACCESSIBLE-VIEW.md) for the data-flow, threat review, exact limitations, and VoiceOver/NVDA validation procedure.

The assembled gate runs the candidate in Chromium, Firefox, and WebKit at 640 and 320 CSS px, samples focused controls against occluding content, audits reduced-motion behavior, and checks Chromium forced-color participation. The current rc1 core report binds fourteen required checks and nine cataloged P0 Web tasks to exact clean revision `33546ce7d896625c313ad3ee0371047bcf8b8ade`; earlier alpha.2 reports remain archived for their exact historical revisions and the first human campaign remains pinned to its original alpha.2 candidate. These are versioned deterministic results, not real zoom, Windows High Contrast, assistive-technology, or disabled-user evidence. See the [`automated-evidence/`](automated-evidence/README.md) archive and [RFC-BROWSER-EVIDENCE.md](RFC-BROWSER-EVIDENCE.md).

## Diagnostics and scope

The page audit now runs 17 structural checks covering landmarks, the application heading, control names, image alternatives, list ownership, nested interactive controls, ARIA references, composer and log names, menus, listboxes, trees, radio groups, tab lists, dialogs, and adjustable separators. Every failed check has contextual inspection and repair guidance, and a detached one-defect practice produces the same stable `1/17` result for repeatable human evaluation without reading or changing the current page. An explicit, ephemeral focus tracker reports the latest external focus target's approximate name, role, Tab position, and exposed state without displaying or retaining classes, IDs, selectors, URLs, or HTML. The versioned [redacted diagnostic protocol](DIAGNOSTIC-REPORT.md) requires a separately activated preview and copy, and projects only check IDs, outcomes, and counts; focus names, practice results, and DOM-derived content are excluded.

A passing result means that the mounted DOM satisfies these deterministic contracts. It is evidence, not a claim of complete conformance: it cannot prove spoken output, browser/accessibility-API mappings, focus timing, or Windows screen-reader behavior. Those still require the manual VoiceOver/NVDA/JAWS scenarios in the in-app guide.

See [ACCESSIBILITY.md](ACCESSIBILITY.md) for the assistive-technology matrix, manual regression protocol, and support boundary.

Consented human results use the versioned [human evidence ledger](HUMAN-EVIDENCE.md). Stable tasks and authoritative core, safety, and claim classifications come from the [evidence task catalog](EVIDENCE-CATALOG.json), not from the submitter. The validator preserves failed and partial observations while preventing stale, private, operationally assisted, unsafe, ineligible, unknown, or incomplete records from claiming `a11y-at-tested` or `a11y-user-validated`. The separate [aggregate coverage policy](EVIDENCE-COVERAGE.md) prevents incompatible exact environments from being combined and reports all missing primary and extended AT, CLI, companion, authoring, and disabled-developer rows. The ledger currently contains only a non-evidence template, so all twenty-six aggregate requirements are missing.

The first [primary AT campaign](PRIMARY-AT-CAMPAIGN.md) is `open` for VoiceOver/Safari, NVDA/Chrome, and disabled-developer core-task submissions against pinned core and lab revisions. Its five public-availability gates pass anonymously, while the human-evidence ledger correctly remains empty until consented results are submitted and reviewed.

## CLI accessibility candidate

The rc1 accessibility core candidate retains the explicit low-noise headless presentation and versioned final JSON result first developed on alpha.2. This repository owns the draft `dsh-cli-accessibility/1.0.0-draft` conformance protocol; its archived alpha.2 replay does not automatically transfer to rc1. Automated process output is not screen-reader evidence, and the manual launcher still requires a human speech or braille record. See [CLI-ACCESSIBILITY.md](CLI-ACCESSIBILITY.md).

## Accessible authoring candidate

The draft [authoring/testkit RFC](RFC-A11Y-AUTHORING.md) separates a pure versioned evidence engine, a development-only browser testkit, two independently reviewed page providers, an opt-in model-visible `a11y_check` adapter, and separately permissioned product compositions. Six standalone local packages now cover both provider chains. `dsh-a11y-local-preview/0.1.0-draft` is a default-inert installable DSH bundle for disposable literal-loopback previews; `dsh-a11y-caller-page/0.1.0-draft` is a non-serializable trusted-host composition for exact pages whose lifecycle remains caller-owned. The latter adds no tab discovery, navigation, URL/authentication read, screenshot, HTML serialization, or browser-close authority and is policy-limited to disposable, non-authenticated synthetic pages. Real Chromium, real loopback HTTP, published DSH `SystemPrompt`/`ToolRuntime`, lifecycle disposal, privacy, package-content, and—where applicable—bundle installation and config-dump tests pass locally. The versioned [authoring agent lab](AUTHORING-AGENT-LAB.md) proves one keyless real-product agent-loop task with the exact `a11y_check → read → edit → a11y_check` trace, a two-to-zero automated finding change, and persisted untrusted-data framing. The separate [authoring AT lab](AUTHORING-AT-LAB.md) makes that flow operable through the real DSH Web and approval UI, with automated allow-once and rejection safety gates plus a consented human VoiceOver/NVDA record format. Automated browser and Host results remain explicitly non-AT evidence. The [package-readiness policy](AUTHORING-PACKAGE-READINESS.md) now pins the six-package graph and reports publication blockers without confusing installability with conformance. All six manifests are prepared for public scoped alpha packages, but their remote repositories and npm releases are not yet active; review, live-model repair, listener-verified AT, and disabled-author gates remain open, and a clean automated report is never represented as WCAG conformance.

The adapter additionally frames and JSON-quotes every page/provider-derived report string as untrusted data; embedded commands never become instructions or a reason to expand tools, file access, network access, or approval authority.

Every model-visible result also appends `dsh-a11y-author-review-plan/0.1.0-draft`: eleven stable manual rows spanning contextual alternatives, semantics and reading order, keyboard/focus, asynchronous status and errors, low vision, motion and timing, media, alternative input, language and cognition, and real AT/disabled-author tasks. The adapter can only emit `claim: none`, `status: unresolved`, and unresolved outcomes; direct human evidence must be recorded in a separate reviewed workflow.

## Checks

```sh
pnpm run evidence:validate
pnpm run typecheck
pnpm test
pnpm run build
pnpm pack --pack-destination ./artifacts
```

## Model Experience

The runtime companion in this branch adds no model-visible tools, prompts, messages, or context. The separately permissioned authoring packages are not bundled into the companion.

## Security and privacy

Diagnostics inspect only the current document's semantic attributes in memory and never read conversation text. Accessible View reads the current structured conversation only after an explicit load action; sensitive technical sections require separate disclosure, and copying is a per-message system-clipboard action. Neither feature makes network requests, emits telemetry, or persists its own results or conversation copy.
