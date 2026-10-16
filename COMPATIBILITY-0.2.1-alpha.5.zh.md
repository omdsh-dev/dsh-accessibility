# DSH 0.2.1-alpha.5 迁移

[English](COMPATIBILITY-0.2.1-alpha.5.md) | 简体中文

状态：**依赖／API 迁移候选保持阻断，不是兼容的无障碍发行版**。包版本为 `0.1.4-alpha.1`，private 且未发布。不要把它安装成已发布 beta 或已合并 rc.2 开发基线的替代品。

## 精确目标和已完成改动

2026-10-17（上海时区）核验 npm：`latest`／`next` 仍为 `0.2.0-rc.2`，`alpha` 为 `0.2.1-alpha.5`。官方源码为 tag `dsh-v0.2.1-alpha.5`，提交 `1517a4dbca0a2789ff1d41ba439600f8547d23fa`。

- 所有 DSH 开发及 peer 依赖均精确固定为 `0.2.1-alpha.5`。
- Cordis 为 `4.0.5-alpha.2`（peer 为 `~4.0.5-alpha.2`），group 插件为 `1.0.5-alpha.2`。最初选择的 group `1.0.5-alpha.1` 未通过 peer 校验，已替换。
- 新的主兼容声明 `engines.dsh` 与精确目标一致。实验室预检拒绝冲突或畸形声明、rc.2 核心，也会在版本相同时继续拒绝这个 private 候选。
- 显式加入独立发布的 `dsh-client-store` 开发及 peer 类型依赖。缺少它时，新版 npm Slot 选择器退化成 `any`，组件严格构建失败。没有加入强制转换、隐式 any 豁免或宽松编译选项。
- 依赖发布年龄例外按包名合并为一个精确版本 union。pnpm 11.7 使用第一个匹配包名的条目；把新版追加在旧条目之后曾导致 260 项策略违规。合并保留精确允许版本，没有通配符，也未关闭发布年龄或生命周期策略；重复条目和通配符均有负向对照。
- 历史 schema、归档、六个内容创作包的目标及真人活动提交均未改写。

## 验证与剩余验收

在 macOS arm64、Node 24.3.0、pnpm 11.7.0 的 alpha.5 依赖图上，正常安装／prepare 构建、host/client 严格类型、31 文件全部 302 项单元测试（含两项 CI 提前预检对照）、peer 校验及最终生产构建均已在本地通过。官方 npm bundle 缺少 sourcemap 文件的警告仍是警告，不是测试失败。这只是本地候选检查，不是组装核心或辅助技术验收。

在迁移后的补丁核心建立前，当前 CI 刻意保留最后验证的 rc.2 核心固定提交 `bc345ae4124f35560276b3666130d7e6dd6ee19a`。新增的提前预检应在安装／构建前失败，不能拿旧核心冒充 alpha.5 组装通过。原生 Windows 任务仍验证这个精确 rc.2 基础，不代表 alpha.5。整合门禁阻断期间，不能把草稿按“完成”合并或发布。

剩余工程工作：

1. 将无障碍核心移植至官方 alpha.5 源码。一次未提交的试合并遇到组件、文档、测试和快照共 104 个冲突，已完整撤回；没有整批选择任一侧，工作目录没有残留冲突标记。
2. 移植时保留并测试变化后的 Conversation／Slot API、会话授权、草稿持久化、图片 factory 和模型控件名称。插件类型通过不等于这些核心流程通过。
3. 将 CI 固定到精确迁移核心，评审阻断条件，重新生成组装浏览器、CLI、核心全套、原生 Windows 和已安装 tarball 证据。此前 macOS 省略可选依赖的安装失败仍未解决，没有豁免。
4. 迁移五个依赖 DSH 的内容创作包，重跑精确版本安装、回放、真实 agent 和浏览器检查。独立 testkit 和不可改写的历史证据分别保留。
5. 获取真实 VoiceOver／NVDA 及残障开发者任务观察。真人记录仍为零，26 项要求未满足；自动化测试不能填充这些记录。

[rc.2 记录](COMPATIBILITY-0.2.0-rc.2.zh.md)及已合并的[核心 #7](https://github.com/omdsh-dev/deepseek-harness/pull/7)／[插件 #31](https://github.com/omdsh-dev/dsh-accessibility/pull/31)保持独立。其最终 CI 有九个成功任务，包括 32 项原生 Windows ACL 测试；alpha.5 不继承这些通过结果。

## 复现本地候选检查

```sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run check:peers
pnpm test
pnpm run build
```

运行 `node scripts/verify-assembled-baseline.mjs <rc2-core> .` 必须拒绝版本不匹配；即使核心 manifest 为精确 alpha.5，也必须继续被 private 整合阻断拒绝。不要为了得到绿灯，在未完成匹配核心验收时移除阻断。
