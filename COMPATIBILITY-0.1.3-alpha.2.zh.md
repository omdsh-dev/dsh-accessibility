# DSH 0.1.3-alpha.2 迁移状态

[English](COMPATIBILITY-0.1.3-alpha.2.md) | 简体中文

核验日期：2026-09-07。当前仅完成开发预检，核心整体验证与发布仍受阻。本分支的 `0.1.1-alpha.0` 是未发布的开发编号，已设置 `private: true`；即使核心版本号匹配，实验室入口也会拒绝这个仍处于阻止状态的构建。

## 上游状态

- [官方 npm 元数据](https://registry.npmjs.org/@deepseek-ai%2fdsh)中，`alpha` 指向 `0.1.3-alpha.2`，`latest` / `next` 仍指向 `0.1.2-rc.1`。
- alpha.2 于 `2026-09-07T13:11:36.213Z` 发布，但[版本元数据](https://registry.npmjs.org/@deepseek-ai%2fdsh/0.1.3-alpha.2)没有 `gitHead` 或可定位源码提交的 provenance。包签名不能代替源码映射。
- 公开分支、标签与发布记录只到 [`dsh-v0.1.3-alpha.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.1.3-alpha.1)，对应 `d347e703908d0406b7a7ef80e3a0e594d86b2215`；获取 alpha.2 标签失败，版本提交记录中也未定位到对应源码。这是核验时的公开可见状态，不代表不存在未公开源码。

不能拿 alpha.1 源码当作 alpha.2，也不能将 rc1 报告更名后当作新版证据。完整包校验值和复查命令见[英文记录](COMPATIBILITY-0.1.3-alpha.2.md)。

## 已完成的预检

本地环境为 macOS、Node `24.3.0`、pnpm `11.7.0`；以下不是跨系统 CI 结果。

- 精确升级 DSH 开发依赖和客户端 peers 到 `0.1.3-alpha.2`。增量安装曾保留 23 个不兼容的 rc1 peer 包；重新解析干净依赖后已消除，未使用 peer 强制覆盖或关闭信任检查。
- 锁文件中 225 个 DSH 包均为 alpha.2；新增整个 DSH 锁文件版本一致性测试，防止再次混入旧版；`pnpm peers check` 无问题。
- 类型检查和插件构建通过；28 个测试文件、229 项测试通过。
- 修正一处仍指向已移除 runtime 包的测试类型导入；中英文界面明确提示本分支尚未完成兼容验证。
- 构建后的打包预检包含 126 个文件，确认基线检查器和中英文迁移记录均在包内；未尝试 npm 发布。
- 上游 `dsh-client-ui-primitives` 包引用了未附带的 `index.js.map`，Vite 会产生不影响当前测试退出结果的警告；没有隐藏该警告，也未将其当成无障碍结果。

这些只证明已发布接口与独立组件层面的检查，不证明 alpha.2 核心、完整 DSH、读屏语音、盲文或残障用户独立任务完成能力。

## 后续必须完成

1. 取得能可靠对应 npm alpha.2 的公开、精确源码提交。
2. 迁移核心补丁，逐项检查附件、会话格式与历史、实时更新、权限、焦点和键盘行为的变化。
3. 将仍基于 rc1 的浏览器／AT 模板迁移到新源码，固定新核心提交或 tag，再经审查解除开发阻止状态。当前 assembled CI 必须在构建 rc1 前失败，不能跳过或拿旧版通过充当新版通过。
4. 完成核心定向测试、三浏览器验证、插件与真实 DSH 组合测试、一次性 AT 实验室启动检查及打包检查，并绑定精确干净提交归档新报告。
5. 审查版本和 npm 预发布频道后再发布。本分支不创建 release/tag，不改 npm dist-tag，也不替换 beta.8。
6. 真人 VoiceOver/NVDA 和残障开发者证据继续单独收集，账本维持空白，不转移旧证据、不补写未发生的验证。

日常使用仍保持 [`0.1.0-beta.8`](https://github.com/omdsh-dev/dsh-accessibility/releases/tag/v0.1.0-beta.8) 插件与 [`dsh-v0.1.2-rc.1-a11y.5`](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.5) 核心配套。该候选组合也不代表已完全支持读屏软件。
