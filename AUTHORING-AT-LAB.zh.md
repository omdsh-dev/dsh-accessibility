# DSH 无障碍创作辅助技术实验室

简体中文 | [English](AUTHORING-AT-LAB.md)

规程：`dsh-a11y-authoring-at-lab/0.1.0-draft`。

这个一次性实验室用于让真人借助真实辅助技术完成一条完整的 DSH 创作流程：发现合成预览目标、运行 `a11y_check`、读取源码、理解一次性写入请求、允许或拒绝、检查改动并重新审计。它使用真实 DSH Web 界面、审批 UI、文件工具、本地预览组合、loopback HTTP 页面和 Chromium 审计提供方。

实验通过**不代表** DSH 已“完全无障碍”。一条通过记录只适用于测试者记录的精确 DSH revision、组合 revision、操作系统、浏览器、辅助技术、语言、设置、场景和任务。

## 证据边界

| 证据 | 能证明什么 | 单独绝不能证明什么 |
| --- | --- | --- |
| 有界启动冒烟 | 隔离产品世界能够启动并清理 | 任务、审批、修复、UI 或辅助技术可用 |
| `verify` | 真实 Chromium 可走通“仅允许一次”产品路径；源码精确修改；自动 finding 从 2 降至 0 | 语音、盲文、平台无障碍 API 行为、残障用户独立完成或 WCAG 符合性 |
| `verify-reject` | 拒绝结果被保留、编辑失败、源码逐字节不变、第二次审计仍为 2 项失败 | 真人能否通过辅助技术发现、理解并操作决策 |
| 真人辅助技术记录 | 所记录的辅助技术／浏览器组合能以实际观察到的语音／盲文和焦点行为完成本流程 | 其他组合、其他任务或残障用户独立完成 |
| 残障作者研究 | 残障开发者能在研究规程下独立、有效、安全地完成代表性任务 | 普遍无障碍或认证 |

readiness JSON、Host 终端输出、字幕、DOM 文本、截图和自动 Chromium 都明确标为**非辅助技术证据**。只能记录真人确实听到或摸读到的语音／盲文。

## 前置条件

- 已安装依赖的 DSH `0.2.0-rc.2` 与 `@oh-my-dsh/dsh-a11y-local-preview@0.1.0-alpha.1` 本地 checkout；
- DSH checkout 已生成 Web 构建产物（在其中运行 `pnpm run build`）；
- local-preview checkout 已构建（在其中运行 `pnpm run build`）；
- local-preview 所需的 Playwright Chromium；
- 真人记录所需的系统浏览器与辅助技术。可使用专门的辅助技术测试账号，但不要使用常用 DSH home 或真实产品内容。

launcher 会在启动子进程前移除 `DEEPSEEK_API_KEY`。本场景使用固定 replay，不需要模型密钥。

创建状态之前，launcher 还会要求 DSH、local-preview、无障碍实验室及每个内部创作包 checkout 的 Git 状态全部干净。它会重新打包精确六包依赖图，把 tarball 安装到一次性消费项目，再把这份已安装组合挂载进 Web 实验室。readiness 会分别报告三个证据承载源码的完整 revision，并报告组合 tarball integrity 与六包安装数量，因此未提交实现不能沿用其 checkout `HEAD` 的声明范围。

## 自动产品检查

当三个 checkout 互为同级目录时，在本仓库运行：

```sh
pnpm run lab:at:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview verify 0
pnpm run lab:at:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview verify-reject 0
pnpm run lab:at:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview none 1000
```

这三条命令是开发门禁，不是真人证据。`verify` 必须报告 `allowed-once`、`exactRepair: true` 和精确四工具序列。`verify-reject` 必须报告 `rejected`、`exactRepair: false`、`sourceUnchanged: true` 以及失败的 edit。一秒 `none` 运行只证明有界启动和清理，不挂载真人驱动的 replay。

## 启动真人辅助技术记录

macOS 上的 VoiceOver + Safari：

```sh
pnpm run lab:at:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview safari 0
```

macOS、Windows 或 Linux 上，使用隔离 Chrome／Chromium profile 的 VoiceOver／NVDA／JAWS／Narrator／Orca：

```sh
pnpm run lab:at:authoring -- ../deepseek-harness-alpha17 ../dsh-a11y-local-preview chrome 0
```

跨平台 Chrome 模式会寻找已安装的 Chrome／Chromium，创建全新临时 profile、禁用后台联网、阻断非 loopback 主机解析，并在退出时关闭隔离浏览器和删除 profile。Windows 上的 NVDA／JAWS／Narrator 与 Linux 上的 Orca 应优先使用此路线。Safari 可能复用既有浏览器上下文，因此只能使用专门的干净 profile；出现个人界面就立即停止。只有找不到可隔离的 Chrome／Chromium 时才使用 `none 0`，把另行打印的一次性登录 URL 复制到专门的干净浏览器 profile，且绝不能公开。默认浏览器就是被测浏览器且已经使用专门干净 profile 时，也可使用 `system 0`。

readiness JSON 包含 DSH、实验室与组合的版本和 revision、精确 tarball 安装元数据、环境、浏览器上下文隔离、合成 Session ID、精确任务文本、持久化策略与限制；它故意不含一次性登录 URL、预览 origin 和临时安装路径。

## 成功场景：仅允许一次

目录任务 ID：`allow-once`。

整个任务都使用读屏或盲文显示器。若看过屏幕，必须在记录中说明。

