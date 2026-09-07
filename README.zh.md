# @oh-my-dsh/dsh-accessibility

[English](README.md) | 简体中文

这是 DeepSeek Harness 的可选无障碍 companion 插件：提供读屏操作说明、语义自检和实验性的用户主动加载会话阅读视图。它只使用 DSH 官方 slot 与结构化 projection，不修改或监听易变化的哈希 CSS 类名。

本仓库也是 [DSH 无障碍工作组](https://github.com/omdsh-dev/community/blob/main/working-groups/accessibility.zh-CN.md)的公开项目中心。项目使命是：让残障开发者能够独立、有效、安全地完成 DSH 的核心任务；让 DSH 帮助所有开发者产出更无障碍的数字内容；并用版本化标准、真实辅助技术和残障用户证据持续验证。

项目入口：[无障碍声明](ACCESSIBILITY_STATEMENT.zh.md) · [路线图](ROADMAP.zh.md) · [治理](GOVERNANCE.zh.md) · [社区验证](COMMUNITY-VALIDATION.zh.md) · [首轮 AT 活动](PRIMARY-AT-CAMPAIGN.zh.md) · [研究规程](RESEARCH.zh.md) · [真人证据账本](HUMAN-EVIDENCE.zh.md) · [证据任务目录](EVIDENCE-CATALOG.json) · [聚合覆盖策略](EVIDENCE-COVERAGE.zh.md) · [脱敏诊断规程](DIAGNOSTIC-REPORT.zh.md) · [Accessible View RFC](RFC-ACCESSIBLE-VIEW.zh.md) · [浏览器证据 RFC](RFC-BROWSER-EVIDENCE.zh.md) · [创作／testkit RFC](RFC-A11Y-AUTHORING.zh.md) · [创作 agent 实验室](AUTHORING-AGENT-LAB.zh.md) · [创作辅助技术实验室](AUTHORING-AT-LAB.zh.md) · [CLI 无障碍规程](CLI-ACCESSIBILITY.zh.md) · [核心 AT 实验室](AT-CORE-LAB.zh.md) · [实时播报 AT 实验室](AT-LIVE-LAB.zh.md) · [Companion AT 实验室](AT-LAB.zh.md) · [贡献指南](CONTRIBUTING.zh.md)

## 兼容性

`0.1.0-beta.7` 仅面向 `@deepseek-ai/dsh@0.1.2-rc.1` 与无障碍核心候选 [`dsh-v0.1.2-rc.1-a11y.2`](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.2)。插件已从被移除的 `dsh-client-runtime` 迁移到 rc1 的 `ui-session` 与 `ui-chat` projection，所有 DSH peer 仍精确固定；`0.1.0-beta.6` 继续作为 DSH `0.1.1-rc.2` 的维护版本。插件能报告核心语义缺失，但无法从外部可靠替代组件本身的焦点陷阱、复合控件键盘操作、页面地标或 live region 策略。

## 从 npm 安装

```sh
dsh plugin --profile web add @oh-my-dsh/dsh-accessibility@0.1.0-beta.7
dsh --profile web
```

npm companion 不会修改 DSH 自有组件。在改动进入官方 DSH 发行版之前，请使用组织固定的 [DSH 无障碍构建](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.2)，体验完整候选行为：

```sh
git clone https://github.com/omdsh-dev/deepseek-harness.git
cd deepseek-harness
git checkout dsh-v0.1.2-rc.1-a11y.2
pnpm install
pnpm run build:official
pnpm dsh plugin --profile web add @oh-my-dsh/dsh-accessibility@0.1.0-beta.7
pnpm dsh web
```

## 从本地 checkout 安装

```sh
pnpm install
pnpm run build
dsh plugin --profile web add file:.
dsh --profile web
```

打开“设置 → 无障碍”，即可检查当前页面并阅读 VoiceOver、NVDA 和 JAWS 操作速查。

## Accessible View 候选

`0.1.0-beta.7` 会通过 DSH 官方 `conversation.view` slot 注册实验性的“无障碍视图”。它仍是 beta 功能，不构成稳定支持声明。

只选择标签页不会保留对话内容。激活“加载阅读视图”后，DSH 的结构化会话快照才进入组件。随后可以按来源顺序阅读最终和正在生成的记录，保留 Markdown 与代码语义；上下文、推理、工具参数／输出、命令输入和错误详情都要分别主动展开；还可以逐条复制消息和加载更早历史。“清除阅读视图并返回”会卸载内容，并把焦点还给“加载”。

MVP 仍以阅读为主。发送、停止、批准、编辑排队任务或使用专用工具控件时需返回 Chat。数据流、威胁评审、精确限制及 VoiceOver／NVDA 验证方式见 [RFC-ACCESSIBLE-VIEW.zh.md](RFC-ACCESSIBLE-VIEW.zh.md)。

组装门禁会在 Chromium、Firefox 和 WebKit 中以 640／320 CSS px 运行候选，采样焦点控件是否被遮挡、审计减少动态效果，并检查 Chromium 强制颜色参与情况。当前 rc1 核心报告把十四项必需检查和九项已登记 P0 Web 任务固定到干净的精确 revision `33546ce7d896625c313ad3ee0371047bcf8b8ade`；较早的 alpha.2 报告继续按各自精确 revision 归档，首轮真人活动也继续固定到原 alpha.2 候选。这些是版本化确定性结果，不是真实缩放、Windows 高对比度、辅助技术或残障用户证据。详见 [`automated-evidence/`](automated-evidence/README.zh.md) 与 [RFC-BROWSER-EVIDENCE.zh.md](RFC-BROWSER-EVIDENCE.zh.md)。

## 自检范围

页面自检现包含 17 项结构检查，覆盖地标、应用一级标题、控件名称、图片替代文本、列表归属、嵌套交互控件、ARIA 引用、输入框与消息日志、菜单、列表框、树、单选组、标签页、弹窗和可调分隔条。每项失败结果都提供上下文检查与修复建议；另有脱离页面、固定只有一项缺陷的练习，可在不读取或修改当前页面的前提下为真人验证产生稳定 `1/17` 结果。显式开启、仅保留在内存中的焦点跟踪器会报告最近一个外部焦点目标的近似名称、角色、Tab 位置和公开状态，不显示或保留 class、ID、selector、URL 或 HTML。版本化[脱敏诊断规程](DIAGNOSTIC-REPORT.zh.md)要求分别激活预览和复制，并只投影检查 ID、结果与数量；焦点名称、练习结果和 DOM 派生内容都会被排除。

全部通过只表示当前已挂载 DOM 满足这些可重复验证的结构契约，是测试证据而不是“完全合规”认证。实际朗读、浏览器到无障碍 API 的映射、焦点时序和 Windows 读屏表现，仍需按照插件内的 VoiceOver、NVDA、JAWS 场景做人工验证。

辅助技术矩阵、人工回归规程和支持边界见 [ACCESSIBILITY.zh.md](ACCESSIBILITY.zh.md)。

经过同意的真人结果使用版本化[真人证据账本](HUMAN-EVIDENCE.zh.md)。稳定任务以及核心、安全关键和声明资格只能来自[证据任务目录](EVIDENCE-CATALOG.json)，不能由提交者自行决定。validator 会保留失败和部分观察，同时禁止过期、私密、存在未记录协助、不安全、无资格、未知或证据不完整的记录声明 `a11y-at-tested` 或 `a11y-user-validated`。另有[聚合覆盖策略](EVIDENCE-COVERAGE.zh.md)阻止不兼容精确环境相互拼接，并报告主要与扩展辅助技术、CLI、companion、创作及残障开发者验证的全部缺口。当前账本只有非证据模板，因此二十六项聚合要求全部缺失。

首轮[主要辅助技术活动](PRIMARY-AT-CAMPAIGN.zh.md)现已 `open`，可针对固定核心与实验室 revision 提交 VoiceOver／Safari、NVDA／Chrome 和残障开发者核心任务结果。五项公开可用性门禁已通过匿名复核；在经同意的真人结果提交并评审前，真人证据账本仍正确保持为空。

## CLI 无障碍候选

rc1 无障碍核心候选保留了最初在 alpha.2 上开发的显式低噪声 headless 展示与版本化最终 JSON 结果。本仓库负责 draft `dsh-cli-accessibility/1.0.0-draft` 符合性规程；已经归档的 alpha.2 replay 不会自动转移成 rc1 证据。自动进程输出不属于读屏证据，人工启动器仍须补充人类实际观察的语音或盲文记录。详见 [CLI-ACCESSIBILITY.zh.md](CLI-ACCESSIBILITY.zh.md)。

## 无障碍创作候选

Draft [创作／testkit RFC](RFC-A11Y-AUTHORING.zh.md) 把纯版本化证据引擎、仅用于开发的浏览器 testkit、两个独立评审的页面提供层、选择性启用且模型可见的 `a11y_check` 适配器，以及分别授权的产品组合分成独立边界。六个独立本地包现已覆盖两条提供链路。`dsh-a11y-local-preview/0.1.0-draft` 是面向一次性字面量 loopback 预览、默认禁用的可安装 DSH bundle；`dsh-a11y-caller-page/0.1.0-draft` 是不可序列化的可信宿主组合，用于生命周期仍由调用方拥有的精确页面。后者不增加标签发现、导航、URL／认证读取、截图、HTML 序列化或关闭浏览器权限，并在策略上只允许一次性、未认证的合成页面。真实 Chromium、真实 loopback HTTP、已发布 DSH `SystemPrompt`／`ToolRuntime`、生命周期释放、隐私、包内容，以及适用路径的 bundle 安装与配置 dump 测试均已在本地通过。版本化[创作 agent 实验室](AUTHORING-AGENT-LAB.zh.md)证明了一项无密钥真实产品 agent-loop 任务：工具轨迹精确为 `a11y_check → read → edit → a11y_check`，自动 finding 从两项降到零，并验证持久化不可信数据框定。另行提供的[创作辅助技术实验室](AUTHORING-AT-LAB.zh.md)可通过真实 DSH Web 与审批 UI 操作该流程，并加入“仅允许一次”和“拒绝后源码不变”的自动安全门禁，以及经同意的 VoiceOver／NVDA 真人记录格式；自动浏览器和 Host 结果仍明确不属于辅助技术证据。[包发布就绪策略](AUTHORING-PACKAGE-READINESS.zh.md)现已固定六包依赖图，并在不混淆“可安装”和“符合性”的前提下报告发布阻塞项。六个 manifest 已按公开 scoped alpha 包准备，但远端仓库和 npm 发布尚未启用；评审、live-model 修复、人工听读辅助技术和残障作者门禁仍待完成，自动报告干净永远不能表述成 WCAG 符合。

适配器还会把每个页面／provider 派生的报告字符串明确框定并以 JSON 引用为不可信数据；其中夹带的命令绝不会变成指令，也不能成为扩大工具、文件、网络或批准权限的理由。

每份模型可见结果还会附带 `dsh-a11y-author-review-plan/0.1.0-draft`：十一项稳定人工计划，覆盖上下文替代内容、语义与阅读顺序、键盘／焦点、异步状态与错误、低视力、动态与计时、媒体、替代输入、语言与认知，以及真实 AT／残障作者任务。适配器只能生成 `claim: none`、`status: unresolved` 和未解决结果；直接真人证据必须进入另行评审的流程。

## 检查

```sh
pnpm run evidence:validate
pnpm run typecheck
pnpm test
pnpm run build
pnpm pack --pack-destination ./artifacts
```

## 模型体验

本分支的 runtime companion 不会增加模型可见的工具、提示词、消息或 context。另行授权的创作包不会被捆绑进 companion。

## 安全与隐私

自检只在内存中读取当前页面语义属性，绝不读取对话文本。Accessible View 只有在用户主动加载后才读取当前结构化对话；敏感技术部分还需分别展开，复制则是逐条消息写入系统剪贴板的显式操作。两项功能都不发起网络请求、不发送遥测，也不自行持久化结果或对话副本。
