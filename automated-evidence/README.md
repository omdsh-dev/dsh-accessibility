# Automated evidence archive

[简体中文](README.zh.md) | English

This directory archives reviewed, exact-revision machine evidence. It is intentionally separate from [`evidence/`](../evidence/README.md), which is reserved for consented, de-identified human records.

`core-browser/` contains `dsh-core-browser-non-at` records validated by [`CORE-BROWSER-EVIDENCE.schema.json`](../CORE-BROWSER-EVIDENCE.schema.json) and the repository test suite. A `pass` proves only the recorded headless browser checks on the exact DSH revision and environment. It is not assistive-technology, real zoom, Windows High Contrast, WCAG conformance, or disabled-user evidence.

`authoring-agent/` contains `dsh-a11y-authoring-agent-lab` records validated by [`AUTHORING-AGENT-LAB.schema.json`](../AUTHORING-AGENT-LAB.schema.json). The first `0.1.2-draft` replay archive binds a six-fresh-tarball real DSH product loop to exact DSH, composition, and lab revisions; it also proves that both persisted scans retained the eleven-row unresolved author-review plan. It is not model-reasoning, assistive-technology, disabled-author, or WCAG conformance evidence.

The archive retains the first reviewed `33eb2d9e1e` record, the separately regenerated `5803bfcfdd` record for the exact primary-campaign candidate, and the independent `f298fa7105` report for the DSH `0.1.2-rc.1` accessibility port. Later commits do not inherit any result automatically.

Do not edit a generated record to make it pass. Regenerate it from clean exact source commits, review its limitations, copy it byte-for-byte, and keep prior failures or partial records when they explain a barrier.
