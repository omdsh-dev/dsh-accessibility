# 自动化证据归档

[English](README.md) | 简体中文

本目录归档经过评审、固定到精确 revision 的机器证据。它与只保留经过同意和去标识真人记录的 [`evidence/`](../evidence/README.md) 有意分离。

`core-browser/` 保存由 [`CORE-BROWSER-EVIDENCE.schema.json`](../CORE-BROWSER-EVIDENCE.schema.json) 和仓库测试套件校验的 `dsh-core-browser-non-at` 记录。`pass` 只证明精确 DSH revision 与环境中已登记的无头浏览器检查，不属于辅助技术、真实缩放、Windows 高对比度、WCAG 符合性或残障用户证据。

`authoring-agent/` 保存 `dsh-a11y-authoring-agent-lab` 记录。历史 DSH alpha.2 记录使用 [`AUTHORING-AGENT-LAB.schema.json`](../AUTHORING-AGENT-LAB.schema.json)，当前 DSH `0.2.0-rc.2` 记录使用独立的 [`AUTHORING-AGENT-LAB-0.2.0.schema.json`](../AUTHORING-AGENT-LAB-0.2.0.schema.json)；两者均保持 `0.1.2-draft` 证据协议。每份记录将六个全新 tarball 组装的真实产品回放固定到精确 DSH、组合及实验室 revision，并检查两次持久化扫描中的十一项未解决作者复核计划；均不属于模型推理、辅助技术、残障作者或 WCAG 符合性证据。当前记录绑定核心 `19ea4ee861`、实验室 `e0161fca0e` 和未发布 alpha.1 组合，不代表这些包已公开发布。

另保留核心 `1d321f2053`／实验室 `d2c2e2f753` 的独立创作闭环记录；该轮用字节不变的短名称 tarball 副本解决 pnpm 长缓存文件名安装失败。它与上一轮分别绑定各自源码，不改变未发布或非 AT 证据边界。

归档同时保留首份经过评审的 `33eb2d9e1e` 记录、为首轮活动精确候选另行重新生成的 `5803bfcfdd` 记录、为初版 DSH `0.1.2-rc.1` 无障碍移植独立生成的 `21859d968c` 报告，以及队列快照可移植性修复后的 `1e7f105934` 报告。DSH `0.2.0-rc.2` 候选有独立重新生成的 `ecef752eb2`、`7042120c03`、`1001be8032`、`19ea4ee861` 和 `1d321f2053` 报告，每份均记录 40 项通过、2 项浏览器能力跳过，不改变首轮真人活动的版本或证据边界；后续提交不会自动继承任何结果。

不得通过编辑生成记录来使它通过。应从干净的精确源码 commit 重新生成，评审局限，逐字节复制，并在失败或部分记录能够说明障碍时保留它们。
