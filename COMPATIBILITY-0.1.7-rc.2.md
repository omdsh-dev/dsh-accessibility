# DSH 0.1.7-rc.2 compatibility

English | [简体中文](COMPATIBILITY-0.1.7-rc.2.zh.md)

Status: local migration checks complete; unpublished and awaiting review/CI. Real VoiceOver/NVDA and disabled-developer validation remain pending.

## Exact targets

The official npm registry reports `latest=0.1.7-rc.2` and `next=0.2.0-rc.1`, rechecked on 2026-09-29 (Asia/Shanghai). This branch targets `0.1.7-rc.2`; the preview requires a separate result and is not covered by this branch's exact peer dependencies.

- Primary upstream: `dsh-v0.1.7-rc.2`, commit `477b4f420553e8a52c2fbccc464d7561b239c443`.
- Separate preview: `dsh-v0.2.0-rc.1`, commit `4878cdabd87d4041bdaff61d04c966883b9fd07a`.
- Companion candidate: `0.1.2-rc.1`, with exact DSH `0.1.7-rc.2` dependencies.

The [alpha.1 record](COMPATIBILITY-0.1.7-alpha.1.md), existing tags, automated reports, and human campaign remain bound to their original revisions. Passing historical results are not evidence for this migration.

## Local migration checks

On 2026-09-28, the unpublished working tree passed these checks against the official npm `0.1.7-rc.2` packages:

- Exact DSH dependency graph and one Cordis runtime (`4.0.4`); the companion peer range is `~4.0.4`, matching the upstream client packages. The development graph explicitly supplies `cordis-plugin-group@1.0.4` for the upstream boot package. `pnpm run check:peers` reports no peer dependency issues, and CI runs this check.
- Host/client type checks and all 236 tests in 28 files.
- Build and npm package dry run; the candidate contained 128 files. A pattern scan of those files found no credential-shaped strings, private-key headers, or local user-directory paths. This is not a comprehensive security audit.
- Local tarball installation through the real DSH CLI into a disposable `DSH_HOME`, followed by a boot-free Web profile configuration dump. The companion was composed successfully with no version exemptions. No model request or user-profile migration was performed by this isolated smoke test.
- Evidence schema validation. The real human-evidence ledger remains empty.

Vite reported missing source maps in upstream npm packages during unit tests; the tests themselves passed. The package checks alone do not establish migrated-core or assembled compatibility; the separate checks below cover that integration.

## Core integration checks

The core merge is committed as `1e53eedb532a7965aee4d4c294c2ee313cf15906`, based on the exact upstream rc.2 commit above. The following local checks covered that implementation:

- Build, all 18 hygiene gates, all 20 quick documentation gates, and all 42 full documentation synchronization gates passed. The final full lint found only one overlong function declaration; a formatting-only wrap and the owning-file lint cleared it.
- The core accessibility browser lane passed 40 checks across Chromium, Firefox, and WebKit. Two forced-colors checks were explicitly skipped outside Chromium; these are automated browser checks, not assistive-technology observations.
- All 17 headless expected-output tests passed after the configured-agent fixtures explicitly waited for Session persistence. The built CLI help/usage and keyless headless smoke cases also passed.
- The steering replay passed all seven tests after merging the upstream accessible-name changes into the ARIA goldens. Turn-tail presentation passed nine tests with one record-only skip after correcting the Compact-mode selector. Those Session recordings were not refreshed. Separately, the goal-action fixture owner refreshed the current v4 header's `startsSeries: true` field and passed replay; no older Session generation was rewritten.
- Settings and desktop-locale checks passed all 16 tests after updating the upstream labels and default choices while retaining contextual accessible names and focus assertions.
- On 2026-09-29 (Asia/Shanghai), the companion/core assembled lane passed all five tests across Chromium, Firefox, and WebKit with clean core `1e53eedb532a7965aee4d4c294c2ee313cf15906` and companion `20b3b151858d9b9e6cb986501c00faf6960eb1b6`. The browser records identify both revisions. This paragraph and later documentation-only updates were not part of that tested companion revision.
- On the same clean revisions, the core AT lab (`none 1000`), companion AT lab (`none 500`), and live-announcement lab (`complete none 500`) each passed startup and cleanup. These smoke runs did not launch a screen reader or exercise human tasks; the live lab smoke did not consume a replay.
- The final full GUI run passed all 590 files: 9,274 tests passed and one was explicitly skipped. An earlier aggregate run had a Markdown-registration timeout; the final run passed without concurrent heavy jobs, retries, or timeout changes. The earlier failure is not counted as a pass, and its cause is not established.
- General Web replay was checked in partitions, not a single final all-green aggregate. The remaining 144-file run initially had 21 failing files; repairs were verified in their owning files, with the final three-file partition passing all 12 tests. Reviewed changes cover upstream labels/defaults, keyboard/focus behavior, independent Fetch links, tooltip capture scope, and ARIA goldens. No blanket golden update or timeout relaxation was used.

The companion CI pins the exact rc.2 core commit above, rather than a moving branch or historical tag. User-perceivable core UI changes require designer or product review before merge. The candidate remains unpublished.

## Separate preview investigation

An isolated, private temporary copy of the companion also passed installation, build, peer checks, host/client type checks, and all 236 tests against npm `0.2.0-rc.1` on 2026-09-28. Only the copy's DSH dependency pins, generated lockfile, release-age entries, and exact-version assertions were retargeted; the production component source was unchanged. The same Cordis and group versions were used. No candidate from that copy was published.

This is a preliminary package/API result, not a migrated-core, assembled-browser, or assistive-technology result. The real branch still requires exact `0.1.7-rc.2` and rejects a `0.2.0-rc.1` core at the assembled-lab preflight. Do not install it into the preview using a version exemption or reinterpret the old human campaign as preview evidence.

## Acceptance

The candidate requires a migrated core, the complete exact dependency graph, host/client type checks, component regressions, build/package checks, and assembled Chromium/Firefox/WebKit results. Keyboard navigation, modal focus, explicit reading-view admission and clearing, pending input, permission decisions, and live announcements must retain their prior guarantees.

Neither automated browser results nor successful lab startup establish spoken output, real accessibility-API mappings, or independent task completion by disabled developers. Human evidence remains empty until consented observations are submitted and reviewed. npm publication is not part of the migration checks.
