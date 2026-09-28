# DSH 0.1.7-rc.2 compatibility

English | [简体中文](COMPATIBILITY-0.1.7-rc.2.zh.md)

Status: migration in progress, unpublished. Real VoiceOver/NVDA and disabled-developer validation remain pending.

## Exact targets

The official npm registry reports `latest=0.1.7-rc.2` and `next=0.2.0-rc.1` on 2026-09-28. This branch targets `0.1.7-rc.2`; the preview requires a separate result and is not covered by this branch's exact peer dependencies.

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

Vite reported missing source maps in upstream npm packages during unit tests; the tests themselves passed. These checks do not yet establish migrated-core or three-browser assembled compatibility. The exact clean revisions and final browser results must be recorded after those checks complete.

## Separate preview investigation

An isolated, private temporary copy of the companion also passed installation, build, peer checks, host/client type checks, and all 236 tests against npm `0.2.0-rc.1` on 2026-09-28. Only the copy's DSH dependency pins, generated lockfile, release-age entries, and exact-version assertions were retargeted; the production component source was unchanged. The same Cordis and group versions were used. No candidate from that copy was published.

This is a preliminary package/API result, not a migrated-core, assembled-browser, or assistive-technology result. The real branch still requires exact `0.1.7-rc.2` and rejects a `0.2.0-rc.1` core at the assembled-lab preflight. Do not install it into the preview using a version exemption or reinterpret the old human campaign as preview evidence.

## Acceptance

The candidate requires a migrated core, the complete exact dependency graph, host/client type checks, component regressions, build/package checks, and assembled Chromium/Firefox/WebKit results. Keyboard navigation, modal focus, explicit reading-view admission and clearing, pending input, permission decisions, and live announcements must retain their prior guarantees.

Neither automated browser results nor successful lab startup establish spoken output, real accessibility-API mappings, or independent task completion by disabled developers. Human evidence remains empty until consented observations are submitted and reviewed. npm publication is not part of the migration checks.
