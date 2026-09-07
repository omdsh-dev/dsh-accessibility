# Non-AT browser evidence contract

[简体中文](RFC-BROWSER-EVIDENCE.zh.md) | English

Status: draft for public review

Protocol: `dsh-non-at-browser/1.0.0-draft`

Consumers: Accessible View and core P0 Web routes on DSH `0.1.2-rc.1` plus `dsh-v0.1.2-rc.1-a11y.2`; historical alpha.2 records remain exact-revision archives

Tracking: [#9](https://github.com/omdsh-dev/dsh-accessibility/issues/9)

## Decision

DSH accessibility releases need deterministic browser evidence beyond DOM names and roles. The development-only assembled runner therefore loads the real external companion through DSH's ModuleLoader and records reflow, focus visibility/obscuration, reduced-motion, and forced-color participation under an explicit versioned protocol.

Accessible View seeded the reusable contract. The core consumer now covers fourteen assertions across the named shell, static P0 task routes, menus, Settings, composer editing, and Full access risk admission. Its archived report maps all nine claim-eligible `dsh-core-at-lab/1.0.0-draft` P0 task IDs to stable checks. This still does **not** complete the whole-DSH gate: live response/tool/request transitions, error recovery, authoring output, real zoom and High Contrast, release blocking, assistive-technology output, and disabled-user completion remain separate evidence.

## Standards map

| Requirement | Versioned reference | Automated assertion | Evidence boundary |
| --- | --- | --- | --- |
| Reflow | WCAG 2.2 SC 1.4.10 (AA) | Run at 640 and 320 CSS px; require document `scrollWidth` to stay within `clientWidth` and reject programmatic page-level horizontal movement. | A 320 CSS px viewport is the specified 400% equivalent dimension. Real browser zoom, text scaling, and excepted two-dimensional content still need manual review. |
| Focus visible | WCAG 2.2 SC 2.4.7 (AA) | Require the focused control to match `:focus-visible` and expose a non-zero outline or box shadow. | Does not measure focus-indicator pixel area or contrast. |
| Focus not obscured | WCAG 2.2 SC 2.4.11 (AA) | Intersect the control with the viewport and require it to be topmost at one of nine sampled points after focus. | Proves the minimum sampled boundary, not complete pixel visibility or the enhanced AAA criterion. |
| Animation from interactions | WCAG 2.2 SC 2.3.3 (AAA) | Under `prefers-reduced-motion: reduce`, reject visible candidate descendants with motion-capable transitions, named CSS animations, or running keyframes that move/resize/reposition. | Paint-only opacity/color changes are not classified as motion; essential-animation exceptions require public review. |
| Forced colors | CSS Color Adjustment Level 1 | In Chromium forced-colors emulation, require the media query to match, reject visible candidate elements with `forced-color-adjust: none`, and record computed control colors/borders. | Browser emulation is not a real Windows High Contrast observation and is not a non-text-contrast certification. |

Normative and explanatory references:

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Understanding 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [Understanding 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [CSS Color Adjustment Module Level 1](https://www.w3.org/TR/css-color-adjust-1/)

## Runner and data flow

`scripts/run-assembled-browser.mjs` accepts an exact DSH checkout, a companion checkout, and a comma-separated browser list. It verifies package identities and versions, copies the test template and reusable assertion helper into DSH's Web test lane with exclusive creation, runs DSH's own Vitest/browser scaffold, and removes both temporary files even on failure.

The test uses a temporary DSH home and DSH's synthetic seeded-history fixture. It does not use the ambient DSH profile, credentials, workspace, prompts, or sessions. Passing runs create no screenshot or uploaded artifact. The runner accepts only `chromium`, `firefox`, and `webkit`; CI installs and executes all three. Forced-color emulation is currently Chromium-only because the cross-engine contract is not equivalent.

The core repository owns `pnpm run test:web:accessibility` for dirty-checkout diagnostics and `pnpm run test:web:accessibility:evidence` for release evidence. The latter rejects a dirty checkout, rebuilds the exact commit, runs all three engines, and emits one report validated by [`CORE-BROWSER-EVIDENCE.schema.json`](CORE-BROWSER-EVIDENCE.schema.json). Missing, duplicated, skipped, failed, or capability-inconsistent required assertions fail closed; a browser subset is `partial`, never `pass`.

## Evidence record

The Accessible View runner emits one JSON object per browser. The core runner aggregates the same protocol boundary into one report with a per-engine check list. Records contain:

- protocol and evidence kind;
- exact standard identifiers;
- DSH version and Git revision;
- the consumer identity and, where applicable, companion version and Git revision;
- OS, OS release, architecture, browser engine, and engine version;
- 640/320 CSS px overflow measurements;
- per-control focus state, sampled visibility, viewport intersection, outline, and shadow;
- reduced-motion transition/animation findings;
- forced-color media state, opt-out count, and computed control samples when supported;
- fixed limitations that prevent the record from being misread as AT or disabled-user evidence.

A record is valid only when every required test process exits zero, its schema and semantic inventory validate, and the tested commit matches the recorded revision. Logs from a dirty checkout are development diagnostics, not release evidence. The first reviewed core record is archived at [`automated-evidence/core-browser/2026-08-31-dsh-0.1.2-alpha.2-33eb2d9e1e.json`](automated-evidence/core-browser/2026-08-31-dsh-0.1.2-alpha.2-33eb2d9e1e.json). The exact primary-campaign candidate was regenerated independently at [`5803bfcfdd`](automated-evidence/core-browser/2026-08-31-dsh-0.1.2-alpha.2-5803bfcfdd.json). The rc1 port was independently regenerated at exact clean revision [`33546ce7d8`](automated-evidence/core-browser/2026-09-07-dsh-0.1.2-rc.1-33546ce7d8.json). None of these records may be carried across revisions or treated as interchangeable.

## False-positive and exception policy

- Do not add pixel tolerances above the current one-CSS-pixel rounding allowance without a reproducible engine defect.
- Do not exclude a selector, control, animation, or region only to make a failure green. An exception needs the exact standard rationale, owner, expiry/review date, synthetic reproduction, and a protocol minor-version change.
- Two-dimensional content exceptions under SC 1.4.10 must be local scrollers whose layout is essential; they must not give the page itself a second scroll direction.
- An essential motion exception must state what information or functionality is lost without movement and provide a user-controlled non-motion alternative when the standard requires it.
- Engine-specific absence of a capability is `not-run`, never `pass`.

## Manual and user evidence still required

Automated browser results do not prove real browser zoom, Windows High Contrast themes, macOS Increase Contrast, OS text scaling, magnifier use, low-vision task efficiency, switch/voice input, spoken output, braille output, or independent task completion. Release evidence must retain separate named rows for those environments and for consented disabled-user studies.

Before treating a DSH core route as covered, manually verify at minimum:

1. browser zoom at 200% and 400%, text-only zoom where supported, and loss of information/functionality;
2. Windows High Contrast themes and focus-indicator contrast;
3. the focused component and indicator against sticky, modal, toast, and non-modal layers;
4. OS Reduce Motion with the task's actual interactions;
5. keyboard-only task completion without pointer recovery.

## Release gate

Accessible View and the core consumer may carry `evidence:automated` only after all three engine jobs pass on an exact commit. The archived core record satisfies the static P0 route expansion milestone, but issue #9 stays open until live and authoring routes consume the contract where applicable, manual-only rows have current owners/results, and failures block the relevant release. This RFC never authorizes “fully accessible,” certification, AT-tested, or user-validated language.
