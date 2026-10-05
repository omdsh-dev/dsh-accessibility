# DSH 无障碍创作 agent 实验室

简体中文 | [English](AUTHORING-AGENT-LAB.md)

规程：`dsh-a11y-authoring-agent-lab/0.1.2-draft`。机器可读契约：[AUTHORING-AGENT-LAB-0.2.0.schema.json](AUTHORING-AGENT-LAB-0.2.0.schema.json)。

这个一次性实验室验证一项受限 DSH 创作任务：检查渲染后的本地预览，读取源码，通过 DSH 既有文件系统工具修复缺失的图片替代文本与空按钮名称，再审计修复后的页面。它会安装并运行产品组合，而不是直接 import 适配器来绕过产品生命周期。

## 一次通过能够证明什么

Replay 运行通过后，可针对输出中的精确修订证明：

- 真实 DSH `0.2.0-rc.2` 产品入口和插件管理器能够加载 freshly packed 的 `@oh-my-dsh/dsh-a11y-local-preview@0.1.0-alpha.1` tarball，完整六包内部依赖图也全部从新打出的 tarball 解析；
- 真实字面量 loopback HTTP 页面在全新真实 Chromium context 中接受审计；
- 真实 DSH agent loop 精确执行 `a11y_check → read → edit → a11y_check`；
- 每个持久化工具调用都只有一个匹配的成功结果，两次审计都限制在 `main` 与已批准不透明句柄，文件系统访问仅限 `index.html`；
- 两次持久化审计结果都保留精确的不可信数据安全边界，并把类提示注入的提供层 subject 限制在单一 JSON 引用的 `Subject data` 记录中，而不是暴露成指令或新的转录记录；
- 两次模型可见审计结果都附带完整的 `dsh-a11y-author-review-plan/0.1.0-draft`，十一项全部保留为 `unresolved`，且不产生符合性声明，也不让自动化代替直接真人证据；
- 初始页面精确包含预期的 `button-name` 与 `image-alt` 障碍，最终源码是精确的受限修复而不是删除控件或改写无关内容，最终自动报告没有 finding；
- 最终 `dsh-headless-result/1.0.0` 记录报告完成；
- 对外证据对象包含版本、修订、汇总 finding 和限制，但不含临时目录、DSH home、工作区路径或 loopback origin。

Runner 始终删除临时工作区与 DSH home，也不会使用测试者日常浏览器 profile 或 DSH 状态。

## 证据等级

| 模式或活动 | 新增证明 | 不能证明 |
| --- | --- | --- |
| `replay` | 固定、无密钥模型转录驱动下的真实产品、插件、浏览器、提供层、工具、文件策略和持久化集成 | 模型推理、模型可靠性、AT 输出、残障作者独立完成、WCAG 符合性 |
| `live` | 由真实 DeepSeek 模型驱动的同一产品循环，并继续接受精确轨迹与修复门禁 | 一般模型可靠性、AT 可用性、残障作者独立完成、WCAG 符合性 |
| 人工 AT 任务 | 具名 AT／浏览器／语言组合能够呈现并操作完整报告—修复流程 | 其他 AT／平台组合或残障用户独立成功 |
| 残障作者研究 | 残障开发者能够按照研究规程独立、有效、安全地完成代表任务 | 普遍无障碍或认证 |

不得把 replay 结果升级成模型证据，也不得把任一自动模式升级成辅助技术或残障用户证据。自动审计干净只覆盖固定规则与当次渲染状态。

## 运行方式

前置条件：

- 各仓库接受的 Node.js 与 pnpm 版本；
- 已安装依赖的 DSH `0.2.0-rc.2` 和 `dsh-a11y-local-preview@0.1.0-alpha.1` 本地 checkout；
- local-preview 包需要的 Playwright Chromium 二进制；
- replay 插件尚未缓存时可以访问 npm。

当三个 checkout 位于同级目录时，在本仓库运行：

```sh
pnpm run lab:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview replay
```

