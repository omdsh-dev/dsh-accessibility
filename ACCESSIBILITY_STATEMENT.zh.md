# 无障碍声明

简体中文 | [English](ACCESSIBILITY_STATEMENT.md)

最后复审：2026-09-07。

DSH 无障碍工作组的目标是让残障开发者能够独立、有效、安全地完成 DSH 的核心任务，并让 DSH 帮助所有开发者产出更无障碍的数字内容。

## 范围与目标

本声明覆盖 `@oh-my-dsh/dsh-accessibility` companion，以及 [ACCESSIBILITY.zh.md](ACCESSIBILITY.zh.md) 标明的组织维护 DSH 无障碍候选。Web 目标为 WCAG 2.2 AA，并使用 WAI-ARIA Authoring Practices 约束交互模式。由于 DSH 也是创作型智能体，项目使用 ATAG 2.0 Part A 与 Part B 作为产品设计指导。这些目标不构成合规声明。

## 当前支持

- companion 提供读屏操作指南、针对已挂载 HTML 与 ARIA 结构的 17 项确定性检查、上下文修复建议、显式启用的短暂焦点检查器，以及仅由用户主动复制的严格脱敏报告候选。
- rc1 无障碍候选包含地标、具名弹窗、焦点约束与返回、复合控件键盘模式、对话／日志语义、状态播报和键盘可调分隔条。
- 版本化候选具备生产浏览器、组件、构建和跨平台自动化证据。
- 已在启用 VoiceOver 的 macOS Safari 和 Chrome 中检查辅助功能树和键盘路径。

## 已知限制

- VoiceOver 经人工听读的完整实际朗读记录仍待补。
- Windows 实机 NVDA、JAWS、Narrator，以及 Linux Orca 结果仍待补。
- 当前 companion 不能修复缺失的核心焦点、键盘或播报行为，也不能直接观察操作系统无障碍 API 或精确读屏语音。
- 已测试核心与 beta.7 companion 候选均基于 DSH `0.1.2-rc.1`；后续 DSH 版本仍须重新完成兼容审计。
- 强制颜色、200%/400% 重排、盲文显示器、语音识别、开关控制，以及更广泛的认知和低视力场景尚未完成。
- 创作／testkit 包及完整审批／修复实验室仍是开发候选；live-model、真实 AT、残障作者、评审和发布证据均待补。
- 版本化真人证据账本当前只有非证据模板。其任务目录可阻止提交者把任意工作自行归类为核心或可声明任务，覆盖策略可阻止不兼容精确环境相互拼接，但仍尚不能支持 `a11y-at-tested` 或 `a11y-user-validated` 声明。二十六项聚合要求全部缺失。
- 自动检查通过不代表所有残障人士都能使用每一个工作流。
- 焦点检查器只是保守的 DOM 近似，不等同于平台无障碍 API 或读屏实际输出；其无障碍名称快照可能包含页面内容，并且绝不会进入脱敏报告。

精确支持矩阵和人工场景维护在 [ACCESSIBILITY.zh.md](ACCESSIBILITY.zh.md)，经过同意的公开真人结果使用 [HUMAN-EVIDENCE.zh.md](HUMAN-EVIDENCE.zh.md)、其权威[证据任务目录](EVIDENCE-CATALOG.json)及[聚合覆盖策略](EVIDENCE-COVERAGE.zh.md)，后续路线和发布门禁见 [ROADMAP.zh.md](ROADMAP.zh.md)。

## 反馈

请使用仓库的“无障碍障碍报告”表单反馈问题，注明精确版本并提供脱敏任务描述；不得包含凭据、私人提示词、对话内容、用户名或敏感路径。辅助技术用户可通过辅助技术测试表单提交结构化结果。

安全或隐私问题使用私有漏洞报告。行为事件遵循 [`omdsh-dev/community` 行为准则](https://github.com/omdsh-dev/community/blob/main/CODE_OF_CONDUCT.zh-CN.md)，不得公开报告。
