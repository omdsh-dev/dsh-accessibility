# 无障碍支持与验证

[English](ACCESSIBILITY.md)

本项目的目标是让仅使用键盘或读屏软件的用户可以操作并理解 DeepSeek Harness Web 与 CLI 的完整工作流。companion 自检只提供附加证据；语义、焦点、复合控件键盘模型、状态播报和稳定终端输出仍由 DSH 自有组件负责。

## 支持的核心版本

- 官方基线：`@deepseek-ai/dsh@0.1.2-rc.1`。
- 完整候选构建：[`dsh-v0.1.2-rc.1-a11y.2`](https://github.com/omdsh-dev/deepseek-harness/releases/tag/dsh-v0.1.2-rc.1-a11y.2)。
- Companion 候选：`@oh-my-dsh/dsh-accessibility@0.1.0-beta.7`。
- 上游跟踪：[deepseek-ai/deepseek-harness Discussion #4546](https://github.com/deepseek-ai/deepseek-harness/discussions/4546)。

把本 npm 包装入未打核心补丁的官方构建，只会增加诊断和操作指南，不能替代缺失的核心焦点或复合控件行为。

beta.7 companion 已包含迁移到 rc1 Session 与 Chat projection 的实验性 Accessible View 候选。其自动组件证据不构成辅助技术支持声明。详见 [RFC-ACCESSIBLE-VIEW.zh.md](RFC-ACCESSIBLE-VIEW.zh.md)。

rc1 无障碍核心候选也包含最初在 alpha.2 上开发的一次性 CLI 无障碍工作。低噪声文本与版本化 JSON 输出已实现，但既有 alpha.2 进程结果不会自动转移，真实终端、读屏、盲文和残障开发者证据仍待补。详见 [CLI-ACCESSIBILITY.zh.md](CLI-ACCESSIBILITY.zh.md)。

## 辅助技术矩阵

| 平台 | 浏览器 | 辅助技术 | 状态 |
| --- | --- | --- | --- |
| macOS | Chrome 151 | VoiceOver | 浏览器辅助功能树与键盘回归通过；完整实际朗读记录待补 |
| macOS | Safari 18.5 | VoiceOver 10 | 启用 VoiceOver 的原生树与焦点路径回归通过；经人工听读的完整朗读记录待补 |
| Windows 11 | Chrome／Firefox | NVDA | Windows 自动门禁通过；物理读屏回归待补 |
| Windows 11 | Edge／Chrome | JAWS | Windows 自动门禁通过；物理读屏回归待补 |
| Windows 11 | Edge | Narrator | 建议作为兼容信号，不能替代 NVDA 或 JAWS |
| Linux | Firefox | Orca | 物理读屏回归待补 |
| 支持的桌面平台 | 浏览器／终端 | 写明名称的读屏软件与可刷新盲文显示器组合 | 核心 Web 与 CLI 真人盲文记录待补 |
| 支持的桌面平台 | 浏览器 | 写明名称的语音输入、开关输入或放大技术 | 核心 Web 真人任务记录待补 |

此矩阵只是计划与限制摘要，本身不构成支持声明。只有当前有效、精确版本的真人结果进入并通过[真人证据账本](HUMAN-EVIDENCE.zh.md)校验，并使用权威[证据目录](EVIDENCE-CATALOG.json)中的合格任务后，对应行才可能支持 `a11y-at-tested` 或 `a11y-user-validated`。[聚合覆盖策略](EVIDENCE-COVERAGE.zh.md)还会阻止不兼容矩阵行相互拼接。当前账本只有非证据模板，因此所有人工听读、残障用户行及二十六项聚合要求仍为待补。

## 已记录的 macOS 证据

2026-08-26 的回归环境为 macOS 15.5（24F74）、Chrome 151.0.7922.170、Safari 18.5 与 VoiceOver 10。在补丁生产构建中，Safari 原生辅助功能树暴露了具名导航、唯一的应用一级标题、主区域与补充地标、对话日志与消息 article、Chat／Trajectory 标签组、时间线复合控件、菜单、弹窗、输入控件及可调分隔条。键盘检查覆盖标签切换、菜单关闭、弹窗内连续四十次 Tab 焦点约束、折叠搜索从辅助功能树移除及 Escape 焦点返回，以及折叠侧栏中的具名设置触发器。已安装 companion 的每项确定性自检均通过。

启用 VoiceOver 的 Safari 实测启动了真实系统 VoiceOver 进程，并操作中文引导与空外壳流程。顺序焦点依次经过“打开侧边栏”“新建会话”“添加工作区”“搜索会话”“设置”“选择工作区”“Agent 预设”和输入区。设置通过键盘打开，内部控件可达，按 Escape 后焦点返回“设置”。原生辅助功能树为每个经过的控件暴露了角色与本地化名称。

这些证据验证了真实启用 VoiceOver 的环境、浏览器映射、暴露结构和自动化界面可观察到的焦点／按键行为。运行器无法可靠捕获音频朗读或 VoiceOver 光标覆盖层，因此矩阵仍把经人工听读的实际语音列为待补，不把本次结果提升为辅助技术认证。

## 必做人工场景

1. 通过地标和标题浏览，不逐个经过所有控件。
2. 打开和关闭设置、原图预览与嵌套弹窗，确认焦点约束及返回。
3. 用一次 Tab 进入工作区树和子代理树，再使用方向键、Home、End、Enter 与空格。
4. 操作模型菜单、动作菜单、子菜单、前缀搜索、Escape 和 Tab 离开。
5. 操作命令组合框与列表框，确认 active-descendant 播报。
6. 完成单选、多选及自定义文本问题。
7. 阅读对话文章、推理、工具输出、代码、表格、公式、图片、错误及完成状态。
8. 用键盘调整两侧面板分隔条并确认数值播报。
9. 选择轨迹行和范围、切换视图，并用一次 Tab 离开复合控件。
10. 打开反馈备注、遍历边界、提交或取消，并确认焦点返回。
11. 覆盖离线、重连、加载、鉴权错误、中断和重试状态。
12. 在 200% 与 400% 缩放、减少动态效果及强制颜色模式下重复关键流程。
13. 选择“无障碍视图”，证明主动“加载”之前对话标记不在辅助功能树中；加载后确认焦点进入视图标题。
14. 浏览来源顺序记录和语义化 Markdown／代码；分别展开上下文、推理、工具参数／输出、命令输入和错误，并确认焦点不丢失。
15. 复制指定消息，验证加载更早历史的成功和脱敏失败，清除视图并确认焦点返回“加载”，同时确认 Chat 源数据没有变化。
16. 运行脱离页面的合成诊断练习，理解固定的“十七项中一项失败”，展开上下文建议，并且在不依赖颜色或视觉位置的情况下确定缺少名称的修复方向。
17. 开启焦点跟踪，移动到具名且有状态的控件，再返回检查器，确认名称、角色、Tab 位置和状态可以理解；同时确认浏览过程中不会持续播报快照。
18. 运行当前页面诊断，分别执行准备、阅读精确脱敏 JSON 和复制；确认内容不含页面标题、URL、selector、元素／焦点名称、练习结果、会话内容或浏览器标识，并且没有被描述成辅助技术或 WCAG 证据。

记录浏览器、辅助技术版本、语言、场景、实际朗读、焦点结果和通过／失败。自动 DOM 通过不得替代人工辅助技术通过。

可用[隔离式 AT 实验室](AT-LAB.zh.md)启动精确候选、一次性 DSH home 和合成会话。实验室可启动或字幕面板出现文字，仍必须补充人工观察的语音／盲文和任务完成记录。

一次性终端候选请使用 [CLI 无障碍人工实验室](CLI-ACCESSIBILITY.zh.md#人工终端与读屏实验室)。真实语音／盲文顺序及独立任务结果必须与自动进程输出分开记录。

完整的审计／读取／允许或拒绝／编辑／复审流程请使用[创作 AT 实验室](AUTHORING-AT-LAB.zh.md)。只能公开经过同意和去标识化的结果；经评审的支持证据再按 `dsh-a11y-human-evidence/0.1.0-draft` 编码。失败和部分结果仍有价值，但必须使用 `claim: none`。

## 自动门禁

- 设置页内 17 项确定性语义自检。
- 本地化的逐项修复建议、短暂焦点名称／角色／状态检查，以及 [dsh-accessibility-diagnostic/1.0.0-draft](DIAGNOSTIC-REPORT.zh.md) 下的严格 allowlist 投影；焦点快照绝不会进入报告。
- 名称、引用、地标、标题、列表归属、嵌套控件、菜单、列表框、树、单选组、标签页、弹窗及分隔条单元测试。
- 插件设置界面的 axe-core 回归。
- Accessible View 注册、未加载选择器、焦点生命周期、敏感内容延迟挂载、剪贴板 projection、分页、来源顺序及空闲／加载 axe-core 测试。
- Accessible View 的版本化 `dsh-non-at-browser/1.0.0-draft` 组装证据：在 Chromium、Firefox、WebKit 中检查 640／320 CSS px 页面重排、焦点可见／遮挡采样、减少动态效果及 Chromium 强制颜色参与情况。范围与限制见 [RFC-BROWSER-EVIDENCE.zh.md](RFC-BROWSER-EVIDENCE.zh.md)。
- 精确干净 rc1 revision `33546ce7d896625c313ad3ee0371047bcf8b8ade` 上经过 Schema 校验的 `dsh-core-browser-non-at` 证据：十四项必需检查在 Chromium、Firefox 与 WebKit 中覆盖全部九项已登记静态 P0 Web 任务。[rc1 报告](automated-evidence/core-browser/2026-09-07-dsh-0.1.2-rc.1-33546ce7d8.json)仍不属于 AT 或用户证据；原 [alpha.2 活动报告](automated-evidence/core-browser/2026-08-31-dsh-0.1.2-alpha.2-5803bfcfdd.json)仍只绑定其活动精确 revision。
- 版本化 `dsh-cli-accessibility/1.0.0-draft` 产品入口进程符合性：覆盖可发现性、参数闭合失败、低噪声文本、单行 JSON、终端控制字符、退出状态与成功／失败投影；该结果明确不属于 AT 证据。
- `dsh-a11y-human-evidence/0.1.0-draft` Schema 与仓库 validator，加上固定的 `dsh-a11y-evidence-catalog/0.1.0-draft`：检查精确范围、已登记稳定任务、权威核心／安全／声明资格分类、同意标记、隐私、协助情况、任务安全性／有效性、公开评审和证据新鲜度。此门禁可以拒绝无依据声明，不能制造真人证据。
- `dsh-a11y-evidence-coverage-policy/0.1.0-draft` 及其版本化报告：只聚合兼容的精确环境 AT 记录，要求残障开发者任务集合保留在单条记录中，并暴露每个缺失基线行，绝不把覆盖率提升成发布就绪。
- GitHub Actions 中的跨平台 Node、类型、单元、构建和包内容检查。
- 补丁核心保留组件、GUI、生产构建及浏览器回放套件。

## 问题反馈

请在 [GitHub Issues](https://github.com/omdsh-dev/dsh-accessibility/issues) 报告回归，并注明对应矩阵行与场景。安全敏感问题请按 [SECURITY.md](SECURITY.md) 处理。
