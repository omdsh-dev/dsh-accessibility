# DSH 0.2.1-alpha.5 migration

English | [简体中文](COMPATIBILITY-0.2.1-alpha.5.zh.md)

Status: **held dependency/API candidate, not a compatible accessibility release**. Package `0.1.4-alpha.1` is private and unpublished. Do not install it as a replacement for the published beta or the merged rc.2 development baseline.

## Exact target and completed changes

The npm registry was checked on 2026-10-17 (Asia/Shanghai): `latest` / `next` remain `0.2.0-rc.2`; `alpha` is `0.2.1-alpha.5`. The official source is tag `dsh-v0.2.1-alpha.5`, commit `1517a4dbca0a2789ff1d41ba439600f8547d23fa`.

- Every DSH development/peer dependency targets exactly `0.2.1-alpha.5`.
- Cordis is `4.0.5-alpha.2` (peer `~4.0.5-alpha.2`), group plugin `1.0.5-alpha.2`. The initially selected group `1.0.5-alpha.1` failed peer validation and is not retained.
- The primary `engines.dsh` declaration matches the exact target. Lab preflight rejects conflicting or malformed declarations, rc.2 cores, and this private candidate even when the version string matches.
- The independently published `dsh-client-store` types are explicit development and peer dependencies. Without them, the new published Slot selector hooks became `any` and the strict component build failed. No casts, implicit-any suppression, or relaxed compiler options were added.
- Dependency-age exceptions use one exact-version union per package. pnpm 11.7 uses the first matching package entry; appending the new release after the old entry caused 260 policy violations. Consolidation preserves the exact allowed versions, without a wildcard or disabled age/lifecycle policy. Duplicate-entry and wildcard negative controls cover this regression.
- Historical schemas, archives, six authoring-package targets, and human campaign revisions are unchanged.

## Verification and remaining acceptance

On the alpha.5 dependency graph, the normal install/prepare build, host/client strict type checks, all 305 unit tests in 31 files (including both early-CI preflight controls and LF/CRLF policy controls), peer checks, and the final production build passed locally on macOS arm64 with Node 24.3.0 and pnpm 11.7.0. The original source-map-file warnings from official npm bundles remain warnings, not test failures. These are local candidate checks, not assembled-core or assistive-technology acceptance.

The first alpha.5 Windows Node 22 job failed in the newly added policy test because section extraction assumed LF checkout line endings. A local CRLF regression reproduced the failure before repair; extraction now normalizes line endings, with all six LF/CRLF positive and negative policy controls passing. No policy assertion, version bound, timeout, retry, or platform check was removed. The original failed CI remains a separate result, not an inferred native pass for the new revision.

The current CI intentionally keeps the last verified rc.2 core pin, `bc345ae4124f35560276b3666130d7e6dd6ee19a`, until a migrated patched core exists. Its new early preflight must fail before installation/build rather than report an alpha.5 assembled pass against that old core. The native Windows lane still verifies that exact rc.2 foundation, not alpha.5. This draft must not be merged as complete or published while the integration gate is blocked.

Remaining engineering work:

1. Port the accessibility core to the official alpha.5 source. A non-committed merge encountered 104 conflicts across components, documentation, tests, and snapshots; it was aborted cleanly. No side was accepted wholesale and no conflict markers remain in the working checkout.
2. Preserve and test the changed Conversation/Slot APIs, session authorization, draft persistence, image factories, and model-control labels while porting the accessibility changes. Passing companion type checks alone does not validate those core flows.
3. Pin CI to the exact migrated core, review the hold, and regenerate assembled browser, CLI, full-core, native Windows, and installed-tarball evidence. The prior macOS optional-dependency omission failure remains unresolved, not waived.
4. Migrate the five DSH-dependent authoring packages and repeat their exact-version install, replay, live-agent, and browser checks. The framework-independent testkit and immutable historical evidence remain separate.
5. Obtain genuine VoiceOver/NVDA and disabled-developer task observations. The ledger remains at zero human records and 26 unmet requirements; automated tests never fill those rows.

The [rc.2 record](COMPATIBILITY-0.2.0-rc.2.md) and merged [core #7](https://github.com/omdsh-dev/deepseek-harness/pull/7) / [companion #31](https://github.com/omdsh-dev/dsh-accessibility/pull/31) remain independent results. Their final CI had nine successful jobs, including 32 native Windows ACL tests; no pass is inherited by alpha.5.

## Reproduce local candidate checks

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run check:peers
pnpm test
pnpm run build
```

Running `node scripts/verify-assembled-baseline.mjs <rc2-core> .` must reject the version mismatch. An exact alpha.5 manifest must still be rejected by the private integration hold. Do not remove that hold to obtain a green run without completing the matching-core acceptance work.
