# Accessibility statement

[简体中文](ACCESSIBILITY_STATEMENT.zh.md) | English

Last reviewed: 2026-09-07.

The DSH Accessibility Working Group wants disabled developers to complete DSH's core tasks independently, effectively, and safely, and wants DSH to help every developer produce more accessible digital content.

## Scope and target

This statement covers the `@oh-my-dsh/dsh-accessibility` companion and the organization-maintained DSH accessibility candidate identified in [ACCESSIBILITY.md](ACCESSIBILITY.md). The web target is WCAG 2.2 Level AA, with WAI-ARIA Authoring Practices used for interactive patterns. Because DSH is also an authoring agent, the program uses ATAG 2.0 Part A and Part B as product-design guidance. These targets do not constitute a conformance claim.

## Current support

- The companion provides screen-reader guidance, 17 deterministic checks for mounted HTML and ARIA structure, contextual repair guidance, an explicit ephemeral focus inspector, and a user-copied strict redacted report candidate.
- The rc1 accessibility candidate includes landmarks, named dialogs, focus containment and return, composite-widget keyboard patterns, conversation/log semantics, status announcements, and keyboard-adjustable separators.
- Production-browser, component, build, and cross-platform automation evidence is available for the versioned candidate.
- macOS Safari and Chrome accessibility-tree and keyboard routes have been exercised with VoiceOver enabled.

## Known limitations

- Listener-verified complete spoken-output records are still pending for VoiceOver.
- Physical Windows NVDA, JAWS, and Narrator results and Linux Orca results are still pending.
- The current companion cannot repair missing core focus, keyboard, or announcement behavior and does not directly observe the operating system accessibility API or exact screen-reader speech.
- The tested core and beta.7 companion candidates are based on DSH `0.1.2-rc.1`; later DSH versions still require a fresh compatibility audit.
- Forced-colors, 200%/400% reflow, braille display, speech recognition, switch access, and broader cognitive and low-vision scenarios are not yet complete.
- The authoring/testkit packages and complete approval/repair lab remain development candidates; live-model, real-AT, disabled-author, review, and publication evidence are still pending.
- The versioned human-evidence ledger currently contains only a non-evidence template. Its task catalog prevents submitters from self-classifying arbitrary work as core or claim-eligible, and its coverage policy prevents incompatible exact environments from being combined, but it does not yet support an `a11y-at-tested` or `a11y-user-validated` claim. All twenty-six aggregate requirements remain missing.
- Passing automated checks is not a statement that every disabled person can use every workflow.
- The focus inspector is a conservative DOM approximation rather than platform accessibility-API or actual screen-reader output; its accessible-name snapshot can contain page content and is never included in the redacted report.

The exact support matrix and manual scenarios are maintained in [ACCESSIBILITY.md](ACCESSIBILITY.md). Consented public human results use [HUMAN-EVIDENCE.md](HUMAN-EVIDENCE.md), its authoritative [evidence task catalog](EVIDENCE-CATALOG.json), and the [aggregate coverage policy](EVIDENCE-COVERAGE.md). The forward plan and release gates are in [ROADMAP.md](ROADMAP.md).

## Feedback

Report an accessibility barrier with the repository's Accessibility barrier form. Include exact versions and a sanitized task description; never include credentials, private prompts, conversation contents, usernames, or sensitive paths. Assistive-technology users may submit a structured test result with the AT test form.

Use private vulnerability reporting for security or privacy problems. Conduct incidents follow the [`omdsh-dev/community` Code of Conduct](https://github.com/omdsh-dev/community/blob/main/CODE_OF_CONDUCT.md) and must not be reported publicly.