1. 打开一次性 URL，找到 `authoring-at-workspace` 及其最新 Session。
2. 找到访问模式控件并设为 **Read Only（只读）**，确认新状态可被辅助技术感知。
3. 原样提交 launcher 打印的 `taskInput`。
4. 跟踪第一次 `a11y_check`、源码读取和待审批编辑。确认第一次审计可感知到两项失败：图片替代文本缺失和按钮名称为空。
5. DSH 展示 Approval details 时，在不依赖明眼人解释的情况下判断请求的操作、目标模式、文件和理由。
6. 选择 **Allow once（仅允许一次）**，确认决策、编辑完成和源码 diff 均可感知。
7. 阅读第二次审计。它必须报告零项自动失败，同时保留“干净的自动审计不等于符合性”的限制。
8. 确认最终中性消息没有超出工具和审计证据宣称成功。
9. 回到终端按 Ctrl+C，确认 launcher 退出并删除一次性状态。

只有测试者能在没有未记录明眼协助的情况下完成任务、理解一次性权限、保持决策控制并识别有界结果，真人记录才算通过。如果焦点丢失或审批后果不清楚，即便有语音也不能算通过。

## 安全场景：拒绝

目录任务 ID：`reject`。

重新启动一个全新实验室，不要复用已修复的世界。

1. 重复设置并提交同一任务。
2. 在 Approval details 中选择 **Reject（拒绝）**。
3. 确认拒绝和 edit 失败可被感知，焦点回到有用位置。
4. 确认第二次审计仍报告原来的两项失败。Host 边界可能打印 `exactRepair: false`，但终端行不是辅助技术证据。
5. 记录最终中性消息是否会被误解。它只说明有界流程结束，不声称修复成功。

如果拒绝后源码仍改变、拒绝结果被隐藏、第二次审计错误地报告零项，或用户无法区分“流程结束”和“修复成功”，安全场景即失败。

## 真人证据记录必填项

每个精确“产品／浏览器或终端／辅助技术／语言”组合都应使用 **辅助技术测试结果** Issue 表单单独提交一条公开记录，并先脱敏。若结果经过支持声明评审，应按照 [HUMAN-EVIDENCE.zh.md](HUMAN-EVIDENCE.zh.md) 用 `dsh-a11y-human-evidence/0.1.0-draft` 编码公开摘要；失败或部分结果仍为 `claim: none`。至少记录：

- 规程和稳定目录任务 ID（`allow-once` 或 `reject`）；
- readiness JSON 中的精确 DSH、无障碍实验室与组合版本、revision；
- 操作系统／build、硬件或虚拟机；
- 浏览器／版本和辅助技术／版本；
- UI 与语音语言、详细度、标点、浏览／焦点模式、盲文或输入设备设置；
- 是否看过屏幕以及所有协助形式；
- 任务完成情况、必要时的耗时和结果；
- 每次状态转换后的焦点位置；
- 目标发现、审计摘要、finding 详情、审批请求、决策结果、diff、第二次审计和最终响应的简短真实语音／盲文观察；
- 阻塞、混乱播报、重复／静默输出、不可操作控件、绕过方式和安全／隐私问题；
- 未测试内容以及为何结果不能泛化；
- 同意公开去标识化结果。

不得附加参与者原始录音、凭据、私有 prompt、常用 DSH 对话、用户名、私有路径、一次性 URL 或未经检查的 session log。为说明互操作性所必需的精确短句优于完整转录。

## 隐私、安全和清理

页面只含合成内容，并绑定到字面量临时 `127.0.0.1` origin。提供方阻断 DNS 主机名、远程 origin、query／fragment 秘密载体、环境凭据、不安全方法、WebSocket、下载、service worker 和跨 origin 跳转。DSH 状态、workspace、profile 链接、session 持久化、预览 server 和产品登录 token 均为临时内容，退出时删除；SIGINT／SIGTERM 也执行清理。

测试者仍控制机器和浏览器。优先使用隔离 `chrome`；`system` 或 `safari` 只能配合专门的干净 profile，若出现个人标签页、历史记录、书签、账户、扩展或自动填充界面，应在测试前立即停止。不得分享一次性 URL、通过隧道暴露 loopback 端口、向一次性 profile 安装无关插件或换成真实源码。若清理失败，将终端错误作为私有诊断保留；只把经过核验、名称明确的临时目录移到废纸篓，绝不能删除宽泛临时路径。

## 已知限制和下一层证据

- fixture 是一个只有两项确定性障碍的静态英文页面，不覆盖动态应用、鉴权、远程内容、多文件修复、撤销、合并冲突或替代文本质量判断。
- replay 固定，只证明产品交互，不证明 live model 推理或可靠性。
- 提供方使用 Chromium 和自动规则，不检查 VoiceOver／NVDA 的平台映射。
- 当精确语音属于发布门禁时，真人辅助技术记录仍需听众复核。
- 即使 VoiceOver 与 NVDA 记录通过，在残障开发者能独立、有效、安全地完成代表性创作任务之前，项目目标仍未完成。

同意、去标识化、严重程度、协助和残障用户研究规则见 [RESEARCH.zh.md](RESEARCH.zh.md)；权限与提供方架构见 [RFC-A11Y-AUTHORING.zh.md](RFC-A11Y-AUTHORING.zh.md)。

## 历史证据与当前候选版

旧版 `0.1.2-alpha.2` 的证据与原 schema 保持不变，不证明本候选版通过。当前 launcher 固定要求 DSH `0.2.0-rc.2`、local-preview `0.1.0-alpha.1` 与实验室 `0.1.3-rc.1`，并拒绝旧版本组合。发布元数据不是创建公开仓库或公共 npm 包的授权；发布须满足当前可见性授权和全部门禁。
