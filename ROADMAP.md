# Accessibility roadmap

[简体中文](ROADMAP.zh.md) | English

Updated: 2026-09-07. This roadmap is evidence-driven and may change after upstream compatibility or assistive-technology findings. An item is complete only when its acceptance evidence is linked; implementation alone is not completion.

## Current baseline

- Runtime companion release candidate: `@oh-my-dsh/dsh-accessibility@0.1.0-beta.7`.
- Tested DSH baseline: `@deepseek-ai/dsh@0.1.2-rc.1` plus `dsh-v0.1.2-rc.1-a11y.2`.
- Historical maintenance line: companion beta.6 plus DSH `0.1.1-rc.2`; the first human campaign remains pinned to its exact `0.1.2-alpha.2` core and lab revisions.
- Deterministic companion audit: 17 structural checks.
- Developer feedback loop candidate: each failed diagnostic has localized repair guidance; a detached one-defect practice creates a stable human-evaluation target; an explicit ephemeral focus tracker exposes approximate name/role/state without selectors; and `dsh-accessibility-diagnostic/1.0.0-draft` requires separate review and copy actions for a strict no-claim report. Three new companion tasks are pinned in evidence catalog revision `dsh-accessibility-core-tasks-2026-08-31-r2`. Automated privacy, schema, UI, and axe evidence pass locally; real AT comprehension and disabled-developer usefulness remain pending.
- Accessible View MVP: migrated to rc1's `ui-session` and `ui-chat` contracts; unit, build, privacy, axe, and assembled Chromium evidence pass, while exact clean three-engine companion evidence, real AT, and disabled-developer evidence remain release tasks.
- Hermetic AT labs: the companion launcher targets the rc1 candidate; the first-wave core launcher remains pinned to its historical alpha.2 campaign. Both reduce setup/privacy risk but produce no AT evidence without human observation.
- Core browser evidence: clean rc1 revision `33546ce7d896625c313ad3ee0371047bcf8b8ade` has a schema-validated `dsh-core-browser-non-at` `pass` across Chromium, Firefox, and WebKit. Fourteen required checks cover all nine cataloged static P0 Web tasks plus menu and safety routes; this is automated non-AT evidence, while live states, real zoom/High Contrast, AT, and disabled-user rows remain pending. The alpha.2 campaign report remains separately archived and does not transfer.
- Live-announcement lab: six synthetic alpha.2 replay scenarios separate durable Host boundaries from actual AT speech/braille evidence.
- CLI accessibility candidate: low-noise text and `dsh-headless-result/1.0.0` output are implemented on the alpha.2 branch; draft process conformance is reproducible, while real terminal/screen-reader and disabled-developer evidence remain pending.
- Accessible authoring foundation: the bilingual RFC and six standalone local packages now cover both provider chains. The literal-loopback path has an installable, default-inert `dsh-a11y-local-preview/0.1.0-draft` DSH composition; the caller-owned path has a non-serializable, separately permissioned `dsh-a11y-caller-page/0.1.0-draft` trusted-host composition for disposable non-authenticated pages. Real product bundle installation and config composition where applicable, published DSH runtime loading, Chromium auditing, privacy, lifecycle, and package evidence pass locally. The `dsh-a11y-authoring-agent-lab/0.1.2-draft` replay gate proves one exact audit/read/edit/re-audit product loop, validates the untrusted-data framing in both persisted audit results, and requires their eleven-row manual author-review plans to remain unresolved. The new `dsh-a11y-authoring-at-lab/0.1.0-draft` makes the same bounded task available through real DSH Web, proves allow-once changes automated findings from two to zero, proves rejection leaves source unchanged, and defines separate human VoiceOver/NVDA records. Both automated modes are product evidence, not AT or disabled-author evidence. Review/publication, any authenticated/cross-origin authority, live-model repair, listener-verified real AT, and disabled-author evidence remain pending.
- Human evidence ledger: `dsh-a11y-human-evidence/0.1.0-draft` now defines a public JSON Schema, privacy/freshness/claim validator, non-evidence template, and local/CI gate. Its pinned `dsh-a11y-evidence-catalog/0.1.0-draft` revision registers 33 stable tasks across five protocols and owns core, safety, and claim classification. The new `dsh-a11y-evidence-coverage-policy/0.1.0-draft` evaluates six profiles and twenty-six cataloged human-evidence requirements without mixing incompatible exact environments or anonymous disabled-developer records. Its matrix includes primary and extended screen readers, braille, voice and switch input, magnification, CLI, companion, authoring, and disabled-developer validation. A bilingual community guide and dedicated disabled-developer intake now cover contributors who may not use a named AT while requiring consent, a private withdrawal route, exact tasks, assistance, effectiveness, and safety. A fail-closed scaffold command derives non-claim drafts from the catalog without ingesting participant text or overwriting files. The system preserves failures and partial results while failing closed on stale, private, operationally assisted, unsafe, ineffective, unknown, ineligible, or incomplete support claims. No real run is in the ledger and all twenty-six aggregate requirements are missing, so this proves governance readiness rather than AT or disabled-user support.
- Listener-verified Windows and Linux screen-reader results remain pending; complete VoiceOver spoken-output records remain pending.
- Primary human campaign: `dsh-a11y-primary-at-campaign/0.1.0-draft` is `open` against core revision `5803bfcfdd502adac26ae9b8eec12d6aed263ec6` and lab revision `6aed71615edd1db1ec5b12897e1ad40b79294c78` for VoiceOver/Safari, NVDA/Chrome, and disabled-developer core tasks. The isolated Chrome smoke and all five anonymous public-availability gates pass; the human-evidence ledger remains empty pending consented submissions and review.

