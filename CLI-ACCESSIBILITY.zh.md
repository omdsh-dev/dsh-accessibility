# DSH CLI 无障碍规程

[English](CLI-ACCESSIBILITY.md) | 简体中文

规程：`dsh-cli-accessibility/1.0.0-draft`

本规程定义 DSH 一次性 headless CLI 的稳定进程输出，以及必须由人完成的辅助技术证据。当前启动器精确面向 DSH `0.2.0-rc.2`；已归档的 alpha.2 结果仍只对应原始提交。自动检查通过只是必要的进程证据，不证明某一款读屏软件、终端或残障开发者已经能用该工作流。

## 规范性进程契约

产品入口必须在 headless profile 下暴露 `--accessibility` 与 `--output-format <text|json>`。

对于 `dsh --profile headless --accessibility "任务"`：

- stderr 开头必须且只能出现一行 `dsh: task started`，结尾必须且只能出现一行持久化终态；
- 抑制提供方推理增量；
- 最终 assistant 文本写入 stdout；
- 输出不得包含终端转义序列、BEL、退格、回车重绘、除换行或制表符之外的 C0/C1 控制字符、颜色、spinner、光标移动或动态计数；
- 错误诊断经过清洗并收敛为一行终态；
- 只有持久化 turn 完成时进程才以 `0` 退出。

对于 `dsh --profile headless --output-format json "任务"`：

- 自有 Session flush 完成后，stdout 只含一个以换行结尾的 JSON 对象，stderr 不含结果诊断；
- `type` 为 `dsh-headless-result`，`schemaVersion` 为 `1.0.0`，对象还包含 `status`、`text` 与 `reason`；
- 只有持久化 turn 完成时 `status` 才为 `completed`，其余均为 `failed`；
- `reason` 投影完成、结构化错误、aborted 原因、blocked、token 上限、interrupted、缺少 turn 及可扩展终态原因；
- 两个 flag 同时使用时，JSON 是唯一展示格式。

缺少任务或输出格式不受支持时，必须在请求模型前失败。默认 text 输出保留推理流，属于兼容模式，不在本无障碍声明范围内。

## 自动进程检查

在本仓库执行：

```console
pnpm run lab:cli -- ../deepseek-harness-alpha17 automated
```

启动器首先会拒绝 DSH 或无障碍实验室 checkout 中任何 tracked、staged 或 untracked 改动；随后核对精确 DSH 包版本、构建本地产品、向 DSH checkout 临时注入一个产品入口 E2E 测试、执行后删除。结果记录完整 DSH 与实验室 Git revision，并检查帮助发现、参数闭合失败、成功的无障碍文本与 JSON，以及失败的无障碍文本与 JSON。

输出中的 `automated-process-output-not-at-evidence` 记录只证明所检查的 stdout、stderr、退出状态和请求边界；它无法观察语音、盲文、终端光标行为、理解情况或独立完成任务。

在发布候选前应本地运行；当 CLI 输出实现、启动器或本规程发生变化时再进 CI。无关提交无需每次运行。

## 人工终端与读屏实验室

执行：

```console
pnpm run lab:cli -- ../deepseek-harness-alpha17 manual
```

启动器构建同一个本地 DSH revision，创建一次性 DSH home，并启动本地合成模型服务；不使用真实 API key 或个人工作区。两个命令通过当前终端直接输入输出；反引号名称是稳定的证据目录任务 ID：

1. `completed-response`——预期一行开始、`Accessible CLI response complete.` 和一行完成；
2. `authentication-failure`——预期一行开始与一行失败，随后退出状态为 `1`。

使用待测辅助技术操作终端。确认 token 碎片不会淹没语音队列、光标重绘不会重复内容、输出顺序可理解、答案与终态可区分、复查命令能重新阅读结果、中断状态可发现，并且用户无需明眼人协助即可判断任务是否成功。

仅启动实验室或看见终端文字不算 AT 通过。必须由人观察并记录真实语音或盲文输出与任务结果。

## 必填证据记录

每个环境和场景建立一份去标识记录，包含：

- 规程 ID、DSH 版本和 Git revision，以及无障碍实验室版本与 revision；
- 操作系统、终端及版本、shell，以及使用 PTY 还是重定向流；
- 辅助技术及版本、语音语言、详细度、标点设置；如适用还需记录盲文显示器和表；
- 稳定目录任务 ID、预期结果、按顺序记录的实际语音或盲文、光标或复查模式行为、任务完成情况与通过／失败；
- workaround、缺陷严重程度及观察者；
- 测试者是辅助技术专家，还是独立完成任务的残障开发者。

残障用户研究、录制、引用、补偿、同意、去标识、保存和撤回均遵循 [RESEARCH.zh.md](RESEARCH.zh.md)。不得把凭据、私密提示词、参与者原始数据或未脱敏路径上传到 CI artifact 或公开 Issue。

## 发布矩阵

最低候选矩阵如下：

| 平台 | 终端 | 辅助技术 | 必须取得的证据 |
| --- | --- | --- | --- |
| macOS | Terminal 与 iTerm2 | VoiceOver | 朗读顺序、复查导航、成功与失败 |
| Windows 11 | Windows Terminal／PowerShell | NVDA | 朗读顺序、复查导航、成功与失败 |
| Windows 11 | Windows Terminal／PowerShell | JAWS | 朗读顺序、复查导航、成功与失败 |
| Windows 11 | Windows Terminal／PowerShell | Narrator | 兼容性信号；不能替代 NVDA 或 JAWS |
| Linux | GNOME Terminal 或有记录的等价终端 | Orca | 朗读顺序、flat review、成功与失败 |
| 至少一个支持平台 | 测试者日常终端 | 可刷新盲文 | 行边界、状态区分、复查导航 |

每个候选 revision 都记录自动符合性。凡终端输出、影响终端行为的依赖或文档平台矩阵改变，均应重新完成相关人工 AT 行。在声明 `a11y-user-validated` 前，至少一位残障开发者必须独立完成有代表性的 CLI 核心任务。

## 当前限制

- 这是一次性、非交互 headless 命令的 draft 规程，不代表完整 DSH Web 或未来 TUI 体验。
- 自动检查只能看到进程流，无法看到终端无障碍 API 或读屏软件的语音与盲文展示。
- 分别重定向 stdout 和 stderr 时无法保留合并展示的跨流顺序；需要单流的机器消费者应使用 JSON。
- 默认 text 模式仍有意保留详细输出，不属于本候选无障碍范围。
- 在具名 AT 矩阵和残障用户任务证据完成并公开界定范围前，任何版本都不得称为“完全适配读屏软件”。
