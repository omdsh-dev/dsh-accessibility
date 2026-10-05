# DSH 0.2.0-rc.2 compatibility

English | [简体中文](COMPATIBILITY-0.2.0-rc.2.zh.md)

Status: migration and verification in progress; unpublished. Real VoiceOver/NVDA and disabled-developer task evidence remain pending.

## Exact targets

The npm registry and official source were checked on 2026-10-05 (Asia/Shanghai): `latest` and `next` point to `0.2.0-rc.2`; `alpha` points to `0.2.1-alpha.1`. This candidate targets only `0.2.0-rc.2`.

- Official source: `dsh-v0.2.0-rc.2`, commit `639ed015397290b3745d163aafe02ffee4aa3f84`.
- Core branch: `feat/a11y-core-0.2.0-rc.2`.
- Companion branch: `feat/compat-0.2.0-rc.2`, version `0.1.3-rc.1`.
- Every DSH development and peer dependency is pinned exactly to `0.2.0-rc.2`. Cordis remains `~4.0.4`, with development runtime `4.0.4` and group plugin `1.0.4`.

Historical [0.1.7-rc.2 results](COMPATIBILITY-0.1.7-rc.2.md), published npm `0.1.0-beta.8`, automated archives, and the first human campaign retain their original version and revision boundaries. No historical pass transfers to this candidate.

## Verification record

Completed local package checks on 2026-10-05:

- Frozen-lockfile installation, peer checks, host/client type checks, and build passed.
- All 240 companion tests in 28 files passed, including exact CLI/browser launcher baseline and clean-source provenance regressions. Evidence validation and npm dry-run packaging also passed.
- Core host/client type checks and the full build passed. The full GUI suite passed 9,593 tests, with one skipped; the subsequent primitive suite passed 1,374 tests and reached 100% coverage on all four metrics for the shared modal-layer source.
- The core Chromium/Firefox/WebKit accessibility lane passed 40 checks; two forced-colors checks were skipped because Firefox/WebKit do not expose that emulation. These are browser contracts, not AT passes or actual browser-zoom/Windows-high-contrast evidence.
- All 43 documentation gates, 18 hygiene gates, and full lint passed. Assembled companion/browser, CLI, and packed-install gates remain in progress.
- The full Web replay attempt timed out in the Office preview conversion case on macOS. The converter and its browser case are unchanged from the official target; the remaining Web cases are being checked separately. The complete Web gate is not recorded as passing while this failure remains unresolved.

Regressions found and repaired include a tooltip description ID mismatch, model-menu focus loss after rerender, duplicate running-status live announcements, and a narrow-viewport sidebar hit area briefly covering focused controls. Follow-up checks also cover the large-catalog popup type and textual diff totals in accessible disclosure names.

The CLI launcher now shares the exact baseline preflight with the browser labs. It rejects old releases and the separate alpha preview before creating disposable state. Successful lab startup is not evidence of speech, braille, accessibility-API mappings, or independent task completion.

## Acceptance and remaining evidence

Acceptance requires the migrated core, exact dependency graph, host/client checks, component regressions, build and package checks, and assembled Chromium/Firefox/WebKit results at clean exact revisions. Keyboard navigation, modal focus, explicit reading-view admission and clearing, permission decisions, question input, pending states, and live announcements must retain their guarantees.

User-perceivable core UI changes require designer or product review before merge. The human evidence ledger stays empty until consented observations are submitted and reviewed. Real VoiceOver/NVDA and disabled-developer tasks must be completed before any full screen-reader adaptation claim. This record does not authorize or claim npm publication.