## Phase 0 — foundation and upstream compatibility (through 2026-09-12)

- Port the core candidate to `0.1.2-rc.1`, auditing overlapping upstream changes instead of mechanically replaying the old patch. **Implemented; automated and CI evidence must remain green.**
- Freeze and document the rc.2 maintenance line, and migrate beta.7 to the exact rc1 client graph. **Implemented.**
- Align npm installation guidance and distribution tags so unqualified installs cannot silently receive an older beta. **Pending npm publication and dist-tag verification.**
- Keep the completed static P0 Web route expansion green, extend the versioned browser contract to applicable live and authoring routes, and make failures block the candidate release; retain real zoom, Windows High Contrast, and low-vision checks as separately owned manual rows.
- Publish the working-group charter, project governance, accessibility statement, research protocol, issue forms, evidence labels, machine-checkable human-evidence review and aggregate-coverage lifecycle, and release gates.

## Phase 1 — companion and developer feedback loop (through 2026-10-10)

- Complete review of the Accessible View MVP built through the additive `conversation.view` slot and DSH conversation projection; require privacy review, assembled-browser evidence, listener-verified VoiceOver/NVDA, and disabled-developer task evidence before treating the item as complete.
- Review the implemented contextual repair help, ephemeral focus/name/role/state inspector, and strict redacted-report exporter; require listener-verified AT comprehension, privacy review, and disabled-developer usefulness evidence before treating the feedback loop as complete.
- Review the bilingual authoring RFC and the six reusable standalone implementations (`dsh-a11y-testkit`, `dsh-a11y-page-provider`, `dsh-a11y-loopback-provider`, `dsh-a11y-authoring`, `dsh-a11y-local-preview`, and `dsh-a11y-caller-page`); create remote repositories only after each protocol, privacy boundary, fixture set, and package is ready for public review.
- Use the versioned hermetic AT labs, including the authoring approval/repair protocol, to make exact VoiceOver/NVDA and disabled-developer task runs reproducible without exposing testers' normal DSH state.
- Run every response/tool/request terminal scenario through the live-announcement lab; retain failed, repeated, coalesced, and silent results by exact AT/browser/language row.
- Complete one listener-verified VoiceOver round and one Windows NVDA round with exact versions, language, spoken output, focus results, and sanitized evidence.

## Phase 2 — assistive-technology matrix and authoring (through 2026-11-21)

- Validate JAWS, Narrator, Orca, keyboard-only, Windows forced colors, browser zoom/reflow, and at least one braille-display workflow.
- Prototype external AT automation by reusing W3C ARIA-AT drivers where possible; keep manual task completion as a release gate.
- Validate the DSH CLI accessibility candidate across VoiceOver, NVDA, JAWS, Narrator, and Orca terminals; retain the automated `dsh-cli-accessibility/1.0.0-draft` process result separately from human speech/braille and independent-task evidence.
- Review and publish the installable literal-loopback `a11y_check` composition, review the implemented separately permissioned caller-owned-page host composition, and complete live-model repair tasks using the existing versioned replay baseline; retain cancellation, cleanup, network-containment where applicable, privacy, and exact-package evidence while keeping both paths read-only, preserving repair choice, and never implying automated certification.
- Keep the versioned eleven-row author review plan model-visible and fail closed if automation removes a row, weakens its direct-evidence requirement, or promotes an unobserved outcome; complete the rows only through separately reviewed human and assistive-technology evidence.

## Release gates

A stable companion release requires:

- a tested DSH compatibility range and installation path;
- green type, unit, build, package, assembled-browser, and deterministic accessibility gates;
- current VoiceOver and NVDA task evidence, with JAWS/Orca limitations stated if not yet covered;
- a same-environment aggregate coverage report with every applicable release-policy requirement satisfied; the report remains supporting evidence rather than the release decision;
- a published accessibility statement and known-limitations matrix;
- no default-product defect represented as fixed only by an overlay or diagnostic;
- privacy review for every feature that reads conversation or workspace content.

Do not use “fully accessible” or “certified” as a release claim. Use versioned evidence levels defined in [GOVERNANCE.md](GOVERNANCE.md).

## Program measures

- P0 task pass rate by exact AT/browser combination.
- Age and completeness of every support-matrix row.
- Accessibility regressions escaping a release and time to remediate P0 defects.
- Percentage of new or changed UI covered by keyboard and semantic tests.
- Disabled-user research rounds and task outcomes, not participant identities.
- Compatibility lag between an upstream DSH release candidate and a reviewed accessibility candidate.

Issue count, axe score, download count, or a single tester's result are not success measures by themselves.
