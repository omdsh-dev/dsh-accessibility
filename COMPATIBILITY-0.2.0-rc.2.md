# DSH 0.2.0-rc.2 compatibility

English | [简体中文](COMPATIBILITY-0.2.0-rc.2.zh.md)

Status: migration and verification in progress; unpublished. Real VoiceOver/NVDA and disabled-developer task evidence remain pending.

## Exact targets

The npm registry and official source were checked on 2026-10-05 (Asia/Shanghai): `latest` and `next` point to `0.2.0-rc.2`; `alpha` points to `0.2.1-alpha.1`. This candidate targets only `0.2.0-rc.2`.

- Official source: `dsh-v0.2.0-rc.2`, commit `639ed015397290b3745d163aafe02ffee4aa3f84`.
- Core branch: `feat/a11y-core-0.2.0-rc.2`, candidate commit `7042120c039a874499ce8754de7975b4ef05cb41`. The earlier `ecef752eb2` browser record remains tied to that earlier commit.
- Companion branch: `feat/compat-0.2.0-rc.2`, version `0.1.3-rc.1`.
- Every DSH development and peer dependency is pinned exactly to `0.2.0-rc.2`. Cordis remains `~4.0.4`, with development runtime `4.0.4` and group plugin `1.0.4`.

Historical [0.1.7-rc.2 results](COMPATIBILITY-0.1.7-rc.2.md), published npm `0.1.0-beta.8`, automated archives, and the first human campaign retain their original version and revision boundaries. No historical pass transfers to this candidate.

## Verification record

Completed local package checks on 2026-10-05:

- Frozen-lockfile installation, peer checks, host/client type checks, and build passed.
- All 246 companion tests in 28 files passed, including exact CLI/browser launcher baseline, clean-source provenance regressions, and both independently archived rc.2 browser records. Evidence validation and npm dry-run packaging also passed.
- The real companion npm tarball installed in a disposable consumer with the exact peer graph. Its host entry exported the expected plugin name and apply function. The installed client also passed the assembled browser lane: five checks covering the Chromium reading view/diagnostics and Chromium/Firefox/WebKit environment contracts. The input tarball SHA-256 was `8aba0aa55d72c96747fbe7a3641e91b9c0e44084670629fb4db59474398611a2`; the local artifact-only Git snapshot was `7e628f293cdf1527e5c3becfd2aea252466d127d`, not a companion source revision. These results do not validate a published npm release; later documentation/archive changes are not part of that tarball.
- Core host/client type checks and the full build passed. The full GUI suite passed 9,593 tests, with one skipped; the subsequent primitive suite passed 1,374 tests and reached 100% coverage on all four metrics for the shared modal-layer source.
- The core Chromium/Firefox/WebKit accessibility lane was independently regenerated on clean `7042120c03`: 40 checks passed; two forced-colors checks were skipped because Firefox/WebKit do not expose that emulation. The generated JSON is archived byte-for-byte alongside the earlier `ecef752eb2` record. These are browser contracts, not AT passes or actual browser-zoom/Windows-high-contrast evidence.
- All 43 documentation gates, 18 hygiene gates, and full lint passed. Five Web replay files covering steering, turn-tail actions, live interactions, settings chrome, and chat scrolling passed 50 tests, with two real-model cases skipped. Assembled companion/browser checks passed on core `7042120c03` and companion `ea1010a61b`. All six CLI conformance scenarios passed on those exact revisions, covering help discovery, invalid-format rejection, accessible/JSON completion, and accessible/JSON failure. Core packed-install gates remain in progress.
- The owner-contract lane passed 505 tests in 29 files, with four capability skips. Prompt-tail tests now supply actual output and explicitly exercise an unknown/child foreground; two negative cases retain the official known-shell safety rule, rather than weakening it to accept silence as completion.
- The full Web replay attempt and an isolated repeat timed out in the Office preview conversion case on macOS. The converter and its browser case are unchanged from the official target. A separate Node consumer using the same synthetic DOCX and `@deepseek-ai/libreoffice-kit@0.1.1`, without DSH or a browser, also remained pending beyond its configured 60-second conversion deadline. The installed library entry matches the official npm tarball byte-for-byte (SHA-256 `50546669367c6c19f47c0cea54d0a9cadf3e5f7b8b9619d61fa425987a9e726f`). Both stalled attempts were interrupted; neither counts as passing. This narrows the investigation to the native conversion/font/runtime path, but does not establish the exact cause. The complete Web gate remains unpassed.

Regressions found and repaired include a tooltip description ID mismatch, model-menu focus loss after rerender, duplicate running-status live announcements, and a narrow-viewport sidebar hit area briefly covering focused controls. Follow-up checks also cover the large-catalog popup type and textual diff totals in accessible disclosure names.

The CLI launcher now shares the exact baseline preflight with the browser labs. It rejects old releases and the separate alpha preview before creating disposable state. Successful lab startup is not evidence of speech, braille, accessibility-API mappings, or independent task completion.

The core VoiceOver lab reached readiness on core `7042120c03` and companion `ea1010a61b`, using macOS 26.3 (25D125) and isolated Chrome 154.0.8037.95. Native UI automation could not select that disposable Chrome instance; application selection resolved to the existing personal Chrome instead. No input was sent to that window, VoiceOver 10 remained off, and the lab was stopped with normal cleanup. This is a UI-targeting blocker, not an AT operation or pass. Actual speech/braille and all human core/live-task rows remain untested.

## Acceptance and remaining evidence

Acceptance requires the migrated core, exact dependency graph, host/client checks, component regressions, build and package checks, and assembled Chromium/Firefox/WebKit results at clean exact revisions. Keyboard navigation, modal focus, explicit reading-view admission and clearing, permission decisions, question input, pending states, and live announcements must retain their guarantees.

User-perceivable core UI changes require designer or product review before merge. The human evidence ledger stays empty until consented observations are submitted and reviewed. Real VoiceOver/NVDA and disabled-developer tasks must be completed before any full screen-reader adaptation claim. This record does not authorize or claim npm publication.
