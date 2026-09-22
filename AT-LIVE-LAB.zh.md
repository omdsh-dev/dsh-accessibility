# DSH 实时播报辅助技术实验室

简体中文 | [English](AT-LIVE-LAB.md)

状态：供公开评审的探索性规程

规程：`dsh-live-at-lab/1.0.0-draft`

跟踪：[alpha.2 核心迁移 #22](https://github.com/omdsh-dev/dsh-accessibility/issues/22)、[VoiceOver #2](https://github.com/omdsh-dev/dsh-accessibility/issues/2)和 [NVDA #1](https://github.com/omdsh-dev/dsh-accessibility/issues/1)

## 目的与证据边界

本实验室为人工测试者提供六个确定、无密钥的 DSH `0.1.7-alpha.1` replay 场景：回答完成、回答停止、回答失败、问题、计划评审和工具审批。每次运行都会创建一次性 DSH home、Workspace 与空白 Session，并打印精确合成输入。Chrome 模式还会创建一次性浏览器 profile；system 与 Safari 模式不保证浏览器 profile 隔离。

实验室用于观察 DSH polite live region 在真实语音或盲文中的表现，以及播报前后的焦点行为。Host `turn/end` 行只能证明产品持久终态，不能证明读屏已经播报、只播报一次、措辞可理解或测试者仍能继续任务。实验室就绪、DOM 文本、无障碍树转储和可见字幕都不算 AT 通过。残障用户证据还需要知情同意和去标识化任务记录。

## 精确配置

启动器检查插件清单固定的精确 DSH 目标。已有活动记录仍绑定原始修订；不要把新版本观察填入旧活动的证据行。

按照[核心 AT 实验室](AT-CORE-LAB.zh.md)构建当前候选并安装本工具，然后在 companion checkout 中一次运行一个场景：

```sh
pnpm run lab:at:live ../deepseek-harness complete system
pnpm run lab:at:live ../deepseek-harness stop system
pnpm run lab:at:live ../deepseek-harness fail system
pnpm run lab:at:live ../deepseek-harness question system
pnpm run lab:at:live ../deepseek-harness plan system
pnpm run lab:at:live ../deepseek-harness approval system
```

共享的来源门禁会在创建状态前拒绝脏的 DSH 或无障碍实验室 checkout。macOS、Windows 或 Linux 都应优先用 `chrome` 代替 `system`：它会寻找已安装的 Chrome／Chromium，创建全新临时 profile、禁用后台联网并阻断非 loopback 主机解析。`safari` 只能配合专门的干净 profile；`system` 可能复用当前默认浏览器上下文。使用 `none` 时只打印一次性本地登录地址，不打开浏览器。不得公开该地址。就绪 JSON 会记录浏览器上下文隔离、精确 DSH 与实验室 revision、场景、操作系统、合成 Session id 和 `taskInput`。

必须原样复制 `taskInput`。如果 Session 没有自动选中，打开 `live-at-workspace` 下唯一的 Session。不要提交第二条提示词：replay fixture 有意保持有限，第二次调用必须失败，绝不能转向网络模型。

完成场景后回到终端按 Ctrl+C。启动器会关闭隔离 Chrome，并移除其浏览器 profile、DSH home、持久化、Workspace、replay override 与临时状态；不会创建上传、录音或公开 artifact。`system` 或 `safari` 留下的失效标签页需手动关闭。

带时限命令仅用于启动／清理冒烟：

```sh
pnpm run lab:at:live ../deepseek-harness complete none 500
```

带时限冒烟会解析所选 fixture 并创建一次性 Workspace／Session，但因为没有人消费 replay，所以有意不挂载可调用脚本。它不是实时状态或 AT 证据。

## 通用观察步骤

每个场景开始前，记录操作系统 build、浏览器版本、辅助技术及版本、UI 与语音语言、声音、详细度、标点、浏览／焦点模式、输入输出设备和精确 DSH revision。在提交 `taskInput` 前开始听读。

每次状态跃迁都记录：

- 实际语音或盲文，包括顺序和重复；
- 上一条播报是否被打断或合并；
- 播报前后的虚拟光标与键盘焦点；
- 用户能否在不看屏幕时理解下一步操作；
- 是否干扰 transcript 阅读或 composer 操作；
- 变通方式，以及任务是否仍能独立完成。

首次打开或重新打开 Session 时，历史状态必须保持静默。token 分片、耗时计时、嵌套工具 dispatch 和重复渲染不能刷屏。实际输出可能已本地化；记录真正听到的内容，不要翻译成预期英文。

## 场景任务

每个反引号场景名同时也是稳定的证据目录任务 ID。必须原样保留；编号只表示阅读顺序。

### 1. `complete`

提交 `taskInput`，不要为了追逐声音而移动焦点。验证回答开始只播报一次，持久成功终态只播报一次；完成播报不能早于最终回答可用，重新打开 Session 也不能把两条历史状态当作新活动重播。

### 2. `stop`

提交 `taskInput`，等部分输出开始后，不使用指针找到并激活“停止生成”。验证开始与停止状态可区分，部分回答仍可阅读，composer 恢复，并且之后不会出现与停止矛盾的完成播报。

### 3. `fail`

提交 `taskInput`，等待合成认证失败。验证播报的是失败而不是完成，错误恢复可以理解，焦点仍可使用，且不会朗读任何类似凭据或私人值的内容。该合成失败不包含真实凭据。

### 4. `question`

提交 `taskInput`，记录回答开始、根工具活动和“需要回答问题”播报。完全使用辅助技术与键盘回答合成问题，再记录工具结算与回答完成。检查选项名称、勾选状态、自定义回答字段、校验和焦点推进在实时播报期间仍可理解。

### 5. `plan`

提交打印出的 `/plan ...` 输入，记录回答／工具活动和“需要审阅计划”播报。阅读完整合成计划，用键盘／辅助技术批准，并验证决定、工具结算、回答完成和焦点恢复能够被播报或发现，且没有重复噪声。

### 6. `approval`

提交前把“访问模式”设为“只读”，确保合成写入命令需要审批。提交 `taskInput`，找到审批请求，阅读受限高度的命令详情，批准并记录回答／工具／请求状态。验证操作和风险可理解、控件可到达、批准后的工具结算、最终回答完成。命令只写入一次性 Workspace。

## 可复制结果模板

```md
### DSH 实时 AT 实验室结果

- 规程：dsh-live-at-lab/1.0.0-draft
- 场景／任务 ID：complete / stop / fail / question / plan / approval
- 日期／时间及测试者时区：
- 同意公开此去标识化结果：是／否
- 残障用户证据：否／是（只记录测试者愿意披露的使用需求）
- 操作系统及 build：
- 浏览器及精确版本：
- 辅助技术及精确版本：
- UI／语音语言、声音、详细度、标点、浏览／焦点模式：
- DSH revision：
- 无障碍实验室版本与 revision：
- 输入／输出设备：

| 状态跃迁／任务 | 实际语音／盲文 | 焦点／光标结果 | 重复／合并／打断 | 是否独立完成 | 变通方式 | 通过／失败／部分通过 | 严重程度 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 打开／重开历史基线 | | | | | | | |
| 回答开始 | | | | | | | |
| 工具或请求活动 | | | | | | | |
| 需要用户操作 | | | | | | | |
| 持久终态 | | | | | | | |
| 恢复与下一任务 | | | | | | | |

- 意外播报、静默、光标陷阱或 transcript 干扰：
- 敏感输出检查：
- 未测试状态：
- 已同意公开的脱敏证据链接：
- 评审者及评审日期：
```

每个精确操作系统／浏览器／辅助技术／语言／场景组合通过辅助技术结果表单单独提交一个 Issue。适用时引用 Issue #22，以及 VoiceOver #2 或 NVDA #1。部分通过、失败和矛盾结果必须保留，不得合并成笼统通过。

## 隐私与安全

- 只使用 `taskInput` 和一次性 `live-at-workspace`；绝不粘贴真实提示词、凭据、路径或对话。
- 优先使用带一次性浏览器 profile 的 `chrome`。只有准备了专门的干净 profile 才能使用 `system` 或 `safari`；若出现个人标签页、历史记录、书签、账户、扩展或自动填充界面，应在测试前立即停止。
- 不得公开一次性登录地址、原始语音历史或未经脱敏的 Host 输出。
- 未单独取得同意并逐帧／逐行检查时，不得录制或公开可识别音频、视频、截图、日志或盲文输出。
- 如果出现非本地 URL、个人 profile、意外网络模型或非合成内容，应立即停止。
- 强制终止最多只会在操作系统临时目录留下精确的 `dsh-live-at-lab-...` 目录。先检查，再把该精确目录移到废纸篓；绝不能删除宽泛的临时路径或 home。
