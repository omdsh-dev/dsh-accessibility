# DSH 0.1.7-alpha.1 compatibility work

English | [简体中文](COMPATIBILITY-0.1.7-alpha.1.zh.md)

Status: local automated candidate checks pass; **this candidate is not published and real assistive-technology validation is pending**. Checked 2026-09-22.

## Local companion checks

The candidate `0.1.2-alpha.1` pins every DSH dependency to `0.1.7-alpha.1`. Host/client type checks, the build, and 234 tests across 28 files passed locally. The tests include the complete locked DSH graph, input-owned queue counts, explicit content loading, independent simultaneous reading-view occurrences, unique IDs, focus restoration, and exact-target lab guards. These are component tests, not real screen-reader observations.

The core migration is committed as `b11b37b065` on `feat/a11y-core-0.1.7-alpha.1`. The external-plugin assembled suite passed five tests, including Chromium/Firefox/WebKit environment checks, against that core commit. The final core GUI suite passed 7,396 tests with one skip; documentation checks passed all 42 gates. Core accessibility browser checks passed 14 tests in Chromium and 13 each in Firefox/WebKit, with one unsupported forced-colors check skipped per latter engine. The complete read-only Web replay passed 486 tests with 15 conditional skips across 143 files (142 passed, one skipped). The corpus checks pass with historical generations retained and shared sources advanced to their owners' selected generations. npm packaging dry-run passes. Companion/core lab startup and cleanup, plus all six live-lab scenario startups, pass in headless smoke mode; no person operated assistive technology. Publication and real VoiceOver/NVDA/user observations remain pending. Initial failed runs remain separate from the final passing results; they were not relabeled as passes.

## Exact upstream target

The newest GitHub preview is [dsh-v0.1.7-alpha.1](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.7-alpha.1), published at 2026-09-22 06:16:27 UTC. Its source revision is `c36a83ff6bb95e3f82cf79f9be7c724270a8aa61`. This supersedes 0.1.6-alpha.2 as the preview migration target; it does not retroactively change any recorded evidence.

During the check, the official npm registry changed from `alpha=0.1.6-alpha.2` to `alpha=0.1.7-alpha.1`. The final observed tags are `latest=0.1.5-rc.2`, `next=0.1.5-rc.3`, and `alpha=0.1.7-alpha.1`. GitHub publication and npm distribution must be checked separately. Recheck the complete dependency graph before installing, pinning dependencies, or publishing.

The in-progress 0.1.5-rc.2 core and companion migration is retained separately. Its passing tests do not establish compatibility with 0.1.7, and the existing beta.8/human-campaign evidence remains bound to its original versions.

## Migration and acceptance work

- **Session V4:** adapt isolated lab fixtures using supported successor generations. Preserve historical logs and evidence; check loading older history, cancelled responses, attachments, and copy output.
- **Conversation projections and multiple occurrences:** verify the Accessible View against current slot owners, node sources, added `turnDataSource`, and record-field changes. Prove correct session binding, teardown, explicit content loading, and focus restoration with more than one conversation mounted.
- **Settings and plugin lifecycle:** upstream replaced settings persistence and added configuration forms. The companion currently uses the additive settings section, not the retired persistence service; verify that integration rather than adding unnecessary migration shims. Test installation, failed installation, disabling, unloading, re-enabling, and localization.
- **Core semantic patches:** re-port into the current owning components. Recheck landmarks, input names, focus order, dialogs, composite widgets, adjustable panes, and durable live announcements against the reorganized process groups and conversation shell.
- **New task surfaces:** cover stop-and-archive confirmation, undo/unarchive, pinning/filtering, background-job output, file actions, side-by-side review, spreadsheet navigation, zoom controls, and the experimental transcription control. Scope each support claim to actual tested tasks.
- **Changed host APIs:** inspect any authoring/provider usage of old workspace read and Remote APIs before extending their compatibility claims. Keep permissions, consent, and privacy boundaries unchanged.
- **Release evidence:** require the complete exact npm dependency graph, type/unit/build/package checks, clean-revision assembled Chromium/Firefox/WebKit results, and explicit unresolved real-AT/user rows before any preview publication. Publish a separate alpha candidate only after its automated gates pass; do not promote it to stable or reuse 0.1.5 results.

Real VoiceOver/NVDA and disabled-developer observations remain pending. This work record is a migration plan, not accessibility evidence or certification.
