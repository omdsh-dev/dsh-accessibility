import { describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import {
  buildAuthoringPackageInstallReport,
  evaluateAuthoringPackageDependencyGraph
} from '../scripts/authoring-package-readiness-lib.mjs'
import { parseNpmPackOutput, pnpmTarballOverrides, stageTarballForPnpm } from '../scripts/authoring-package-install-lib.mjs'

const spec = {
  name: '@oh-my-dsh/dsh-a11y-composition',
  version: '0.1.0-alpha.0',
  internalDependencies: { '@oh-my-dsh/dsh-a11y-testkit': '0.1.0-alpha.0' }
}

describe('authoring package isolated install evidence', () => {
  it('allows a private prerelease source only when its packed dependency graph is registry-independent', () => {
    const manifest = {
      name: spec.name,
      version: spec.version,
      private: true,
      dependencies: { '@oh-my-dsh/dsh-a11y-testkit': '0.1.0-alpha.0' }
    }
    expect(evaluateAuthoringPackageDependencyGraph(manifest, spec)).toEqual([])
    manifest.dependencies['@oh-my-dsh/dsh-a11y-testkit'] = 'file:../dsh-a11y-testkit'
    expect(evaluateAuthoringPackageDependencyGraph(manifest, spec)).toEqual(expect.arrayContaining([
      'dependencies.@oh-my-dsh/dsh-a11y-testkit-must-be-0.1.0-alpha.0',
      'dependencies.@oh-my-dsh/dsh-a11y-testkit-must-not-use-local-protocol'
    ]))
  })

  it('labels isolated installation separately from npm and human evidence', () => {
    const packages = [{
      name: spec.name,
      version: spec.version,
      revision: 'a'.repeat(40),
      integrity: 'sha512-example',
      filename: 'example.tgz'
    }]
    const lab = { package: '@oh-my-dsh/dsh-accessibility', version: '0.1.0-beta.6', revision: 'b'.repeat(40) }
    const report = buildAuthoringPackageInstallReport(packages, lab, '2026-08-31T00:00:00.000Z')
    expect(report.result).toBe('pass')
    expect(report.evidence).toBe('automated-isolated-tarball-install-not-at-evidence')
    expect(report.lab).toEqual(lab)
    expect(report.limitations.join(' ')).toMatch(/not publication to or availability from npm/iu)
    expect(report.limitations.join(' ')).toMatch(/not WCAG conformance/iu)
  })

  it('writes pnpm 11 tarball overrides outside publishable manifests', () => {
    const yaml = pnpmTarballOverrides([{
      name: spec.name,
      tarballPath: "/tmp/author's package.tgz",
    }])
    expect(yaml).toContain('overrides:')
    expect(yaml).toContain("'@oh-my-dsh/dsh-a11y-composition'")
    expect(yaml).toContain("'file:/tmp/author''s package.tgz'")
  })

  it('uses short local install names without changing the packed bytes or npm metadata artifact', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-a11y-authoring-stage-'))
    const filename = 'oh-my-dsh-dsh-a11y-loopback-provider-0.1.0-alpha.1.tgz'
    const bytes = Buffer.from([0, 31, 139, 255, 10])
    try {
      await writeFile(join(root, filename), bytes, { flag: 'wx' })
      const staged = await stageTarballForPnpm(root, filename, 0)
      expect(basename(staged)).toBe('p0.tgz')
      expect(await readFile(staged)).toEqual(bytes)
      expect(await readFile(join(root, filename))).toEqual(bytes)
      expect(pnpmTarballOverrides([{ name: spec.name, tarballPath: staged }]))
        .toContain(`'file:${staged}'`)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('does not overwrite an already staged local artifact', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-a11y-authoring-stage-'))
    try {
      await writeFile(join(root, 'original.tgz'), 'new', { flag: 'wx' })
      await writeFile(join(root, 'p0.tgz'), 'existing', { flag: 'wx' })
      await expect(stageTarballForPnpm(root, 'original.tgz', 0)).rejects.toMatchObject({ code: 'EEXIST' })
      expect(await readFile(join(root, 'p0.tgz'), 'utf8')).toBe('existing')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('accepts an informational policy line before npm pack JSON but rejects ambiguous results', () => {
    const result = parseNpmPackOutput([
      '✓ Lockfile passes supply-chain policies',
      JSON.stringify([{ name: spec.name, version: spec.version, filename: 'package.tgz' }], null, 2),
    ].join('\n'))
    expect(result).toMatchObject({ name: spec.name, version: spec.version, filename: 'package.tgz' })
    expect(() => parseNpmPackOutput('not json')).toThrow('valid JSON result')
    expect(() => parseNpmPackOutput('[]')).toThrow('exactly one package result')
  })
})
