# DSH 0.1.3-alpha.2 migration status

English | [简体中文](COMPATIBILITY-0.1.3-alpha.2.zh.md)

Checked on 2026-09-07. Status: **development probe only; core integration and publication blocked**. The manifest's `0.1.1-alpha.0` is an unpublished development identifier, not a new support claim. `private: true` prevents npm publication, and the companion lab preflight rejects this held build even when the core's version string matches.

## Verified upstream state

- The [official npm metadata](https://registry.npmjs.org/@deepseek-ai%2fdsh) advertises `alpha: 0.1.3-alpha.2`; `latest` and `next` remain `0.1.2-rc.1`.
- The alpha package was published at `2026-09-07T13:11:36.213Z`. Its [version manifest](https://registry.npmjs.org/@deepseek-ai%2fdsh/0.1.3-alpha.2) contains neither `gitHead` nor a provenance attestation identifying the source commit. Its registry signature is not a source-revision mapping.
- The CLI tarball has SHA-1 `4f421920af35f1f9526eb0af2279bec36c304d3e` and integrity `sha512-rmf4xgzU9+abvaQ//slyBBhADtPu8fv+SZjxmh4GJwJMZipVa7hNU5m23HgVcB3LNmuGltuQ7jyypuhJ5yU69A==`.
- Public GitHub heads and tags resolve the newest source to [`dsh-v0.1.3-alpha.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.3-alpha.1), commit `d347e703908d0406b7a7ef80e3a0e594d86b2215`. An alpha.2 tag fetch fails; branches, matching refs, package-version commit history, and release queries do not identify the alpha.2 source. This is an observation at the check time, not a claim that no such source exists privately.

Do not substitute the alpha.1 source or rename an rc1 accessibility report to alpha.2.

## Prepared and checked locally

Local environment: macOS, Node `24.3.0`, pnpm `11.7.0`. These results are not a cross-OS CI result.

- All direct DSH development dependencies and client peers target exactly `0.1.3-alpha.2`. A regenerated lockfile contains 225 DSH packages, all at that version. The prior incremental install silently kept 23 incompatible rc1 peer packages; a clean dependency resolution removed them without peer overrides or disabling trust checks.
- `pnpm peers check`: no peer dependency issues.
- `pnpm run typecheck` and the companion build: pass against the published alpha package interfaces.
- `pnpm test`: 28 files, 229 tests pass, including the full-graph version guard and baseline/publication-hold rejection tests. The upstream `dsh-client-ui-primitives` artifact references an absent `index.js.map`; Vite emits a non-fatal warning. This has not been hidden or treated as an accessibility result.
- The only client-code change is an explicit development warning. The removed runtime type import in one test now points to `dsh-client-ui-conversation`.
- `npm pack --dry-run --ignore-scripts --json` after the build: 126 files; the baseline guard and bilingual migration status are included. This only checks package contents; no npm publication was attempted.

These are package/interface and isolated component checks. They do not demonstrate assembled alpha DSH behavior, core accessibility, spoken output, braille, or independent task completion.

## Remaining gates

1. Identify a public, exact alpha.2 source revision with a trustworthy relationship to the npm release.
2. Port the rc1 core patches to that revision and review upstream changes, including attachments, history/session format, live updates, permissions, and focus/keyboard behavior.
3. Port the companion browser/AT templates from their current rc1 implementation; replace the CI core ref with an exact reviewed accessibility commit/tag. Remove the explicit development hold only as part of that reviewed transition. The assembled CI job currently **must fail preflight**, before building rc1; a skipped or rc1-only job is not an alpha pass.
4. Run focused core checks, all three browser engines, the external-plugin assembled scenario, disposable AT-lab smoke checks, and package-content verification. Archive fresh reports with exact clean revisions.
5. Review release metadata and the npm prerelease channel before publishing. This branch does not create a tag or release, move npm dist-tags, or replace beta.8.
6. Collect consented VoiceOver/NVDA and disabled-developer evidence separately. The current human ledger remains empty; no previous results or missing rows are promoted by this migration.

## Recheck and reproduce

Run the following from this companion checkout. The two local install commands use the reviewed lockfile; do not widen the exact recent-release exceptions in `pnpm-workspace.yaml`.

```sh
npm view @deepseek-ai/dsh dist-tags --json
npm view @deepseek-ai/dsh@0.1.3-alpha.2 gitHead dist.attestations --json
git ls-remote https://github.com/deepseek-ai/deepseek-harness.git 'refs/heads/*' 'refs/tags/*0.1.3*'
pnpm install --frozen-lockfile --ignore-scripts
pnpm install --frozen-lockfile
pnpm peers check
pnpm run typecheck
pnpm test
pnpm run build
```

For daily use, keep the released [`0.1.0-beta.8`](https://github.com/omdsh-dev/dsh-accessibility/releases/tag/v0.1.0-beta.8) companion with [`dsh-v0.1.2-rc.1-a11y.5`](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.5). Even that candidate is not a claim of complete screen-reader support.