Replay 模式无需密钥。Runner 会构建 DSH host 库与产品组合，创建一次性页面和 DSH home，重新打包精确六包创作依赖图，通过带 profile-local tarball override 的真实 `dsh plugin` 命令安装组合，执行任务，校验持久化 session，输出一个 JSON 证据对象，然后清理全部临时状态。

创建任何一次性状态前，Runner 要求 DSH、产品组合和无障碍实验室三个 Git 工作树都保持干净，并记录三者完整 revision。只要存在 tracked、staged 或 untracked 改动，replay 和 live 模式都会 fail closed。

Live 模式需要通过操作者平时使用的密钥管理方式，把 `DEEPSEEK_API_KEY` 放入进程环境，然后运行：

```sh
pnpm run lab:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview live
```

Live 模式不得使用真实产品数据或日常鉴权预览。任务、工具说明、页面 finding 与工具结果可能发送给配置的模型提供方。Runner 在没有密钥时会拒绝 live 模式；它会从构建和插件安装子进程中移除密钥，只把密钥传给最终 DSH agent 进程，并且绝不会在证据中打印或保存密钥。

## 安全与隐私边界

预览只绑定临时字面量 `127.0.0.1` 端口，内容均为合成数据。产品组合在挂载前拒绝 query、fragment、凭据、DNS hostname 与远程 origin。提供层只允许对已批准 origin 发起受限读取请求，并阻断跨 origin 请求、不安全方法、WebSocket、下载、service worker 与环境鉴权 header。DSH 仅在一次性目录内使用 `workspace-write`，轨迹门禁还会拒绝 `bash`、`write`、任何未批准工具、其他文件、失败工具结果、额外步骤和变化后的审计范围。配置的 subject 会刻意包含类指令文本；证据门禁读取两次真实持久化 `a11y_check` 结果，只有该文本在每个结果中恰好出现一次、处于预期 JSON 引用数据记录内且同时存在禁止扩权警告时才通过。同一门禁还会在任一人工计划行消失、丢失直接证据要求，或被自动化从 `unresolved` 提升时失败。

原始 session 日志属于私密诊断材料：它包含任务、工具参数、selector 与临时路径。Runner 只在本地读取它来实施轨迹门禁，并在完成时删除。分享前只能保留最终受限 JSON，并按 [RESEARCH.zh.md](RESEARCH.zh.md) 人工检查。

## 仍需完成的真实辅助技术验证

下一证据等级必须使用完整交互式 DSH 界面，不能只依赖这项 headless replay。版本化[创作辅助技术实验室](AUTHORING-AT-LAB.zh.md)现已提供一次性 Web 任务、真实审批交互、允许／拒绝安全场景和精确真人记录格式。最低要求是在该规程下分别保留 VoiceOver／Safari 与 NVDA／Chrome 或 Edge 结果。即使这些辅助技术矩阵行通过，残障作者独立任务证据仍是单独门禁。

## 已知限制

- Fixture 只在小型静态页面覆盖两种常见确定性障碍，不代表应用、动态状态、鉴权或跨 origin 内容。
- 精确源码校验刻意严格，可能拒绝语义等价的 live-model 修改；这是符合性 fixture，不是通用修复 benchmark。
- 本 fixture 的替代文本质量由构造时已知；真实内容仍须作者判断。
- Chromium 与 axe-core 结果不能证明平台无障碍 API 或读屏语音／盲文表现。
- local-preview 产品组合及其依赖已经具有公开 alpha 包元数据，但远端仓库和 npm 发布尚未启用；本实验室仅提供预发布证据。

## 历史证据与当前候选版

旧版 `0.1.2-alpha.2` 的证据与原 schema 保持不变，不证明本候选版通过。当前 launcher 固定要求 DSH `0.2.0-rc.2`、local-preview `0.1.0-alpha.1` 与实验室 `0.1.3-rc.1`，并拒绝旧版本组合。发布元数据不是创建公开仓库或公共 npm 包的授权；发布须满足当前可见性授权和全部门禁。
