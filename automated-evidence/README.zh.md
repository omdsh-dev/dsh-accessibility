# 自动化证据归档

[English](README.md) | 简体中文

本目录归档经过评审、固定到精确 revision 的机器证据。它与只保留经过同意和去标识真人记录的 [`evidence/`](../evidence/README.md) 有意分离。

`core-browser/` 保存由 [`CORE-BROWSER-EVIDENCE.schema.json`](../CORE-BROWSER-EVIDENCE.schema.json) 和仓库测试套件校验的 `dsh-core-browser-non-at` 记录。`pass` 只证明精确 DSH revision 与环境中已登记的无头浏览器检查，不属于辅助技术、真实缩放、Windows 高对比度、WCAG 符合性或残障用户证据。

`authoring-agent/` 保存由 [`AUTHORING-AGENT-LAB.schema.json`](../AUTHORING-AGENT-LAB.schema.json) 校验的 `dsh-a11y-authoring-agent-lab` 记录。首份 `0.1.2-draft` replay 归档把由六个全新 tarball 组装的真实 DSH 产品循环固定到精确 DSH、产品组合与实验室 revision；它还证明两次持久化扫描都保留了十一项未解决作者复核计划。它不属于模型推理、辅助技术、残障作者或 WCAG 符合性证据。

归档同时保留首份经过评审的 `33eb2d9e1e` 记录、为首轮活动精确候选另行重新生成的 `5803bfcfdd` 记录，以及为 DSH `0.1.2-rc.1` 无障碍移植独立生成的 `33546ce7d8` 报告；后续提交不会自动继承任何结果。

不得通过编辑生成记录来使它通过。应从干净的精确源码 commit 重新生成，评审局限，逐字节复制，并在失败或部分记录能够说明障碍时保留它们。
