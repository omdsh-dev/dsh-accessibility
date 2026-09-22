# DSH 核心辅助技术实验室

简体中文 | [English](AT-CORE-LAB.md)

状态：供公开评审的探索性规程

规程：`dsh-core-at-lab/1.0.0-draft`

跟踪：[alpha.2 核心迁移 #22](https://github.com/omdsh-dev/dsh-accessibility/issues/22)、[VoiceOver #2](https://github.com/omdsh-dev/dsh-accessibility/issues/2)和 [NVDA #1](https://github.com/omdsh-dev/dsh-accessibility/issues/1)

## 目的与证据边界

本实验室用 DSH 自带的合成 seeded-history Session 启动精确的 DSH `0.1.7-alpha.1` 核心候选，并放入两份 Session 以便验证树导航。它使用一次性的 DSH home、持久化根目录和工作区，不需要 API key 或 companion 插件。覆盖范围包括应用外壳、Workspace 树、Session 视图、Chat 历史、Trajectory、Settings 对话框、菜单、展开控件和可调分隔条。

实验室成功就绪、无障碍树转储或可见的读屏字幕都不算辅助技术通过。有效结果必须由人实际观察语音或盲文、焦点或光标行为、独立任务完成、错误和变通方式。残障用户证据还需要知情同意和去标识化任务记录。本实验室使用静态 fixture，不验证实时回答、工具、审批、问题或计划评审播报；这些证据行使用独立的[实时播报实验室](AT-LIVE-LAB.zh.md)验证。

## 精确候选配置

本 checkout 以插件清单固定的版本为目标。已有首轮 AT 活动仍固定到原始修订；在本候选上运行属于独立观察，不能填入旧活动的证据行。

```sh
git clone https://github.com/omdsh-dev/deepseek-harness.git
git clone https://github.com/omdsh-dev/dsh-accessibility.git

cd deepseek-harness
git checkout feat/a11y-core-0.1.7-alpha.1
pnpm install
pnpm run build

cd ../dsh-accessibility
git checkout feat/compat-0.1.7-alpha.1
pnpm install --frozen-lockfile
```

只有 DSH checkout 和本无障碍实验室 checkout 都是 Git 仓库，且 tracked、staged 与 untracked 状态全部干净时，启动器才会创建实验状态。就绪记录会标明两个 checkout 的完整 commit 和包版本；分支名或遗漏本地改动的 commit 绝不能作为证据来源。

从 companion checkout 启动：

```sh
# 不打开浏览器，只打印一次性本地登录地址。
pnpm run lab:at:core ../deepseek-harness none

# 在 macOS、Windows 或 Linux 打开系统默认浏览器。
pnpm run lab:at:core ../deepseek-harness system

# 在 macOS 打开 Safari。该模式可能复用既有浏览器上下文，因此必须使用
# 专门的干净 profile；只要出现个人界面就立即停止。
pnpm run lab:at:core ../deepseek-harness safari

# 在 macOS／Windows 打开 Google Chrome，或在 Linux 打开 Chrome／Chromium；
# 都使用全新临时 profile。后台联网会被禁用，非 loopback 主机解析也会被阻止。
pnpm run lab:at:core ../deepseek-harness chrome
```

启动器会打印版本化 JSON 就绪记录，其中包含精确 DSH 与实验室 revision、操作系统信息和浏览器上下文隔离状态。临时一次性登录地址会单独打印：只在本机使用，不要粘贴进公开结果。启动器不会创建截图、录屏、上传或公开 artifact。跨平台 `chrome` 模式会寻找已安装的 Chrome／Chromium，且不会打开测试者日常 profile，因此是本机测试中最安全的默认选项；`system` 与 `safari` 可能复用既有浏览器上下文，只能配合专门的干净 profile 使用。

测试结束后回到终端按 Ctrl+C 请求清理。启动器随后关闭隔离的 Chrome 进程，并移除其临时 profile、一次性 DSH home、Session 持久化和工作区；`system` 或 `safari` 模式留下的失效标签页仍需手动关闭。如果进程被强制终止，只可能在操作系统临时目录留下启动器打印过的 `dsh-core-at-lab-...` 目录；先检查，再把这个精确目录移到废纸篓，绝不能删除宽泛的临时路径。

仅用于自动检查启动与清理：

```sh
pnpm run lab:at:core ../deepseek-harness none 1000
```

该结果只证明实验室能够启动和清理，不是 AT 证据。

## 人工核心任务规程

测试前记录操作系统 build、浏览器版本、辅助技术名称和版本、UI 与语音语言、声音、详细度、标点、输入输出设备，以及就绪记录中的精确 DSH revision。只使用两个合成 Session。下列反引号名称是稳定的目录任务 ID；在证据记录中不得重新编号或改成自由文本。

1. `discover-structure`——不使用指针，找到 DSH 应用标题、具名 Sidebar navigation、main 内容和 Details complementary 区域。
2. `navigate-sessions`——只用一个顺序 Tab 入口进入 Sessions 树，听取层级、展开和选中状态；使用方向键、Home／End 和前缀输入导航，激活第二个合成 Session，并在访问行操作后返回树行。
3. `search-sessions`——打开 Session 搜索，输入并清除查询，用 Escape 关闭，并确认焦点返回“搜索会话”。
4. `adjust-layout`——找到 Sidebar 与 Details 分隔条，听取名称、方向、值和边界；使用方向键、Home／End 调整，用 Enter 切换 Details，并确认焦点保留在分隔条上。
5. `switch-session-view`——找到 Session 视图标签列表。使用方向键和 Home／End 在 Chat 与 Trajectory 之间移动，核对选中状态和新命名的 panel，并确认标签列表只占一个普通 Tab stop。
6. `read-conversation`——在 Chat 中按来源顺序阅读合成对话。记录消息作者、文本、代码、链接、工具名称，以及运行中／已完成／失败／已停止状态是否易于理解。展开和折叠工具详情，核对受控内容边界与焦点稳定性。
7. `inspect-trajectory`——在 Trajectory 中只用一个顺序入口进入事件表格，使用方向键和 Home／End 导航行；打开一行，在“事件详情”标签页之间移动，调整事件详情分隔条，关闭详情并确认返回路径可预测。
8. `configure-settings`——打开 Settings，确认对话框名称和初始焦点；打开一个设置菜单，核对已勾选选项和方向键、Home／End、前缀输入操作；先用 Escape 只关闭菜单，再关闭 Settings，并确认焦点返回触发按钮。
9. `edit-composer-draft`——返回 Chat，找到消息输入框和发送控件；输入、编辑并清空合成草稿，不要提交。确认普通 Tab／Shift+Tab 导航不需要用指针救场。
10. `nonvisual-repeat`——在安全的前提下忽略或关闭视觉显示，重复最容易失败的路径。记录每次意外重复、静默、浏览／焦点模式切换、光标陷阱、焦点丢失、变通方式，以及任务是否仍能独立完成。这项探索性复测已进入目录，但不能单独支撑支持声明。

VoiceOver 测试者应根据控件使用转子、VO+左／右、VO+空格及 Tab／Shift+Tab。NVDA 测试者应同时验证浏览模式和焦点模式，并记录模式切换。不要把意外朗读改写成“正常说法”；在不附带无关合成内容的前提下，保留足够精确的原话以便复现。

## 可复制结果模板

```md
### DSH 核心 AT 实验室结果

- 规程：dsh-core-at-lab/1.0.0-draft
- 日期／时间及测试者时区：
- 同意公开此去标识化结果：是／否
- 残障用户证据：否／是（只记录类别；不要包含使用需求、诊断或残障详情）
- 操作系统及 build：
- 浏览器及精确版本：
- 辅助技术及精确版本：
- UI／语音语言、声音、详细度、标点：
- DSH revision：
- 无障碍实验室版本与 revision：
- 输入／输出设备：

| 任务 | 实际语音／盲文及焦点／光标结果 | 是否独立完成 | 变通方式 | 通过／失败／部分通过 | 严重程度 |
| --- | --- | --- | --- | --- | --- |
| `discover-structure` | | | | | |
| `navigate-sessions` | | | | | |
| `search-sessions` | | | | | |
| `adjust-layout` | | | | | |
| `switch-session-view` | | | | | |
| `read-conversation` | | | | | |
| `inspect-trajectory` | | | | | |
| `configure-settings` | | | | | |
| `edit-composer-draft` | | | | | |
| `nonvisual-repeat` | | | | | |

- 意外播报、重复、静默或光标陷阱：
- 恢复路径：
- 未测试项，包括实时播报：
- 已同意公开的脱敏证据链接：
- 评审者及评审日期：
```

每个操作系统／浏览器／辅助技术／语言组合通过辅助技术结果表单单独提交一个公开结果。适用时同时引用 Issue #22，以及 VoiceOver #2 或 NVDA #1。部分通过和失败结果同样有价值，必须保留其真实标签。

## 隐私与安全

- 绝不使用日常 DSH home、真实工作区、API key、提示词、对话、用户名或私人路径。
- 优先使用带一次性浏览器 profile 的 `chrome` 模式。只有准备了专门的干净 profile 才能使用 `system` 或 `safari`；如果出现个人标签页、历史记录、书签、账户、扩展或自动填充界面，应在测试前立即停止。
- 不得公开一次性本地登录地址或原始语音历史。未逐帧／逐行审查并取得可识别参与者同意时，不得公开屏幕／音频录制、日志、截图或盲文输出。
- 如果浏览器打开非本地地址、出现意外账户／profile 界面，或无法区分合成内容与个人数据，应立即停止。
- 实验室输出只是本地测试元数据，不得自动上传，也不能用于宣称整个产品已经无障碍。
