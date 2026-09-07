# 非辅助技术浏览器证据契约

简体中文 | [English](RFC-BROWSER-EVIDENCE.md)

状态：公开评审草案

协议：`dsh-non-at-browser/1.0.0-draft`

使用方：DSH `0.1.2-rc.1` 加 `dsh-v0.1.2-rc.1-a11y.4` 上的 Accessible View 与核心 P0 Web 路由；历史 alpha.2 记录继续作为精确 revision 归档

跟踪：[Issue #9](https://github.com/omdsh-dev/dsh-accessibility/issues/9)

## 决策

DSH 无障碍发布不能只依赖 DOM 名称与角色。开发期组装运行器因此通过 DSH 真实 ModuleLoader 加载外部 companion，并以显式版本化协议记录重排、焦点可见／遮挡、减少动态效果和强制颜色参与情况。

Accessible View 建立了可复用契约。核心使用方现在以十四项断言覆盖具名应用壳、静态 P0 任务路由、菜单、Settings、合成器编辑和 Full access 风险准入；归档报告把全部九项可用于声明的 `dsh-core-at-lab/1.0.0-draft` P0 任务 ID 映射到稳定检查。这仍然**不等于**整个 DSH 门禁完成：实时回答／工具／请求状态、错误恢复、无障碍创作输出、真实缩放与高对比度、发行阻塞、辅助技术输出及残障用户独立完成仍是分别验证的证据。

## 标准映射

| 要求 | 版本化参考 | 自动断言 | 证据边界 |
| --- | --- | --- | --- |
| 重排 | WCAG 2.2 SC 1.4.10（AA） | 在 640 和 320 CSS px 运行；要求文档 `scrollWidth` 不大于 `clientWidth`，并拒绝页面级程序化横向移动。 | 320 CSS px 是标准规定的 400% 等效尺寸；真实浏览器缩放、文字缩放和允许二维布局的内容仍需人工评审。 |
| 焦点可见 | WCAG 2.2 SC 2.4.7（AA） | 要求焦点控件匹配 `:focus-visible`，并有非零轮廓或阴影。 | 不测量焦点指示器像素面积或对比度。 |
| 焦点不被遮挡 | WCAG 2.2 SC 2.4.11（AA） | 计算控件与视口交集；获得焦点后，九个采样点中至少一个必须位于最上层。 | 证明最低采样边界，不证明全部像素可见，也不代表 AAA 增强条款。 |
| 交互触发动画 | WCAG 2.2 SC 2.3.3（AAA） | 在 `prefers-reduced-motion: reduce` 下，拒绝候选可见后代中可产生运动的 transition、具名 CSS animation 或移动／缩放／重定位的运行关键帧。 | 仅改变透明度／颜色不归类为运动；必要动画例外必须公开评审。 |
| 强制颜色 | CSS Color Adjustment Level 1 | 在 Chromium 强制颜色仿真中要求媒体查询命中，拒绝可见候选元素设置 `forced-color-adjust: none`，并记录控件计算颜色／边框。 | 浏览器仿真不是真实 Windows 高对比度观察，也不是非文本对比度认证。 |

规范与解释材料：

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [1.4.10 重排解释](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [2.4.11 焦点不被遮挡（最低）解释](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [2.3.3 交互触发动画解释](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [CSS Color Adjustment Module Level 1](https://www.w3.org/TR/css-color-adjust-1/)

## 运行器与数据流

`scripts/run-assembled-browser.mjs` 接收精确 DSH checkout、companion checkout 和逗号分隔浏览器列表。它核验包身份与版本，以排他创建方式把测试模板和可复用断言助手临时复制到 DSH Web 测试通道，运行 DSH 自有 Vitest／浏览器 scaffold，并在失败时也删除两份临时文件。

测试使用一次性 DSH home 和 DSH 合成 seeded-history fixture，不接触环境中的 DSH profile、凭据、工作区、提示词或会话。通过时不生成截图或上传 artifact。运行器只接受 `chromium`、`firefox`、`webkit`；CI 安装并执行三者。因为各引擎契约并不等价，强制颜色仿真暂时只在 Chromium 执行。

核心仓库以 `pnpm run test:web:accessibility` 提供允许脏工作树的诊断，以 `pnpm run test:web:accessibility:evidence` 生成发行证据。后者会拒绝脏 checkout，重新构建精确 commit，运行三个引擎，并输出由 [`CORE-BROWSER-EVIDENCE.schema.json`](CORE-BROWSER-EVIDENCE.schema.json) 校验的报告。必需断言缺失、重复、被跳过、失败或与引擎能力不一致都会 fail-closed；浏览器子集只能是 `partial`，绝不能是 `pass`。

## 证据记录

Accessible View 运行器为每个浏览器输出一份 JSON 对象；核心运行器在同一规程边界下聚合一份带逐引擎检查清单的报告。记录包含：

- 协议和证据类型；
- 精确标准标识；
- DSH 版本和 Git revision；
- 使用方身份，以及适用时的 companion 版本和 Git revision；
- OS、OS release、架构、浏览器引擎及版本；
- 640／320 CSS px 溢出测量；
- 每个控件的焦点状态、可见采样、视口交集、轮廓和阴影；
- 减少动态效果下的 transition／animation 结果；
- 支持时的强制颜色媒体状态、退出强制颜色数量和控件计算样本；
- 防止把记录误解成辅助技术或残障用户证据的固定限制。

只有每个必需测试进程以零退出、Schema 与语义清单校验通过，并且受测 commit 与记录 revision 相符时，记录才有效。脏工作树日志只能用于开发诊断，不能作为发布证据。第一份经过评审的核心记录归档于 [`33eb2d9e1e`](automated-evidence/core-browser/2026-08-31-dsh-0.1.2-alpha.2-33eb2d9e1e.json)；首轮活动精确候选另行生成于 [`5803bfcfdd`](automated-evidence/core-browser/2026-08-31-dsh-0.1.2-alpha.2-5803bfcfdd.json)；rc1 移植版又在精确干净 revision [`21859d968c`](automated-evidence/core-browser/2026-09-07-dsh-0.1.2-rc.1-21859d968c.json) 上独立重新生成。三份记录都不得跨 revision 继承或互换使用。

## 误报与例外策略

- 没有可复现的引擎缺陷，不得把当前一 CSS px 舍入容差继续放大。
- 不得只为变绿而排除选择器、控件、动画或区域。例外必须记录精确标准依据、负责人、到期／复核日期、合成复现，并提升协议次版本。
- SC 1.4.10 的二维内容例外必须是布局确有必要的局部滚动区，不能让页面本身增加第二个滚动方向。
- 必要运动例外必须说明去掉运动会损失什么信息或功能，并在标准要求时提供用户可控的无运动替代。
- 引擎不具备某能力时记为 `not-run`，绝不能记为 `pass`。

## 仍需人工与用户证据

自动浏览器结果不能证明真实浏览器缩放、Windows 高对比度主题、macOS 增加对比度、系统文字缩放、放大镜、低视力任务效率、开关／语音输入、语音输出、盲文输出或独立完成任务。发布证据必须为这些环境及经同意的残障用户研究保留分别命名的矩阵行。

把某条 DSH 核心路由视为已覆盖前，至少要人工验证：

1. 浏览器 200%／400% 缩放、支持时的仅文字缩放，以及信息／功能是否丢失；
2. Windows 高对比度主题与焦点指示器对比度；
3. sticky、modal、toast 和非模态层存在时，焦点控件及指示器是否可见；
4. 系统 Reduce Motion 下执行真实任务交互；
5. 全程仅键盘完成任务，不依赖指针恢复。

## 发布门禁

Accessible View 与核心使用方只有在精确 commit 的三个引擎任务全部通过后，才可标记 `evidence:automated`。归档核心记录已经满足静态 P0 路由扩展里程碑；但在实时与创作路由按适用范围使用本契约、人工检查行具备当前负责人／结果且失败会阻断相应发布前，Issue #9 保持开放。本 RFC 从不授权“完全无障碍”、认证、AT 已测试或用户已验证措辞。
